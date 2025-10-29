import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import User from "@/app/(backend)/models/users";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase(); // make sure DB is connected
    const { id } = params;

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
