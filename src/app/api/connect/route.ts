import { NextResponse } from "next/server";
import connectToDatabase from "@/app/(backend)/lib/db";
import User from "@/app/(backend)/models/User";

// TypeScript interface for request body
interface UserBody {
  name: string;
  email: string;
  phonenumber: string;
  companyname?: string;
  comment?: string;
}

// ✅ POST: Add or update a user
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body: UserBody = await request.json();
    const { name, email, phonenumber, companyname, comment } = body;

    if (!name || !email || !phonenumber) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { name, phonenumber, companyname, comment },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "User saved successfully.",
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("❌ POST /api/connect error:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// ✅ GET: Fetch all users (main fix)
export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find().select("-__v"); // exclude internal fields

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database connection failed";
    console.error("❌ GET /api/connect error:", message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
