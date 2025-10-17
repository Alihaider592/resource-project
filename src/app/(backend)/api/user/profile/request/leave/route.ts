import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveRequest, { ILeaveRequest } from "@/app/(backend)/models/leaverequest";
import User from "@/app/(backend)/models/adduser";
import { verifyAccess, DecodedUser } from "@/utils/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    await connectDatabase();

    // ✅ Verify user
    const user: DecodedUser = await verifyAccess(req);

    // ✅ Parse request body
    const { leaveType, startDate, endDate, reason } = await req.json();
    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // ✅ Use user.id from token
    const userId = user.id;
    if (!userId) {
      return NextResponse.json({ message: "Invalid or missing user ID" }, { status: 400 });
    }

    // 🔍 Find approvers
    const teamLead = await User.findOne({ role: "team lead" });
    const hr = await User.findOne({ role: "hr" });

    // 📝 Save leave request
    const newRequest: ILeaveRequest = await LeaveRequest.create({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "pending",
      approvers: {
        teamLead: teamLead?.email || null,
        hr: hr?.email || null,
      },
    });

    return NextResponse.json(
      { message: "Leave request submitted successfully", data: newRequest },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Leave request error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    // ✅ Verify user
    const user: DecodedUser = await verifyAccess(req);
    const userId = user.id;

    // ✅ Fetch all leave requests for the user
    const leaves: ILeaveRequest[] = await LeaveRequest.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ message: "Leaves fetched successfully", leaves }, { status: 200 });
  } catch (err) {
    console.error("❌ Fetch leaves error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}
