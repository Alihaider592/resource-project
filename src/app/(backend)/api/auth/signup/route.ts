import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDatabase from "@/app/(backend)/lib/db";
import User from "@/app/(backend)/models/signupuser";

export async function POST(req: Request) {
  try {
    await connectDatabase();

    const { name, email, password, adminKey } = await req.json();

    if (!name || !email || !password || !adminKey) {
      return NextResponse.json(
        { error: "All fields including admin code are required" },
        { status: 400 }
      );
    }

    // Check if adminKey matches your secret
    if (adminKey !== process.env.ADMIN_SECRET_CODE) {
      return NextResponse.json(
        { error: "Invalid admin key" },
        { status: 403 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", // assign admin role
    });

    return NextResponse.json(
      {
        message: "Admin signup successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Signup error:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
