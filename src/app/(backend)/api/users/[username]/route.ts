import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";

export async function GET(req: NextRequest, { params }: { params: { username: string }}) {
  await connectDatabase();
  const user = await AddUser.findOne({ username: params.username }).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}
