import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveRequest from "@/app/(backend)/models/leaverequest";

/* -------------------------------------------------------------------------- */
/* ✅ CREATE NEW LEAVE REQUEST (No Auth Required)                             */
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
      approvers: { teamLead: null, hr: null },
      approverStatus: {},
      approverComments: [],
    });

    return NextResponse.json(
      { message: "✅ Leave request submitted successfully", data: newLeave },
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
/* ✅ GET ALL LEAVE REQUESTS (For HR & Team Lead Dashboard)                   */
/* -------------------------------------------------------------------------- */
export async function GET() {
  try {
    await connectDatabase();

    const leaves = await LeaveRequest.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        message:
          leaves.length > 0
            ? "✅ Leaves fetched successfully"
            : "No leave requests found.",
        leaves: leaves.map((l) => ({
          ...l,
          approvers: l.approvers || { teamLead: null, hr: null },
        })),
      },
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
/* ✅ UPDATE LEAVE REQUEST STATUS (Approve/Reject + Comments)                 */
/* -------------------------------------------------------------------------- */
export async function PATCH(req: NextRequest) {
  try {
    await connectDatabase();

    const { leaveId, action, comment, approverName, role } = await req.json();

    // ✅ Validation
    if (!leaveId || !action || !approverName || !role) {
      return NextResponse.json(
        { message: "Missing required fields: leaveId, action, approverName, role." },
        { status: 400 }
      );
    }

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) {
      return NextResponse.json({ message: "Leave not found." }, { status: 404 });
    }

    if (action === "reject" && !comment) {
      return NextResponse.json(
        { message: "Rejection reason is required when rejecting." },
        { status: 400 }
      );
    }

    // ✅ Update approvers based on role
    if (role === "teamlead") leave.approvers.teamLead = approverName;
    if (role === "hr") leave.approvers.hr = approverName;

    // ✅ Update approver status map
    leave.approverStatus.set(role, action);

    // ✅ Push comment
    leave.approverComments.push({
      approver: approverName,
      action,
      comment: comment || "",
      date: new Date(),
    });

    // ✅ Only mark overall leave as "approved" if both HR + Team Lead approve
    const bothApproved =
      leave.approverStatus.get("teamlead") === "approve" &&
      leave.approverStatus.get("hr") === "approve";

    const anyRejected =
      leave.approverStatus.get("teamlead") === "reject" ||
      leave.approverStatus.get("hr") === "reject";

    if (anyRejected) {
      leave.status = "rejected";
    } else if (bothApproved) {
      leave.status = "approved";
    } else {
      leave.status = "pending";
    }

    await leave.save();

    return NextResponse.json(
      { message: `✅ Leave ${action}d successfully`, leave },
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
