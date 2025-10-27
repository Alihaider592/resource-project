import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDatabase();

    // ✅ Correctly unwrap the params object
    const id = (await context.params).id; // Must await
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing request ID." },
        { status: 400 }
      );
    }

    const { action, approver } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action type." },
        { status: 400 }
      );
    }

    const updateData =
      action === "approve"
        ? { status: "approved", approvedBy: approver, updatedAt: new Date() }
        : { status: "rejected", rejectedBy: approver, updatedAt: new Date() };

    const updated = await WorkFromHome.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Request ${action}d successfully.`,
      data: updated,
    });
  } catch (error) {
    console.error("🔥 WFH action error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process action." },
      { status: 500 }
    );
  }
}
