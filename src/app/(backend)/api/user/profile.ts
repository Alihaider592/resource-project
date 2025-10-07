import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import SignupUser from "@/app/(backend)/models/signupuser";
import jwt from "jsonwebtoken";

export const config = { api: { bodyParser: false } };

interface JwtPayload {
  id: string;
  role: string;
}

export async function PUT(req: NextRequest) {
  await connectDatabase();

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Read multipart form data
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const avatarFile = formData.get("avatar") as File | null;

    const user = await SignupUser.findById(payload.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.name = name || user.name;
    user.email = email || user.email;

    if (avatarFile) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      user.avatar = `data:${avatarFile.type};base64,${buffer.toString("base64")}`;
    }

    await user.save();
    return NextResponse.json({ user }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
