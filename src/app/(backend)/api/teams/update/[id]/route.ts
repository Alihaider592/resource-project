import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import Team from "@/app/(backend)/models/report";
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { name, members, projects } = await req.json();
  await connectDatabase();
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      params.id,
      { name, members, projects },
      { new: true }
    );
    return NextResponse.json({ message: "Team updated successfully", team: updatedTeam });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
  }
}
