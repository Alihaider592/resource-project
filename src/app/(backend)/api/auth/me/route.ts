import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Model, Document } from "mongoose";
import connectDatabase from "@/app/(backend)/lib/db";

// ✅ Import Models
import User from "@/app/(backend)/models/User";
import TeamLead from "@/app/(backend)/models/teamlead";
import AddUser from "@/app/(backend)/models/adduser";

// Standardize the JWT_SECRET constant
const JWT_SECRET = process.env.JWT_SECRET || "secret";
console.log(
  `[Auth Init] JWT Secret Loaded: ${JWT_SECRET.length > 10 ? "Yes" : "No"} (Length: ${JWT_SECRET.length})`
);

/* -------------------------------------------------------------------------- */
/* ✅ TYPES                                                                   */
/* -------------------------------------------------------------------------- */
interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

interface GenericUserDoc extends Document {
  _id: string;
  email: string;
  role: string;
  [key: string]: unknown;
  constructor: {
    modelName: string;
  };
}

/* -------------------------------------------------------------------------- */
/* ✅ DATABASE CONNECTION                                                     */
/* -------------------------------------------------------------------------- */
async function ensureDB(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    await connectDatabase();
    console.log("✅ MongoDB connected");
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ HELPERS                                                                 */
/* -------------------------------------------------------------------------- */
function normalizeRole(role?: string) {
  if (!role) return role;
  const r = role.toLowerCase().replace(/\s+/g, "");
  switch (r) {
    case "user":
    case "simpleuser":
      return "Simple User";
    case "hr":
    case "humanresource":
      return "HR";
    case "teamlead":
    case "team lead":
    case "lead":
      return "Team Lead";
    case "admin":
    case "administrator":
      return "admin";
    default:
      return role;
  }
}

function getModelByRole(role: string): Model<GenericUserDoc> | null {
  const normalizedRole = normalizeRole(role) || "";
  switch (normalizedRole) {
    case "Team Lead":
      return TeamLead as unknown as Model<GenericUserDoc>;
    case "Simple User":
    case "HR":
    case "admin":
      return User as unknown as Model<GenericUserDoc>;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ TOKEN VERIFICATION — UPDATED TO SUPPORT MULTIPLE TOKEN NAMES            */
/* -------------------------------------------------------------------------- */
function verifyToken(req: NextRequest): DecodedToken | null {
  try {
    // ✅ Check both Authorization header and cookies
    const authHeader = req.headers.get("authorization");
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // ✅ Look for all possible tokens in cookies
      const cookieTokens = [
        req.cookies.get("admin-token")?.value,
        req.cookies.get("hr-token")?.value,
        req.cookies.get("teamlead-token")?.value,
        req.cookies.get("user-token")?.value,
        req.cookies.get("token")?.value, // fallback for old token name
      ].filter(Boolean);

      token = cookieTokens[0] || null;
    }

    if (!token) {
      console.warn("⚠️ No token found in headers or cookies");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decoded?.id || !decoded?.role) {
      console.warn("⚠️ Invalid token payload");
      return null;
    }

    return decoded;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`❌ Token verification failed: ${errorMessage}`);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ GET — FETCH CURRENT USER PROFILE (UPDATED)                               */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const decoded = verifyToken(req);

    if (!decoded) {
      console.warn("GET /me: Unauthorized, token missing or invalid");
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    console.log(`GET /me: Looking up user ID: ${decoded.id} with role: ${decoded.role}`);

    let user: GenericUserDoc | null = null;

    // Try fetching user based on normalized role first
    const ModelFromRole = getModelByRole(decoded.role);
    if (ModelFromRole) {
      user = (await ModelFromRole.findById(decoded.id).lean()) as GenericUserDoc | null;
    }

    // Fallback: try all models if not found
    if (!user) {
      user =
        ((await User.findById(decoded.id).lean()) as GenericUserDoc | null) ||
        ((await TeamLead.findById(decoded.id).lean()) as GenericUserDoc | null) ||
        ((await AddUser.findById(decoded.id).lean()) as GenericUserDoc | null);
    }

    if (!user) {
      console.warn(`GET /me: User not found for ID ${decoded.id}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Normalize role string for frontend
    if (user.role) {
      user.role = normalizeRole(user.role) as string;
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("❌ GET /me error:", error);
    return NextResponse.json(
      { message: "Server error while fetching profile", error: (error as Error).message },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ PUT — UPDATE PROFILE SAFELY                                             */
/* -------------------------------------------------------------------------- */
export async function PUT(req: NextRequest) {
  try {
    await ensureDB();
    const decoded = verifyToken(req);

    if (!decoded) {
      console.log("PUT /me: Invalid or missing token.");
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { role, _id, email, password, ...unsafeBody } = body;

    let ModelToUse: Model<GenericUserDoc> | null = null;
    let userDoc: GenericUserDoc | null = null;

    const ModelFromRole = getModelByRole(decoded.role);
    if (ModelFromRole) {
      ModelToUse = ModelFromRole;
      userDoc = (await ModelToUse.findById(decoded.id).exec()) as GenericUserDoc | null;
    }

    if (!userDoc) {
      userDoc =
        ((await User.findById(decoded.id).exec()) as GenericUserDoc | null) ||
        ((await TeamLead.findById(decoded.id).exec()) as GenericUserDoc | null) ||
        ((await AddUser.findById(decoded.id).exec()) as GenericUserDoc | null);

      if (userDoc) ModelToUse = userDoc.constructor as Model<GenericUserDoc>;
    }

    if (!userDoc || !ModelToUse) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updateObject: Record<string, unknown> = {};
    for (const key of Object.keys(unsafeBody)) {
      const value = unsafeBody[key];
      if (typeof value === "string" && value.trim() !== "") {
        updateObject[key] = value.trim();
      } else if (value !== undefined) {
        updateObject[key] = value;
      }
    }

    const updatedUser = (await ModelToUse.findByIdAndUpdate(
      decoded.id,
      { $set: updateObject },
      { new: true, runValidators: true, lean: true }
    ).exec()) as GenericUserDoc | null;

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found during update" }, { status: 404 });
    }

    if (updatedUser.role) {
      updatedUser.role = normalizeRole(updatedUser.role) as string;
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ PUT /me error:", error);
    return NextResponse.json(
      { message: "Server error while updating profile", error: (error as Error).message },
      { status: 500 }
    );
  }
}
