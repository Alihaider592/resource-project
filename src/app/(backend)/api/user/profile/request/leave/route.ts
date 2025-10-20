import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveRequest, { ILeaveRequest } from "@/app/(backend)/models/leaverequest";
import User from "@/app/(backend)/models/adduser";
import { verifyAccess, DecodedUser } from "@/utils/authMiddleware";

// Roles enum
export enum UserRole {
  USER = "Simple user",
  HR = "HR",
  TEAM_LEAD = "Team Lead",
  ADMIN = "Admin",
}

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

    // Find HR and Team Lead (case-insensitive)
    const teamLead = await User.findOne({ role: new RegExp(`^${UserRole.TEAM_LEAD}$`, "i") });
    const hr = await User.findOne({ role: new RegExp(`^${UserRole.HR}$`, "i") });

    if (!teamLead || !hr) {
      return NextResponse.json(
        { message: "HR or Team Lead not found in the system. Cannot create leave request." },
        { status: 400 }
      );
    }

    // Save leave request with approverStatus initialized
    const newRequest: ILeaveRequest = await LeaveRequest.create({
      userId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "pending",
      approvers: {
        teamLead: teamLead.email,
        hr: hr.email,
      },
      approverStatus: {}, // will store { email: 'approve' | 'reject' }
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

// ✅ Fetch leave requests
export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    const user: DecodedUser = await verifyAccess(req);
    const userEmail = user.email;

    let leaves: ILeaveRequest[];

    // If user is HR or Team Lead → fetch leaves where they are approvers
    const approverRoles = [UserRole.HR, UserRole.TEAM_LEAD];
    if (approverRoles.includes(user.role as UserRole)) {
      leaves = await LeaveRequest.find({
        $or: [
          { "approvers.hr": userEmail },
          { "approvers.teamLead": userEmail },
        ],
      }).sort({ createdAt: -1 });
    } else {
      // Normal user → fetch own leaves
      leaves = await LeaveRequest.find({ userId: user.id }).sort({ createdAt: -1 });
    }

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
    const { leaveId, action } = await req.json();

    if (!leaveId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return NextResponse.json({ message: "Leave not found" }, { status: 404 });

    const userEmail = user.email;

    if (![leave.approvers.hr, leave.approvers.teamLead].includes(userEmail)) {
      return NextResponse.json({ message: "You are not authorized to approve/reject this leave" }, { status: 403 });
    }

    // Update approver status
    leave.approverStatus = leave.approverStatus || {};
    leave.approverStatus[userEmail] = action;

    // Update overall status
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
      { message: err instanceof Error ? err.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}
