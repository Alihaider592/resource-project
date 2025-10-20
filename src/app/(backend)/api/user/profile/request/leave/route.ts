import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveRequest, { ILeaveRequest } from "@/app/(backend)/models/leaverequest";
import User from "@/app/(backend)/models/adduser";
import { verifyAccess, DecodedUser } from "@/utils/authMiddleware";

// ✅ Create a leave request
export async function POST(req: NextRequest) {
  try {
    await connectDatabase();

    const user: DecodedUser = await verifyAccess(req);
    const { leaveType, startDate, endDate, reason } = await req.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const userId = user.id;
    if (!userId) {
      return NextResponse.json({ message: "Invalid or missing user ID" }, { status: 400 });
    }

    // Find approvers
    const teamLead = await User.findOne({ role: "team lead" });
    const hr = await User.findOne({ role: "hr" });

    // Save leave request with approverStatus initialized
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
      approverStatus: {}, // stores { email: 'approve' | 'reject' }
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

// ✅ Fetch leave requests for the logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    const user: DecodedUser = await verifyAccess(req);
    const userId = user.id;

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

// ✅ Approve or reject leave request
export async function PATCH(req: NextRequest) {
  try {
    await connectDatabase();

    const user: DecodedUser = await verifyAccess(req);
    const { leaveId, action } = await req.json(); // action: 'approve' or 'reject'

    if (!leaveId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return NextResponse.json({ message: "Leave not found" }, { status: 404 });

    const userEmail = user.email;

    // Only HR or Team Lead can approve/reject
    if (![leave.approvers.hr, leave.approvers.teamLead].includes(userEmail)) {
      return NextResponse.json({ message: "You are not authorized to approve/reject this leave" }, { status: 403 });
    }

    // Update the individual approver status
    leave.approverStatus = leave.approverStatus || {};
    leave.approverStatus[userEmail] = action;

    // Determine final leave status
    const statuses = Object.values(leave.approverStatus);
    if (statuses.includes("reject")) {
      leave.status = "rejected";
    } else if (
      leave.approvers.hr && leave.approvers.teamLead &&
      statuses.includes("approve") && statuses.length === 2
    ) {
      leave.status = "approved";
    } else {
      leave.status = "pending";
    }

    await leave.save();

    return NextResponse.json({ message: `Leave ${action}d successfully`, leave }, { status: 200 });
  } catch (err) {
    console.error("❌ Leave approval error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
