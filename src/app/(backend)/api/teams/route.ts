import { NextResponse } from "next/server";
import Team from "@/app/(backend)/models/teams";
import connectDatabase from "@/app/(backend)/lib/db";

export async function GET() {
  await connectDatabase();
  const teams = await Team.find();
  return NextResponse.json(teams);
}
