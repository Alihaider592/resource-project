import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import connectToDatabase from "@/lib/db";
// import User from "@/models/User";
import connectdatabase from "@/app/(backend)/lib/db";
import User from "@/app/(backend)/models/signupuser";

export async function POST(req: Request) {
  try {
    await connectdatabase();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    await user.save();

    return NextResponse.json(
      { message: "Signup successful", user: { name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
