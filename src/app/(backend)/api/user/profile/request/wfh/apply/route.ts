import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";

export async function POST(req: NextRequest) {
  try {
    // ✅ Connect to MongoDB
    await connectDatabase();

    // ✅ Get request body
    const { name, email, date, workType, reason, role } = await req.json();

    // ✅ Validate required fields
    if (!name || !email || !date || !workType || !reason || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // ✅ Normalize role values
    const normalizedRole =
      role === "simple user"
        ? "user"
        : role === "Simple User"
        ? "user"
        : role; // handles case differences too

    // ✅ Create new WFH request
    const newRequest = new WorkFromHome({
      name,
      email,
      date,
      workType,
      reason,
      role: normalizedRole,
    });

    // ✅ Save to MongoDB
    await newRequest.save();

    // ✅ Success response
    return NextResponse.json({
      success: true,
      message: "Work From Home request submitted successfully!",
    });
  } catch (error: unknown) {
    // ✅ Type-safe error handling (no eslint errors)
    if (error instanceof Error) {
      console.error("🔥 WFH apply error:", error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    console.error("🔥 WFH apply unknown error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit WFH request." },
      { status: 500 }
    );
  }
}
