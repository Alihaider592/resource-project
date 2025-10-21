import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";

export async function GET() {
  try {
    await connectDatabase();

    const count = await AddUser.countDocuments();

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching employee count:", error);
    return NextResponse.json({ count: 0, message: "Server error" }, { status: 500 });
  }
}
