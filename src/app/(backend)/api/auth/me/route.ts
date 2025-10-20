import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Model, Document } from "mongoose";
import connectDatabase from "@/app/(backend)/lib/db";

// ✅ Import Models
import User from "@/app/(backend)/models/User";
import TeamLead from "@/app/(backend)/models/teamlead";
import AddUser from "@/app/(backend)/models/adduser";
// Admin model is omitted as the file does not exist, but we will assume its user data resides in one of the imported models.

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
      return "Admin"; // Consistent normalization
    default:
      return role;
  }
}

/** * Maps a decoded role to the corresponding Mongoose Model.
 * @param role The role string from the JWT.
 * @returns The Mongoose Model or null if not explicitly mapped.
 */
function getModelByRole(role: string): Model<GenericUserDoc> | null {
    const normalizedRole = normalizeRole(role) || '';
    
    switch (normalizedRole) {
        case "Team Lead":
            // FIX: Use 'as unknown as' to resolve TS2352 casting error
            return TeamLead as unknown as Model<GenericUserDoc>;
        case "Simple User":
        case "HR":
        case "Admin":
            // FIX: Use 'as unknown as' to resolve TS2352 casting error
            // Assuming default or less specific roles (including Admin) are in the primary User model
            return User as unknown as Model<GenericUserDoc>;
        default:
            // Fallback for custom roles or models we can't import
            return null; 
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
        (await AddUser.findById(decoded.id).lean()) as GenericUserDoc | null;


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

    // --- NEW LOGIC: Determine Model based on Token Role for Targeted Update ---
    let ModelToUse: Model<GenericUserDoc> | null = null;
    let userDoc: GenericUserDoc | null = null;

    // 1. Try to get the model directly from the role in the JWT
    const ModelFromRole = getModelByRole(decoded.role);

    if (ModelFromRole) {
        // Targeted find on the model associated with the JWT role
        ModelToUse = ModelFromRole;
        // The ModelToUse is already cast to the correct generic type
        userDoc = await ModelToUse.findById(decoded.id).exec() as GenericUserDoc | null;

        if (userDoc) {
            console.log(`PUT /me: User found in Model '${ModelToUse.modelName}' based on JWT role.`);
        } else {
            console.warn(`PUT /me: User ID ${decoded.id} NOT found in expected model '${ModelToUse.modelName}' (Role: ${decoded.role}). Falling back to cascading search...`);
        }
    } 
    
    // 2. Fallback to Cascading Search if the role-based find failed or wasn't mapped
    if (!userDoc) {
        // This search finds the document and lets us derive the correct ModelToUse from its constructor
        userDoc = 
            (await User.findById(decoded.id).exec() as GenericUserDoc | null) || 
            (await TeamLead.findById(decoded.id).exec() as GenericUserDoc | null) || 
            (await AddUser.findById(decoded.id).exec() as GenericUserDoc | null);

        if (userDoc) {
             // If found via cascading search, set ModelToUse from the document's constructor
            ModelToUse = userDoc.constructor as Model<GenericUserDoc>;
            console.log(`PUT /me: User found via cascading search in Model: ${ModelToUse.modelName}`);
        }
    }
    // ---------------------------------------------------------------------------

    if (!userDoc || !ModelToUse) {
        console.log(`PUT /me: User ID ${decoded.id} not found in any available model.`);
      return NextResponse.json(
        { message: "User not found or model not recognized." },
        { status: 404 }
      );
    }

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

    console.log(`PUT /me: Attempting atomic update on Model ${ModelToUse.modelName} for fields: ${Object.keys(updateObject).join(', ')}`);


    // 3. ATOMIC UPDATE: Use findByIdAndUpdate to bypass full document validation
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
        // This means the document existed in the search but was missing during the update operation.
        return NextResponse.json({ message: `User not found in ${ModelToUse.modelName} during update. Authentication token may be stale.` }, { status: 404 });
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
