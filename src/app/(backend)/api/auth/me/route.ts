import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Model, Document } from "mongoose";
import connectDatabase from "@/app/(backend)/lib/db";

// ✅ Import Models
import User from "@/app/(backend)/models/User";
import TeamLead from "@/app/(backend)/models/teamlead";
import AddUser from "@/app/(backend)/models/adduser";
import Admin from "@/app/(backend)/models/adduser"; // RE-ADDED: Ensure this file exists for your Admin model!

// Standardize the JWT_SECRET constant
// FIX: Corrected variable to JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "secret"; 
console.log(`[Auth Init] JWT Secret Loaded: ${JWT_SECRET.length > 10 ? 'Yes' : 'No'} (Length: ${JWT_SECRET.length})`);


/* -------------------------------------------------------------------------- */
/* ✅ TYPES                                                                   */
/* -------------------------------------------------------------------------- */
interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

// Minimal interface that all Mongoose documents share
interface GenericUserDoc extends Document {
  _id: string;
  email: string;
  role: string;
  [key: string]: unknown; // Allows dynamic property access
  
  // FIX: Simplified the constructor definition to remove the problematic 'any' signature.
  constructor: {
    modelName: string;
  };
}

/* -------------------------------------------------------------------------- */
/* ✅ DATABASE CONNECTION                                                     */
/* -------------------------------------------------------------------------- */
/** Ensures the MongoDB connection is active. */
async function ensureDB(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    await connectDatabase();
    console.log("✅ MongoDB connected");
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ HELPERS                                                                 */
/* -------------------------------------------------------------------------- */

/** Normalizes role string (e.g., 'team lead' -> 'Team Lead', 'hr' -> 'HR'). */
function normalizeRole(role?: string) {
  if (!role) return role;
  const r = role.toLowerCase().replace(/\s+/g, "");
  switch (r) {
    case "user":
    case "simpleuser":
      return "Simple User";
    case "hr":
    case "human resource":
      return "HR";
    case "teamlead":
    case "team lead":
    case "lead":
      return "Team Lead";
    case "admin":
    case "administrator":
      return "admin"; // Consistent normalization
    default:
      return role;
  }
}

/** Verifies the JWT from the request headers. */
function verifyToken(req: NextRequest): DecodedToken | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.warn("⚠️ Missing or invalid Authorization header");
      return null;
    }

    const token = authHeader.split(" ")[1];
    
    // Use the standardized JWT_SECRET constant
    const decoded = jwt.verify(
      token,
      JWT_SECRET // Use the defined constant
    ) as DecodedToken;

    if (!decoded?.id || !decoded?.role) {
      console.warn("⚠️ Invalid token payload");
      return null;
    }

    return decoded;
  } catch (error) {
    // Log the specific error (e.g., 'jwt expired', 'invalid signature')
    const errorMessage = (error as Error).message;
    console.error(`❌ Token verification failed: ${errorMessage}. Check JWT_SECRET consistency or token expiration.`); // ENHANCED LOGGING
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ GET — FETCH CURRENT USER PROFILE                                        */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const decoded = verifyToken(req);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }

    // 💡 CASCADING SEARCH: Find user across all models to ensure robustness
    console.log(`GET /me: Starting cascading search for user ID: ${decoded.id}`);
    
    // Note: .lean() is used here, so it returns a plain object, not a Mongoose Document instance
    const user = 
        (await User.findById(decoded.id).lean()) as GenericUserDoc | null || 
        (await TeamLead.findById(decoded.id).lean()) as GenericUserDoc | null || 
        (await AddUser.findById(decoded.id).lean()) as GenericUserDoc | null ||
        (await Admin.findById(decoded.id).lean()) as GenericUserDoc | null; // Added Admin check


    if (!user) {
      // Log the exact failure
      console.log(`GET /me: User ID ${decoded.id} not found after cascading search.`);
      return NextResponse.json(
        { message: "User not found or deleted." },
        { status: 404 }
      );
    }
    
    // Normalize the role before sending
    if (user.role) {
        user.role = normalizeRole(user.role) as string;
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ GET /me error:", error);
    return NextResponse.json(
      {
        message: "Server error while fetching profile",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ PUT — UPDATE PROFILE SAFELY (using atomic update)                       */
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

    // 🧱 Prevent critical fields modification
    const { role, _id, email, password, ...unsafeBody } = body;

    // 💡 CASCADING FIND: Find the document across all models to determine which Model to use
    // We fetch the document instance here to access the constructor/Model object
    const userDoc = 
        (await User.findById(decoded.id).exec() as GenericUserDoc | null) || 
        (await TeamLead.findById(decoded.id).exec() as GenericUserDoc | null) || 
        (await AddUser.findById(decoded.id).exec() as GenericUserDoc | null) ||
        (await Admin.findById(decoded.id).exec() as GenericUserDoc | null); // Added Admin check

    if (!userDoc) {
        console.log(`PUT /me: User ID ${decoded.id} not found after cascading search.`);
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Get the Mongoose Model constructor from the found document
    // We cast to Model<GenericUserDoc> which contains the correct findByIdAndUpdate signature
    const ModelToUse = userDoc.constructor as Model<GenericUserDoc>;
    const modelName = userDoc.constructor.modelName;
    console.log(`PUT /me: User found in Model: ${modelName}. Preparing atomic update...`);
    
    // 🧠 Prepare the update object, filtering out empty strings and undefined values
    const updateObject: Record<string, unknown> = {};
    const updateKeys = Object.keys(unsafeBody);

    updateKeys.forEach((key) => {
      const value = unsafeBody[key];
      
      if (typeof value === "string") {
        const trimmedValue = value.trim();
        // Only include non-empty strings
        if (trimmedValue !== "") {
          updateObject[key] = trimmedValue;
        }
      } else if (value !== undefined) {
          // Include non-string values (numbers, booleans, arrays) if they are defined
          updateObject[key] = value;
      }
    });

    if (Object.keys(updateObject).length === 0) {
        console.log("PUT /me: No valid fields to update.");
        const userLean = userDoc.toObject();
         if (userLean.role) {
            userLean.role = normalizeRole(userLean.role) as string;
        }
        return NextResponse.json({
            success: true,
            message: "Profile retrieved (no changes applied)",
            user: userLean,
        });
    }

    console.log(`PUT /me: Attempting to update fields: ${Object.keys(updateObject).join(', ')}`);


    // 3. ATOMIC UPDATE: Use findByIdAndUpdate to bypass full document validation
    // This runs validators ONLY on the fields specified in $set, resolving the issue.
    const updatedUser = await ModelToUse.findByIdAndUpdate(
        decoded.id,
        { $set: updateObject },
        {
            new: true, // Return the new document
            runValidators: true, // Crucial: runs validators ONLY on the fields being updated
            lean: true // Return a plain JS object for the response
        }
    ).exec() as GenericUserDoc | null;


    if (!updatedUser) {
        // This handles a rare case where the user is deleted between finding and updating
        return NextResponse.json({ message: "User not found during update." }, { status: 404 });
    }
    
    // Normalize the role before sending
    if (updatedUser.role) {
        updatedUser.role = normalizeRole(updatedUser.role) as string;
    }

    console.log("PUT /me: Update successful.");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ PUT /me error (Catch Block):", error);
    
    // Attempt to extract Mongoose validation error message
    let errorMessage = "Server error while updating profile";
    let status = 500;
    
    const err = error as Error & { name?: string, errors?: Record<string, { message: string }> };

    if (err.name === 'ValidationError' && err.errors) {
        const errorKeys = Object.keys(err.errors);
        if (errorKeys.length > 0) {
            // Provide the first validation message to the client
            errorMessage = `Validation failed: ${err.errors[errorKeys[0]].message}`;
        } else {
            errorMessage = "Validation failed. Please check your input fields.";
        }
        status = 400;
        console.error("Mongoose Validation Details:", err.errors);
    }


    return NextResponse.json(
      {
        message: errorMessage,
        error: (error as Error).message,
      },
      { status: status }
    );
  }
}
