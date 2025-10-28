import { NextResponse } from "next/server";
import Team from "../../models/report";
import connectDatabase from "../../lib/db";

export async function GET() {
  await connectDatabase();
  const teams = await Team.find();
  return NextResponse.json(teams);
}
