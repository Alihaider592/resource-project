import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";
import bcrypt from "bcryptjs";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function POST(req: Request) {
  try {
    await connectDatabase();

    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const role = formData.get("role")?.toString() || "simple user";

    console.log("📩 Received role:", role);

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedRoles = ["simple user", "admin", "HR", "Team Lead"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { message: `Invalid role: ${role}` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await AddUser.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("✅ User created:", newUser);

    return NextResponse.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
