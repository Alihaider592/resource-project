import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WFHRequest";

// POST → create new WFH request
export async function POST(req: Request) {
  await connectDatabase();
  try {
    const { name, email, startDate, endDate, reason, workDescription } = await req.json();

    if (!name || !email || !startDate || !endDate || !reason || !workDescription) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const request = await WorkFromHome.create({
      name,
      email,
      startDate,
      endDate,
      reason,
      workDescription,
      status: "pending",
    });

    return NextResponse.json({ message: "WFH request created", request }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET → get all requests for logged-in employee
export async function GET(req: Request) {
  await connectDatabase();

  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email required" }, { status: 400 });
  }

  const requests = await WorkFromHome.find({ email }).sort({ createdAt: -1 });
  return NextResponse.json({ requests });
}
