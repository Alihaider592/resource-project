import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome from "@/app/(backend)/models/WFHRequest";

// 🟢 POST → Create new WFH request
export async function POST(req: Request) {
  await connectDatabase();

  try {
    const { name, email, startDate, endDate, reason, workDescription } = await req.json();

    // Basic validation
    if (!name || !email || !startDate || !endDate || !reason || !workDescription) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if end date is before start date
    if (new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        { message: "End date cannot be earlier than start date." },
        { status: 400 }
      );
    }

    // Optional: prevent duplicate requests for overlapping dates
    const existing = await WorkFromHome.findOne({
      email,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (existing) {
      return NextResponse.json(
        { message: "You already have a WFH request for these dates." },
        { status: 400 }
      );
    }

    // Create new request
    const request = await WorkFromHome.create({
      name,
      email,
      startDate,
      endDate,
      reason,
      workDescription,
      status: "pending",
      approvers: {
        teamLead: "pending",
        hr: "pending",
      },
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Work From Home request created successfully.",
        request,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /WFH error:", error);
    return NextResponse.json(
      { message: "Internal server error while creating WFH request." },
      { status: 500 }
    );
  }
}

// 🟣 GET → Get all requests for a specific employee (by email)
export async function GET(req: Request) {
  await connectDatabase();

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required to fetch requests." },
        { status: 400 }
      );
    }

    const requests = await WorkFromHome.find({ email }).sort({ createdAt: -1 });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /WFH error:", error);
    return NextResponse.json(
      { message: "Internal server error while fetching WFH requests." },
      { status: 500 }
    );
  }
}
