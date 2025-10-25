// src/app/(backend)/api/user/profile/request/leave/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import LeaveRequest, { ILeaveRequest } from "@/app/(backend)/models/leaverequest";

/* -------------------------------------------------------------------------- */
/* ✅ Types for PATCH body                                                     */
/* -------------------------------------------------------------------------- */
interface PatchBody {
  leaveId: string;
  action: "approve" | "reject";
  comment?: string;
  approverName: string;
  role: "teamlead" | "hr";
}

/* -------------------------------------------------------------------------- */
/* ✅ CREATE NEW LEAVE REQUEST                                                 */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    await connectDatabase();

    const body: Partial<ILeaveRequest> & {
      name?: string;
      email?: string;
      leaveType?: string;
      startDate?: string;
      endDate?: string;
      reason?: string;
    } = await req.json();

    const { name, email, leaveType, startDate, endDate, reason } = body;

    if (!name || !email || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Extract user ID from token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const jwt = await import("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };

    const newLeave = await LeaveRequest.create({
      userId: decoded.id, // Store user ID
      name,
      email,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "pending",
      approvers: { teamLead: null, hr: null },
      approverStatus: new Map<string, "approve" | "reject">(),
      approverComments: [],
    });

    return NextResponse.json(
      { message: "✅ Leave request submitted successfully", data: newLeave },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error submitting leave:", error);
    return NextResponse.json(
      { message: "Server error while submitting leave", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ GET ALL LEAVE REQUESTS (user-specific)                                   */
/* -------------------------------------------------------------------------- */
/* ✅ GET ALL LEAVE REQUESTS (user-specific) */
export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const jwt = await import("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string; email?: string };

    // Query using both userId and email for backward compatibility
    const leaves = await LeaveRequest.find({
      $or: [{ userId: decoded.id }, { email: decoded.email }],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      message: leaves.length > 0 ? "✅ Leaves fetched successfully" : "No leave requests found.",
      leaves: leaves.map((l) => ({
        ...l,
        approvers: l.approvers || { teamLead: null, hr: null },
        approverStatus: l.approverStatus || new Map<string, "approve" | "reject">(),
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching leaves:", error);
    return NextResponse.json(
      { message: "Server error while fetching leaves", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ UPDATE LEAVE REQUEST STATUS                                              */
/* -------------------------------------------------------------------------- */
export async function PATCH(req: NextRequest) {
  try {
    await connectDatabase();

    const body: PatchBody = await req.json();
    const { leaveId, action, comment, approverName, role } = body;

    if (!leaveId || !action || !approverName || !role) {
      return NextResponse.json(
        { message: "Missing required fields: leaveId, action, approverName, role." },
        { status: 400 }
      );
    }

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return NextResponse.json({ message: "Leave not found." }, { status: 404 });

    if (action === "reject" && (!comment || comment.trim() === "")) {
      return NextResponse.json(
        { message: "Rejection reason is required when rejecting." },
        { status: 400 }
      );
    }

    // Update approvers
    if (role === "teamlead") leave.approvers.teamLead = approverName;
    if (role === "hr") leave.approvers.hr = approverName;

    // Update approverStatus map
    if (!leave.approverStatus) leave.approverStatus = new Map<string, "approve" | "reject">();
    leave.approverStatus.set(role, action);

    // Push comment
    leave.approverComments = leave.approverComments || [];
    leave.approverComments.push({
      approver: approverName,
      action,
      comment: comment || "",
      date: new Date(),
    });

    // Determine overall status
    const bothApproved =
      leave.approverStatus.get("teamlead") === "approve" &&
      leave.approverStatus.get("hr") === "approve";
    const anyRejected =
      leave.approverStatus.get("teamlead") === "reject" ||
      leave.approverStatus.get("hr") === "reject";

    leave.status = anyRejected ? "rejected" : bothApproved ? "approved" : "pending";

    await leave.save();

    return NextResponse.json({ message: `✅ Leave ${action}d successfully`, leave });
  } catch (error) {
    console.error("❌ Error updating leave:", error);
    return NextResponse.json(
      { message: "Server error while updating leave", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
