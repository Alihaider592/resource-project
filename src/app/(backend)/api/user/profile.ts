import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";

interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await SignupUser.findById(payload.id).select("name email role avatar");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDatabase();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Read form data
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const avatarFile = formData.get("avatar") as File | null;

    const user = await SignupUser.findById(payload.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (name) user.name = name;
    if (email) user.email = email;

    if (avatarFile) {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      user.avatar = `data:${avatarFile.type};base64,${base64}`;
    }

    await user.save();

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
