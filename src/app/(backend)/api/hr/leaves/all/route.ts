import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
// import Leave from "@/app/(backend)/models/leaves";
import LeaveRequest from "@/app/(backend)/models/leaverequest";

export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    // Fetch all leaves for teamlead/HR
    const leaves = await LeaveRequest.find({}).sort({ startDate: -1 });

    return NextResponse.json({ success: true, leaves });
  } catch (err: unknown) {
    console.error("Error fetching all leaves:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
