import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function POST(req: NextRequest) {
  try {
    await connectDatabase();
    const { role, email } = await req.json();

    let query = {};
    if (role === "user") query = { email };
    else if (role === "teamlead") query = {}; // can add team-based filter later
    else if (role === "hr") query = {};

    const requests = await WorkFromHome.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching requests" }, { status: 500 });
  }
}
