import { NextRequest, NextResponse } from "next/server";
import Team from "@/app/(backend)/models/teams";
import connectDatabase from "@/app/(backend)/lib/db";
import { Types } from "mongoose";

interface MemberInput {
  userId: string;
  role: "teamlead" | "member";
}

interface TeamInput {
  name: string;
  members: MemberInput[];
  projects: string[];
  createdBy: string;
  userRole: string;
}

export async function POST(req: NextRequest) {
  const body: TeamInput = await req.json();
  const { name, members, projects, createdBy, userRole } = body;

  console.log("Received team creation request:", body);

  // Authorization check
  if (!["hr", "admin"].includes(userRole.toLowerCase())) {
    console.log("Unauthorized attempt by userRole:", userRole);
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDatabase();
  console.log("Database connected");

  try {
    // Ensure exactly one teamlead
    const leadCount = members.filter((m) => m.role === "teamlead").length;
    console.log("Number of teamleads in request:", leadCount);

    if (leadCount !== 1) {
      console.log("Invalid number of teamleads:", leadCount);
      return NextResponse.json(
        { error: "A team must have exactly one teamlead." },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectId
    const membersWithObjectId = members.map((m) => {
      const obj = { userId: new Types.ObjectId(m.userId), role: m.role };
      console.log("Converted member to ObjectId:", obj);
      return obj;
    });

    // Create team request with status "pending"
    const team = new Team({
      name,
      members: membersWithObjectId,
      projects,
      createdBy: new Types.ObjectId(createdBy),
      status: "pending",
    });

    console.log("Saving team request:", team);
    await team.save();
    console.log("Team saved successfully:", team._id);

    return NextResponse.json({
      message: "Team request created successfully",
      team,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.log("Error creating team:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
