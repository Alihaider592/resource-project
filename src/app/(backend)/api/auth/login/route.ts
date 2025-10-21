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

    // ✅ Normalize role (same as in /me)
    const normalizeRole = (r: string = ""): string => {
      r = r.toLowerCase().trim().replace(/\s+/g, "");
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
          return r;
      }
    };

    const normalizedRole = normalizeRole(user.role);

    // ✅ Token names match /me route
    const tokenNames: Record<string, string> = {
      Admin: "admin-token",
      HR: "hr-token",
      "Team Lead": "teamlead-token",
      "Simple User": "user-token",
    };

    const tokenName = tokenNames[normalizedRole] || "user-token";

    // ✅ Build response
    const response = NextResponse.json(
      {
        message: "Login successful",
        token,
        tokenName,
        role: normalizedRole,
        user: { ...user, role: normalizedRole },
      },
      { status: 200 }
    );

    // ✅ Set secure cookie
    response.cookies.set(tokenName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("❌ Login Route Handler Error:", errorMessage);

    let statusCode = 500;
    if (errorMessage.includes("required")) statusCode = 400;
    else if (errorMessage.includes("Invalid email or password"))
      statusCode = 401;

    return NextResponse.json(
      { error: errorMessage || "Login Failed" },
      { status: statusCode }
    );
  }
}
