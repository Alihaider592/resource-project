import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";

export async function GET() {
  try {
    // Connect to the database
    await connectDatabase();

    // Fetch all users
    const users = await AddUser.find({});

    // Convert Mongoose documents to plain objects
    const plainUsers = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
    }));

    // Return as JSON
    return NextResponse.json({ users: plainUsers }, { status: 200 });
  } catch (err: unknown) {
    console.error("Fetch users error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
