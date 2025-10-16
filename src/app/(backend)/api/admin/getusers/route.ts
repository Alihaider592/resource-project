import { NextRequest, NextResponse } from "next/server";
import { verifyAccess, AuthError } from "@/utils/authMiddleware";
import { handleGetAllUsers } from "@/app/(backend)/controllers/admin.controller";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** User type returned from controller */
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string | null;
  picture?: string | null;
  phonenumber?: string | null;
  companyname?: string | null;
  createdAt?: Date | string;
}

/** Possible shapes returned by handleGetAllUsers */
type GetAllUsersResult = User[] | { users: User[] } | unknown;

/**
 * ✅ GET /api/admin/getusers
 * Roles allowed: Admin, HR, Team Lead
 */
export async function GET(req: NextRequest) {
  try {
    // ✅ Verify Access Token
    const decodedUser = await verifyAccess(req, ["Admin","HR","TeamLead","simple user"]);
    console.log(
      `✅ Access granted for: ${decodedUser.email} (${decodedUser.role})`
    );

    // ✅ Get all users from controller
    const result: GetAllUsersResult = await handleGetAllUsers();

    // ✅ Normalize to an array safely
    let users: User[] = [];

    if (Array.isArray(result)) {
      users = result;
    } else if (
      typeof result === "object" &&
      result !== null &&
      "users" in result &&
      Array.isArray((result as { users: unknown }).users)
    ) {
      const typed = result as { users: User[] };
      users = typed.users;
    } else {
      console.warn("⚠️ Unexpected result format from handleGetAllUsers:", result);
    }

    // ✅ Return clean JSON
    return NextResponse.json(
      {
        success: true,
        users,
        fetchedAt: new Date().toISOString(),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    console.error("❌ [GET /api/admin/getusers] Error:", error);

    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: message,
        users: [],
      },
      { status: 500 }
    );
  }
}
