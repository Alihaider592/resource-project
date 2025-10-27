import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDatabase();

    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing request ID." },
        { status: 400 }
      );
    }

    const { role, action, approver, reason } = await req.json();

    if (!["teamlead", "hr"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role for approval." },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action type." },
        { status: 400 }
      );
    }

    // ❌ Reject must have reason
    if (action === "reject" && (!reason || !reason.trim())) {
      return NextResponse.json(
        { success: false, message: "Rejection reason is required." },
        { status: 400 }
      );
    }

    const request = await WorkFromHome.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, message: "Request not found." },
        { status: 404 }
      );
    }

    // Initialize approvals if undefined
    request.approvals = request.approvals || {};

    request.approvals[role] = {
      status: action,
      reason: action === "reject" ? reason : undefined,
      date: new Date(),
    };

    const teamleadApproval = request.approvals.teamlead?.status;
    const hrApproval = request.approvals.hr?.status;

    if (teamleadApproval === "rejected" || hrApproval === "rejected") {
      request.status = "rejected";
    } else if (teamleadApproval === "approved" && hrApproval === "approved") {
      request.status = "approved";
    } else {
      request.status = "pending";
    }

    await request.save();

    return NextResponse.json({
      success: true,
      message: `Request ${action}d successfully by ${role}.`,
      data: request,
    });
  } catch (error) {
    console.error("🔥 WFH action error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process action." },
      { status: 500 }
    );
  }
}
