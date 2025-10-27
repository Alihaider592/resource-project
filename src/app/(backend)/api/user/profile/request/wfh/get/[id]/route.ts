import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDatabase();
    const { id } = params;
    const { status } = await req.json();

    await WorkFromHome.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true, message: `WFH ${status}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating status" }, { status: 500 });
  }
}
