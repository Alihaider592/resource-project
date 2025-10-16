import { NextRequest, NextResponse } from "next/server";
import { verifyAccess, AuthError } from "@/utils/authMiddleware";
import { handleGetAllUsers } from "@/app/(backend)/controllers/admin.controller";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string | null;
  picture?: string | null;
  phonenumber?: string | null;
  companyname?: string | null;
  createdAt?: Date | string | null; // ✅ Fixed type
}

/**
 * ✅ GET /api/admin/getusers
 * Roles allowed: Admin, HR, Team Lead
 */
export async function GET(req: NextRequest) {
  try {
    // ✅ 1. Verify access token
    const decodedUser = await verifyAccess(req, ["admin", "HR", "Team Lead"]);
    console.log(
      `✅ Access granted for: ${decodedUser.email} (${decodedUser.role})`
    );

    // ✅ 2. Fetch users from controller
    const result = await handleGetAllUsers();

    // ✅ 3. Normalize the output shape
    let users: User[] = [];

    if (Array.isArray(result)) {
      users = result;
    } else if (
      typeof result === "object" &&
      result !== null &&
      "users" in result
    ) {
      const maybeUsers = (result as { users?: unknown }).users;
      if (Array.isArray(maybeUsers)) {
        users = maybeUsers as User[];
      }
    } else {
      console.warn("⚠️ Unexpected result format from handleGetAllUsers:", result);
    }

    // ✅ 4. Format + sanitize users
    const cleanUsers: User[] = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role || "simple user",
      phonenumber: u.phonenumber || null,
      companyname: u.companyname || null,
      createdAt: u.createdAt || null,
      avatar:
        u.avatar && u.avatar.startsWith("http")
          ? u.avatar
          : u.avatar
          ? `https://res.cloudinary.com/dk9i3x5la/image/upload/${u.avatar.replace(
              /^uploads\//,
              ""
            )}`
          : null,
      picture:
        u.picture && u.picture.startsWith("http")
          ? u.picture
          : u.picture
          ? `https://res.cloudinary.com/dk9i3x5la/image/upload/${u.picture.replace(
              /^uploads\//,
              ""
            )}`
          : null,
    }));

    // ✅ 5. Return response
    return NextResponse.json(
      {
        success: true,
        count: cleanUsers.length,
        users: cleanUsers,
        fetchedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
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
