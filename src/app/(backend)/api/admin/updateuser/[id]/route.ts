import { NextRequest, NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import { handleUpdateUser } from "@/app/(backend)/controllers/admin.controller";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDatabase();

  try {
    const body = await req.json();
    const updatedUser = await handleUpdateUser(params.id, body);

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (err: unknown) {
    console.error(err);
    let message = "Failed to update user";
    if (err instanceof Error) message = err.message;

    return NextResponse.json({ message }, { status: 500 });
  }
}
