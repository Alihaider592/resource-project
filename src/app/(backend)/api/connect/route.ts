import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import User from "@/app/(backend)/models/User";

export async function GET() {
  try {
    // connect to the same DB
    await connectDatabase();

    // fetch all users
    const users = await User.find().select("-password");

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
