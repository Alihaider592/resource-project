import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function POST(req: NextRequest) {
  try {
    await connectDatabase();
    const { name, email, date, workType, reason, role } = await req.json();

    if (!name || !email || !date || !workType || !reason || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const newRequest = new WorkFromHome({
      name,
      email,
      date,
      workType,
      reason,
      role,
    });

    await newRequest.save();

    return NextResponse.json({
      success: true,
      message: "Work From Home request submitted successfully!",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🔥 WFH apply error:", error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    console.error("🔥 WFH apply error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit WFH request." },
      { status: 500 }
    );
  }
}
