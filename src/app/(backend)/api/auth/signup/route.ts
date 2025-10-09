import { NextResponse, NextRequest } from "next/server";
// import { handleSignupRequest } from "../../controllers/auth.controller"; // ⬅️ Controller
import { handleSignupRequest } from "@/app/(backend)/controllers/auth.controller";

interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password }: SignupRequestBody = await req.json();

    // Field validation at Route level
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }
    
    // 1. DELEGATE to Controller
    const user = await handleSignupRequest({ name, email, password });

    return NextResponse.json(
      {
        message: "Signup successful",
        user,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Signup Route Handler Error:", errorMessage);

    // Error Translation
    let statusCode = 500;
    if (errorMessage.includes("already exists")) {
        statusCode = 409; // Conflict
    } else if (errorMessage.includes("required fields")) {
        statusCode = 400; // Bad Request
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
