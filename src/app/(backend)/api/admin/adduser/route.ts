import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { name, email, password } = await req.json();
console.log('1111111111111')
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await AddUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AddUser.create({ name, email, password: hashedPassword });

    return NextResponse.json({
      message: "User added successfully",
      user: { id: user._id.toString(), name: user.name, email: user.email }, 
    }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

