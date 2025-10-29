// src/app/(backend)/api/teams/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import Team from "@/app/(backend)/models/teams";
import { Types } from "mongoose";
import connectDatabase from "@/app/(backend)/lib/db";

interface MemberInput {
  userId: string;
  role: "teamlead" | "member";
}

interface TeamInput {
  name: string;
  members: MemberInput[];
  projects?: string[];
  createdBy: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDatabase(); // Ensure DB connection

    const body: TeamInput = await req.json();
    const { name: rawName, members, projects, createdBy: rawCreatedBy } = body;

    // Trim strings
    const name = rawName?.trim();
    const createdBy = rawCreatedBy?.trim();

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }
    if (!members?.length) {
      return NextResponse.json({ error: "Team must have members" }, { status: 400 });
    }
    if (!createdBy) {
      return NextResponse.json({ error: "CreatedBy is required" }, { status: 400 });
    }

    // Validate createdBy ID
    if (!Types.ObjectId.isValid(createdBy)) {
      return NextResponse.json({ error: "Invalid current user ID" }, { status: 400 });
    }

    // Validate members
    for (const m of members) {
      if (!m.userId || !Types.ObjectId.isValid(m.userId)) {
        return NextResponse.json({ error: `Invalid member ID: ${m.userId}` }, { status: 400 });
      }
      if (!["teamlead", "member"].includes(m.role)) {
        return NextResponse.json({ error: `Invalid member role: ${m.role}` }, { status: 400 });
      }
    }

    // Convert member IDs to ObjectId
    const memberObjects = members.map((m: MemberInput) => ({
      userId: new Types.ObjectId(m.userId),
      role: m.role,
    }));

    const team = new Team({
      name,
      members: memberObjects,
      projects: projects || [],
      createdBy: new Types.ObjectId(createdBy),
    });

    const savedTeam = await team.save();

    return NextResponse.json(
      { message: "Team created successfully", team: savedTeam },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error creating team:", err);
    const message = err instanceof Error ? err.message : "Failed to create team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
