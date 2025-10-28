import { NextRequest, NextResponse } from "next/server";
import Team from "@/app/(backend)/models/report";
import connectDatabase from "@/app/(backend)/lib/db";

export async function POST(req: NextRequest) {
  const { name, members, projects, createdBy, userRole } = await req.json();

  if (!["hr", "admin"].includes(userRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDatabase();

  try {
    const team = new Team({ name, members, projects, createdBy });
    await team.save();
    return NextResponse.json({ message: "Team created successfully", team });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}
