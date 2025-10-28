import { NextRequest, NextResponse } from "next/server";
import Team from "@/app/(backend)/models/report";
import connectDatabase from "@/app/(backend)/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDatabase();
  try {
    await Team.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
  }
}
