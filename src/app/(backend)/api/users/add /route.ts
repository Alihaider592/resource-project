import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/db";
// import User from "@/models/User";
// import { adminOnly } from "@/lib/middleware/adminOnly";
import connectToDatabase from "@/app/(backend)/lib/db";
import User from "@/app/(backend)/models/userm";
import { adminOnly } from "@/lib/middelwear/adminonly";

export async function POST(request: Request) {
  // Check if request is from admin
  const errorResponse = await adminOnly(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, password } = body;

    // Create user...
    const newUser = new User({ name, email, password, role: "user" });
    await newUser.save();

    return NextResponse.json({ message: "User created", user: newUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
