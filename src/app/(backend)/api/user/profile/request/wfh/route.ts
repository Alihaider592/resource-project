import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WFHRequest from "@/app/(backend)/models/WFHRequest";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  await connectDatabase();

  try {
    const requests = await WFHRequest.find().lean();
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch WFH requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDatabase();

  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; name: string };
    const body = await req.json();

    const newRequest = new WFHRequest({
      ...body,
      email: decoded.email,
      name: decoded.name,
      status: "pending",
    });

    await newRequest.save();
    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    return NextResponse.json({ message: "Failed to submit request" }, { status: 500 });
  }
}
