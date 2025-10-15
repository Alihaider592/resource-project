import { NextResponse } from "next/server";
import { handleNewUserRequest } from "@/app/(backend)/controllers/admin.controller";
import connectDB from "@/app/(backend)/lib/db";

/* -------------------------------------------------------------------------- */
/* ADD USER API ROUTE                                                         */
/* -------------------------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    // ✅ Ensure MongoDB is connected
    await connectDB();

    // ✅ Parse JSON body
    const body = await req.json();
    console.log("📥 Incoming AddUser Request:", body);

    // ✅ Handle user creation
    const result = await handleNewUserRequest(body);

    return NextResponse.json(
      { success: true, message: "User created successfully", data: result },
      { status: 201 }
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("❌ Route error:", error.message);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* OPTIONAL - HANDLE UNSUPPORTED METHODS                                      */
/* -------------------------------------------------------------------------- */
export function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 }
  );
}
