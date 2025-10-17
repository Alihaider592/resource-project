import { NextRequest, NextResponse } from "next/server";
import User from "@/app/(backend)/models/adduser";
import connectDatabase from "@/app/(backend)/lib/db";
import mongoose from "mongoose";
import { verifyAccess, AuthError } from "@/utils/authMiddleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    await verifyAccess(req, ["Admin", "HR", "TeamLead"]);

    await connectDatabase();

    const id = params?.id?.trim();
    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove sensitive fields
    const { password, createdAt, updatedAt, joiningDate, leavingDate, ...safeUser } = user;

    return NextResponse.json({ user: safeUser, message: "User fetched successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
