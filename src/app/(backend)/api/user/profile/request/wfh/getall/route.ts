import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function GET() {
  try {
    await connectDatabase();
    const requests = await WorkFromHome.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching WFH requests:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
