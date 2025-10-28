import { NextRequest, NextResponse } from "next/server";
import Team, { ITeamDocument } from "@/app/(backend)/models/teams";
import connectDatabase from "@/app/(backend)/lib/db";

interface MemberInput {
  userId: string;
  role: "teamlead" | "member";
}

export async function POST(req: NextRequest) {
  const { name, members, projects, createdBy, userRole }: {
    name: string;
    members: MemberInput[];
    projects: string[];
    createdBy: string;
    userRole: string;
  } = await req.json();

  if (!["hr", "admin"].includes(userRole)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDatabase();

  try {
    const leadCount = members.filter(m => m.role === "teamlead").length;
    if (leadCount !== 1) {
      return NextResponse.json({ error: "A team must have exactly one teamlead." }, { status: 400 });
    }

    const team = new Team({ name, members, projects, createdBy });
    await team.save();

    return NextResponse.json({ message: "Team created successfully", team });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
