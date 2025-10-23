import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import User, { IUser } from "@/app/(backend)/models/User";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    console.log("=== PUT handler invoked ===");

    await connectDatabase();
    const userId = context.params.id;
    console.log("Params.id:", userId);

    if (!userId) {
      return NextResponse.json({ message: "User ID is required in URL" }, { status: 400 });
    }

    let body: Partial<IUser> = {};
    try {
      body = await req.json();
      console.log("Parsed body:", body);
    } catch (err: unknown) {
      console.error("Failed to parse JSON body:", err);
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    // Remove MongoDB internal fields
    delete (body as Partial<IUser> & { _id?: string; __v?: number })._id;
    delete (body as Partial<IUser> & { _id?: string; __v?: number }).__v;

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true, runValidators: true });
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("User updated successfully:", updatedUser);
    return NextResponse.json({ user: updatedUser, message: "User updated successfully" });

  } catch (err: unknown) {
    console.error("PUT route error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
