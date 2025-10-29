import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import Team from "@/app/(backend)/models/teams";

export async function GET() {
  try {
    await connectDatabase();
    const teams = await Team.find()
      .populate("members.userId", "name email role")
      .sort({ createdAt: -1 });
    return NextResponse.json(teams, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
