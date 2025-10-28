import { NextResponse } from "next/server";
// import connectDatabase from "../lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";
import connectDatabase from "@/app/(backend)/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();

    const id = params.id;
    const { action, approver, role, reason } = await req.json();

    console.log("🆔 Received ID:", id);
    console.log("📩 Request Body:", { action, approver, role, reason });

    if (!["teamlead", "hr"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    const request = await WorkFromHome.findById(id);
    if (!request) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    // 🧠 Update logic for role-based approval
    const approvalData = {
      status: action === "approve" ? "approved" : "rejected",
      approver,
      reason: action === "reject" ? reason || "No reason provided" : undefined,
      date: new Date(),
    };

    request.approvals[role] = approvalData;

    if (action === "reject") {
      request.status = "rejected";
    } else if (
      request.approvals.teamlead?.status === "approved" &&
      request.approvals.hr?.status === "approved"
    ) {
      request.status = "approved";
    }

    await request.save();

    return NextResponse.json({
      success: true,
      message: `Request ${action}d successfully`,
      request,
    });
  } catch (error) {
    console.error("❌ Error updating request:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
