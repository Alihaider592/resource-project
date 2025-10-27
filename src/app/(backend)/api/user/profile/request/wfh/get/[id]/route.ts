import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    const requests = await WorkFromHome.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("🔥 Fetch WFH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch WFH requests." },
      { status: 500 }
    );
  }
}
