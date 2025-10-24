import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WFHRequest from "@/app/(backend)/models/WFHRequest";

export async function GET() {
  await connectDatabase();
  const requests = await WFHRequest.find().lean();
  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  await connectDatabase();
  const body = await req.json();
  const newRequest = new WFHRequest({ ...body, status: "pending" });
  await newRequest.save();
  return NextResponse.json({ success: true, request: newRequest });
}
