import { NextResponse, NextRequest } from "next/server";
import { handleLoginRequest } from "@/app/(backend)/controllers/auth.controller";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password }: LoginRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { token, user } = await handleLoginRequest({ email, password });

    const normalizedUser = {
      ...user,
      role: user.role?.toLowerCase().replace(/\s+/g, ""),
    };

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: normalizedUser,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("❌ Login Route Handler Error:", errorMessage);

    let statusCode = 500;

    if (errorMessage.includes("required")) {
      statusCode = 400;
    } else if (errorMessage.includes("Invalid email or password")) {
      statusCode = 401;
    } else if (errorMessage.includes("JWT_SECRET")) {
      statusCode = 500;
    }

    return NextResponse.json(
      { error: errorMessage || "Login Failed" },
      { status: statusCode }
    );
  }
}
