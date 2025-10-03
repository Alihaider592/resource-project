import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";
import AddUser from "@/app/(backend)/models/adduser";

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

    // 1️⃣ Find user in SignupUser first, then AddUser
    let user = await SignupUser.findOne({ email });
    let source = "SignupUser";

    if (!user) {
      user = await AddUser.findOne({ email });
      source = "AddUser";
    }

    // If no user found
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 3️⃣ Role handling (admin / user)
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

    // 4️⃣ JWT Secret check
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    // 5️⃣ Generate token
    const token = jwt.sign(
      { id: user._id.toString(), role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6️⃣ Return success response
    return NextResponse.json(
      {
        message: `${role === "admin" ? "Admin" : "User"} login successful`,
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role,
          source, // tells you whether from AddUser or SignupUser
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
