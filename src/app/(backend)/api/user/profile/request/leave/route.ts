import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveRequest from "@/app/(backend)/models/leaverequest";

/* -------------------------------------------------------------------------- */
/* ✅ CREATE NEW LEAVE REQUEST (no auth)                                      */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    await connectDatabase();

    const { name, email, leaveType, startDate, endDate, reason } = await req.json();

    if (!name || !email || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const newLeave = await LeaveRequest.create({
      name,
      email,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "pending",
      approverComments: [],
    });

    return NextResponse.json(
      { message: "Leave request submitted successfully", data: newLeave },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error submitting leave:", error);
    return NextResponse.json(
      { message: "Server error while submitting leave" },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ GET ALL LEAVE REQUESTS (for HR & TeamLead)                              */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    await connectDatabase();

    const leaves = await LeaveRequest.find().sort({ createdAt: -1 });

    if (!leaves.length) {
      return NextResponse.json(
        { message: "No leave requests found", leaves: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Leaves fetched successfully", leaves },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching leaves:", error);
    return NextResponse.json(
      { message: "Server error while fetching leaves" },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ UPDATE LEAVE REQUEST STATUS (approve/reject + comment)                  */
/* -------------------------------------------------------------------------- */
export async function PATCH(req: NextRequest) {
  try {
    await connectDatabase();

    const { leaveId, action, comment, approverName } = await req.json();

    if (!leaveId || !action || !approverName) {
      return NextResponse.json(
        { message: "Missing required fields (leaveId, action, approverName)." },
        { status: 400 }
      );
    }

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) {
      return NextResponse.json({ message: "Leave not found" }, { status: 404 });
    }

    if (action === "reject" && !comment) {
      return NextResponse.json(
        { message: "Rejection reason is required when rejecting a leave." },
        { status: 400 }
      );
    }

    leave.status = action === "approve" ? "approved" : "rejected";

    leave.approverComments.push({
      approver: approverName,
      action,
      comment: comment || "",
      date: new Date(),
    });

    await leave.save();

    return NextResponse.json(
      { message: `Leave ${action}d successfully`, leave },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating leave:", error);
    return NextResponse.json(
      { message: "Server error while updating leave" },
      { status: 500 }
    );
  }
}
