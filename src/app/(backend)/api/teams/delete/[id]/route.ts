import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import Team from "@/app/(backend)/models/teams";
import { Types } from "mongoose";

export async function DELETE(req: NextRequest, { params }: { params?: { id?: string } }) {
  try {
    // Try to get ID from params first, fallback to URL parsing
    let id = params?.id;
    if (!id) {
      const url = new URL(req.url);
      id = url.pathname.split("/").pop();
    }

    // Validate ObjectId
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    await connectDatabase();

    const deleted = await Team.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
