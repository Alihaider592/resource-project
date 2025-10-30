// src/app/(backend)/api/hr/leave-counts/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveLimit from "@/app/(backend)/models/leaveLimits";

/**
 * GET: Fetch all leave limits / remaining leaves
 */
export async function GET() {
  try {
    await connectDatabase();

    // Fetch all leave limits from DB
    const limits = await LeaveLimit.find({});

    // Return JSON
    return NextResponse.json({ success: true, limits });
  } catch (err: unknown) {
    console.error("Error fetching leave counts:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST: Optional endpoint to update leave counts (like HR can adjust remaining leaves)
 */
export async function POST(req: NextRequest) {
  try {
    await connectDatabase();

    const { leaveType, maxLeaves } = await req.json();

    if (!leaveType || typeof maxLeaves !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    const updated = await LeaveLimit.findOneAndUpdate(
      { leaveType },
      { maxLeaves },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, limit: updated });
  } catch (err: unknown) {
    console.error("Error updating leave counts:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
