import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import Team from "@/app/(backend)/models/teams";

export async function PUT(req: NextRequest) {
  try {
    // Extract team ID from the URL
    const url = new URL(req.url);
    const teamId = url.pathname.split("/").pop();

    if (!teamId) {
      return NextResponse.json({ error: "Missing team ID" }, { status: 400 });
    }

    const { name, members, projects } = await req.json();
    if (!name || !members)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDatabase();

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { name, members, projects },
      { new: true }
    );

    if (!updatedTeam)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
