import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import Team from "@/app/(backend)/models/teams";
import AddUser from "@/app/(backend)/models/adduser"; // <-- your actual user model

export async function GET() {
  try {
    await connectDatabase();

    const teams = await Team.find()
      .populate("members.userId", "name email role", AddUser) // populate from adduser collection
      .populate("createdBy", "name email role", AddUser)
      .sort({ createdAt: -1 });

    return NextResponse.json(teams, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
