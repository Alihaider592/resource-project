import { NextRequest, NextResponse } from "next/server";
import { handleGetAllUsers } from "@/app/(backend)/controllers/admin.controller";
import { verifyAccess, AuthError } from "@/utils/authMiddleware";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    // ✅ Allow admin and hr
    const user = await verifyAccess(req, ["admin", "HR"]);
    console.log(`✅ Access granted for: ${user.email}`);

    const mappedUsers = await handleGetAllUsers();

    if (!Array.isArray(mappedUsers)) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    return NextResponse.json(
      { users: mappedUsers, fetchedAt: new Date().toISOString() },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    console.error("❌ GET Users Route Error:", error);

    if (error instanceof AuthError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { message: "Failed to fetch users", error: errorMessage, users: [] },
      { status: 500 }
    );
  }
}
