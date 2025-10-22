import { NextRequest, NextResponse } from "next/server";
import { handleLoginRequest } from "@/app/(backend)/controllers/auth.controller";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log("Login attempt:", email);

    const { token, user } = await handleLoginRequest({ email, password });

    console.log("Login success:", user);

    // Set cookie
    const response = NextResponse.json({ message: "Login successful", token, user }, { status: 200 });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("❌ Login Route Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
