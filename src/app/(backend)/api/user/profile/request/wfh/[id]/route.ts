import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WFHRequest";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDatabase();

  try {
    const { action, rejectionReason, role } = await req.json();

    if (!["approve", "reject"].includes(action) || !role) {
      return NextResponse.json({ message: "Invalid action or role" }, { status: 400 });
    }

    const request = await WorkFromHome.findById(params.id);
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    if (role === "teamlead") {
      request.approvers.teamLead = action;
    } else if (role === "hr") {
      request.approvers.hr = action;
    }

    // If both have approved, mark overall status approved
    if (request.approvers.teamLead === "approve" && request.approvers.hr === "approve") {
      request.status = "approved";
    }

    // If rejected, mark status rejected
    if (action === "reject") {
      request.status = "rejected";
      request.rejectionReason = rejectionReason || "No reason provided";
    }

    await request.save();

    return NextResponse.json({ message: `Request ${action}ed successfully`, request });
  } catch (error) {
    console.error("❌ PUT /WFH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
