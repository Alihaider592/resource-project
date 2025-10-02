import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDatabase from "@/app/(backend)/lib/db";
import User from "@/app/(backend)/models/signupuser";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDatabase();

    const { email, password, adminKey } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Determine role based on adminKey
    let role = "user";
    if (adminKey) {
      if (adminKey !== process.env.ADMIN_SECRET_CODE) {
        return NextResponse.json(
          { error: "Invalid admin key" },
          { status: 403 }
        );
      }
      role = "admin";
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { id: user._id.toString(), role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: `${role === "admin" ? "Admin" : "User"} login successful`,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Login error:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown server error" }, { status: 500 });
  }
}
