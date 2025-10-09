import { NextResponse, NextRequest } from "next/server";
// import { handleLoginRequest } from "../../controllers/auth.controller"; // ⬅️ Controller Import
import { handleLoginRequest } from "@/app/(backend)/controllers/auth.controller";

// Interface for type safety on request body
interface LoginRequestBody {
  email: string;
  password: string;
}

/**
 * Route Handler: Handles the POST request for user login.
 * Delegates authentication, password verification, and token generation to the Controller/Service.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. I/O: Read and parse the request body
    const { email, password }: LoginRequestBody = await req.json();

    // Route-level check: Missing fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. DELEGATE: Call the Controller function
    // Controller handles the heavy lifting: finding user, verifying password, and generating JWT.
    const { token, user } = await handleLoginRequest({ email, password });

    // 3. I/O: Send the final success response (200 OK)
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user, // Cleaned user data (no password)
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // 4. ERROR TRANSLATION: Catch errors thrown by the Service
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("❌ Login Route Handler Error:", errorMessage);

    let statusCode = 500;
    
    // Check for common authentication errors thrown by the Service
    if (errorMessage.includes("required")) {
        statusCode = 400; // Bad Request/Missing fields
    } else if (errorMessage.includes("Invalid email or password")) {
        statusCode = 401; // Unauthorized
    } else if (errorMessage.includes("JWT_SECRET")) {
        statusCode = 500; // Server misconfiguration
    }

    return NextResponse.json(
      { error: errorMessage || "Login Failed" },
      { status: statusCode }
    );
  }
}
