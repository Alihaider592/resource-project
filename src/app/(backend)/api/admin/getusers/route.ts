import { NextRequest, NextResponse } from "next/server";
import { verifyAccess, AuthError } from "@/utils/authMiddleware";
import { handleGetAllUsers } from "@/app/(backend)/controllers/admin.controller";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    // ✅ Allow multiple roles — not just admin and HR
    const user = await verifyAccess(req, ["admin", "HR", "Team Lead"]);
    console.log(`✅ Access granted for: ${user.email} (${user.role})`);

    // ✅ Fetch all users via controller
    const users = await handleGetAllUsers();

    if (!Array.isArray(users)) {
      console.warn("⚠️ handleGetAllUsers did not return an array:", users);
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // ✅ Return successful response
    return NextResponse.json(
      {
        success: true,
        users,
        fetchedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: unknown) {
    console.error("❌ GET Users Route Error:", error);

    // ✅ Handle known auth errors
    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: error.statusCode,
        },
        { status: error.statusCode }
      );
    }

    // ✅ Handle generic errors
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: errorMessage,
        users: [],
      },
      { status: 500 }
    );
  }
}
