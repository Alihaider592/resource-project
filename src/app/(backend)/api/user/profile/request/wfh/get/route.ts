import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WorkFromHome";
import User from "@/app/(backend)/models/User"; // ✅ Make sure User model is imported

export async function GET(req: NextRequest) {
  try {
    await connectDatabase();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email and role are required." },
        { status: 400 }
      );
    }

    let requests;

    if (role === "hr") {
      // ✅ HR sees everything
      requests = await WorkFromHome.find().sort({ createdAt: -1 });
    } else if (role === "teamlead") {
      // ✅ Team lead only sees requests from their team members
      const teamMembers = await User.find({ teamLeadEmail: email }).select("email");
      const memberEmails = teamMembers.map((m) => m.email);
      requests = await WorkFromHome.find({ email: { $in: memberEmails } }).sort({
        createdAt: -1,
      });
    } else {
      // ✅ Regular user sees only their own requests
      requests = await WorkFromHome.find({ email }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("🔥 Fetch WFH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch WFH requests." },
      { status: 500 }
    );
  }
}
