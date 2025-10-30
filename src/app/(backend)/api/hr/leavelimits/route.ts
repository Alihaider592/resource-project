// backend/api/hr/leave-limits.ts
import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveLimit from "@/app/(backend)/models/leaveLimits";

export async function POST(req: NextRequest) {
  await connectDatabase();
  const { leaveType, maxLeaves } = await req.json();
  const limit = await LeaveLimit.findOneAndUpdate(
    { leaveType },
    { maxLeaves },
    { upsert: true, new: true }
  );
  return NextResponse.json({ success: true, limit });
}

export async function GET() {
  await connectDatabase();
  const limits = await LeaveLimit.find({});
  return NextResponse.json({ limits });
}
