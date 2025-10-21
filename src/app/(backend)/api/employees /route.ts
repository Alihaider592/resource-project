import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser"; // 👈 make sure this path is correct

export async function GET() {
  try {
    await connectDatabase();

    // ✅ Get all users (employees)
    const employees = await AddUser.find({});
    const total = employees.length;

    return NextResponse.json({ total });
  } catch (error) {
    console.error("❌ Error fetching employees:", error);
    return NextResponse.json(
      { message: "Error fetching employees", error },
      { status: 500 }
    );
  }
}
