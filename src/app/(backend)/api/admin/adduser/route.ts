import { NextResponse } from "next/server";
import connectdatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";

// Interface to type-safely check for a MongoDB error code (e.g., E11000 for duplicate key)
interface MongoErrorWithCode extends Error {
  code?: number;
}

export async function POST(req: Request) {
  try {
    // 1. Database Connection
    await connectdatabase();

    const body = await req.json();
    console.log("📩 Incoming body (from client):", body);

    const { name, email, password, role } = body;

    // 2. Debugging Log: Confirm the role variable value before Mongoose receives it
    console.log(`🛠️ Role received from request: [${role}]`);

    // We pass 'role' directly. If 'role' is a valid enum string (e.g., "CEO"), Mongoose uses it.
    // If 'role' is undefined (not sent by client), Mongoose uses the schema default ("simple user").
    const newUser = await AddUser.create({
      name,
      email,
      password,
      role, 
    });

    // 3. Debugging Log: Confirm what Mongoose reports saving
    console.log("✅ Saved user (Mongoose response):", newUser);
    console.log(`✅ Saved user role: [${newUser.role}]`);

    return NextResponse.json({ message: "User created", user: newUser });
    
  } catch (error) {
    // 4. Critical Debug Log: This is the error message for the 500 status
    console.error("❌ Error during user creation:", error);

    // Cast the error for type-safe checking
    const dbError = error as MongoErrorWithCode;

    // Check for Mongoose Validation Error (e.g., failed enum check) OR MongoDB Duplicate Key Error (code 11000)
    if (dbError instanceof Error && (dbError.name === 'ValidationError' || dbError.code === 11000)) {
        return NextResponse.json({ 
            message: "Validation Error or Email Already Exists.", 
            error: dbError.message 
        }, { status: 400 }); // Use 400 for client-side errors
    }

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}