import { NextRequest, NextResponse } from "next/server";
import Team from "@/app/(backend)/models/teams";
import connectDatabase from "@/app/(backend)/lib/db";
import mongoose, { Types } from "mongoose";

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
  _id?: string;
  createdAt?: Date;
}

export async function POST(req: NextRequest) {
  try {
    const body: TeamInput = await req.json();
    const { name, members, projects, createdBy, userRole, _id, createdAt } = body;

    console.log("🟦 Received team creation request:", body);

    // ✅ Authorization check
    if (!["hr", "admin"].includes(userRole.toLowerCase())) {
      console.log("🚫 Unauthorized attempt by role:", userRole);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ Connect to DB
    await connectDatabase();
    console.log("🟩 Database connected");

    // ✅ Validate fields
    if (!name || !members?.length) {
      return NextResponse.json(
        { error: "Team name and members are required." },
        { status: 400 }
      );
    }

    const leadCount = members.filter((m) => m.role === "teamlead").length;
    if (leadCount !== 1) {
      return NextResponse.json(
        { error: "A team must have exactly one teamlead." },
        { status: 400 }
      );
    }

    // ✅ Convert to ObjectIds
    if (!Types.ObjectId.isValid(createdBy)) {
      return NextResponse.json(
        { error: `Invalid createdBy ID: ${createdBy}` },
        { status: 400 }
      );
    }

    const createdByObjectId = new Types.ObjectId(createdBy);

    const membersWithObjectId = members.map((m) => {
      if (!Types.ObjectId.isValid(m.userId)) {
        throw new Error(`Invalid userId in members: ${m.userId}`);
      }
      return {
        userId: new Types.ObjectId(m.userId),
        role: m.role,
      };
    });

    // ✅ Always generate ObjectId-based string _id
    const teamId = _id || new mongoose.Types.ObjectId().toString();

    // ✅ Create new team
    const team = new Team({
      _id: teamId,
      name,
      members: membersWithObjectId,
      projects: projects || [],
      createdBy: createdByObjectId,
      createdAt: createdAt || new Date(),
      status: userRole === "hr" ? "approved" : "pending",
    });

    console.log("🟨 Saving team to DB:", team);
    await team.save();

    console.log("✅ Team created successfully:", team._id);

    return NextResponse.json(
      { message: "Team created successfully", team },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error creating team:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
