import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";
import AddUser from "@/app/(backend)/models/adduser";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    await connectDatabase();

    const { email, password }: LoginRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let user: UserDocument | null = await SignupUser.findOne({ email });
    let source = "SignupUser";

    if (!user) {
      user = await AddUser.findOne({ email });
      source = "AddUser";
    }

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

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing JWT_SECRET" },
        { status: 500 }
      );
    }

    // ✅ Include name in JWT payload
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          source,
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";

    console.error("Login error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Internal Server Error" },
      { status: 500 }
    );
  }
}
