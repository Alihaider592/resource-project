import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHomeModel from "@/app/(backend)/models/WorkFromHome";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDatabase();

    const { id } = await params;
    console.log("🆔 Received ID:", id);

    const body = await req.json();
    const { action, approver, role, reason } = body;
    console.log("📩 Request Body:", body);

    // ✅ Validate inputs
    if (!id || !action || !approver || !role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const validRoles = ["hr", "teamlead"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role." },
        { status: 400 }
      );
    }

    const request = await WorkFromHomeModel.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, message: "Request not found." },
        { status: 404 }
      );
    }

    // 🧠 Build approval data
    const approvalData = {
      status: action === "approve" ? "approved" : "rejected",
      reason: reason || "",
      approver,
      date: new Date(),
    };

    // ✅ Save approval under correct role
    if (role === "teamlead") {
      request.approvals.teamlead = approvalData;
    } else if (role === "hr") {
      request.approvals.hr = approvalData;
    }

    // ✅ Ensure approverComments array exists before pushing
    if (!Array.isArray(request.approverComments)) {
      request.approverComments = [];
    }

    // ✅ Log comment history
    request.approverComments.push({
      approver,
      action,
      comment: reason || "",
      date: new Date(),
    });

    // 🧩 Update main request status
    if (approvalData.status === "rejected") {
      request.status = "rejected";
    } else {
      // Both must approve to fully approve
      const tlApproved = request.approvals.teamlead?.status === "approved";
      const hrApproved = request.approvals.hr?.status === "approved";
      if (tlApproved && hrApproved) {
        request.status = "approved";
      }
    }

    await request.save();

    return NextResponse.json({
      success: true,
      message: `Request ${action}d successfully.`,
      data: request,
    });
  } catch (error) {
    console.error("🔥 Error updating request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process request." },
      { status: 500 }
    );
  }
}
