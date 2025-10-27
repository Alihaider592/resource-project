import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDatabase();

    // ✅ Await dynamic params
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing request ID." },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { role, action, approver, reason } = body as {
      role: "teamlead" | "hr";
      action: "approve" | "reject";
      approver: string;
      reason?: string;
    };

    // Validate role
    if (!role || !["teamlead", "hr"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role for approval." },
        { status: 400 }
      );
    }

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action type." },
        { status: 400 }
      );
    }

    // Reject must include a reason
    if (action === "reject" && (!reason || !reason.trim())) {
      return NextResponse.json(
        { success: false, message: "Rejection reason is required." },
        { status: 400 }
      );
    }

    // Approver email must be provided
    if (!approver || !approver.trim()) {
      return NextResponse.json(
        { success: false, message: "Approver email is required." },
        { status: 400 }
      );
    }

    // Find the WFH request
    const request = await WorkFromHome.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, message: "Request not found." },
        { status: 404 }
      );
    }

    // Initialize approvals if missing
    request.approvals = request.approvals || {};

    // Set status strings correctly
    const status = action === "approve" ? "approved" : "rejected";

    // Update approval for this role
    request.approvals[role] = {
      status,
      reason: action === "reject" ? reason : undefined,
      approver,
      date: new Date(),
    };

    // Update overall request status
    const teamleadStatus = request.approvals.teamlead?.status;
    const hrStatus = request.approvals.hr?.status;

    if (teamleadStatus === "rejected" || hrStatus === "rejected") {
      request.status = "rejected";
    } else if (teamleadStatus === "approved" && hrStatus === "approved") {
      request.status = "approved";
    } else {
      request.status = "pending";
    }

    // Save changes
    await request.save();

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully by ${role}.`,
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
