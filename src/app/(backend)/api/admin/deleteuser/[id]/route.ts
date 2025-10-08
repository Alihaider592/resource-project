import { NextRequest, NextResponse } from "next/server";
import connectdatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";

interface Params {
  id: string;
}

export async function DELETE(
  req: NextRequest,
  context: { params: Params }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await connectdatabase();

    const deletedUser = await AddUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/deleteuser/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
