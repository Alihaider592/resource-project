import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";

interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: Request) {
  try {
    await connectDatabase();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await SignupUser.findById(payload.id).select("name email profilePic role");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDatabase();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const { name, profilePic } = await req.json();

    const updatedUser = await SignupUser.findByIdAndUpdate(
      payload.id,
      { name, profilePic },
      { new: true, select: "name email profilePic role" }
    );

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
