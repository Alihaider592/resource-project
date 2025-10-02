import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";
import jwt from "jsonwebtoken";

// Define the expected body type
interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    // ✅ Connect to DB
    await connectDatabase();

    // ✅ Parse and type body
    const body: LoginRequestBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Check if user exists
    const user = await SignupUser.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Ensure JWT_SECRET exists
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ Missing JWT_SECRET in environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    // ✅ Send response
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Login error:", err);

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Unknown server error" },
      { status: 500 }
    );
  }
}
