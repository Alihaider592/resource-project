import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WFHRequest";

export async function GET() {
  await connectDatabase();
  const requests = await WorkFromHome.find().sort({ createdAt: -1 });
  return NextResponse.json({ requests });
}

export async function PUT(req: Request) {
  await connectDatabase();
  try {
    const { id, action, reason } = await req.json();

    const request = await WorkFromHome.findById(id);
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    if (action === "approve") {
      request.approvers.teamLead = "approved";
    } else if (action === "reject") {
      request.approvers.teamLead = "rejected";
      request.rejectionReason = reason;
    }

    if (request.approvers.hr === "rejected" || request.approvers.teamLead === "rejected") {
      request.status = "rejected";
    } else if (request.approvers.hr === "approved" && request.approvers.teamLead === "approved") {
      request.status = "approved";
    } else {
      request.status = "pending";
    }

    await request.save();
    return NextResponse.json({ message: "Updated successfully", request });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
