import { NextRequest, NextResponse } from "next/server";
import connectdatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } } // Correct type for App Router
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    await connectdatabase();

    // Delete the user by ID
    const deletedUser = await AddUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/admin/deleteuser/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
