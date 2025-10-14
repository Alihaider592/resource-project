import { NextRequest, NextResponse } from "next/server";
import { verifyAccess, AuthError } from "@/utils/authMiddleware";
import { handleGetSingleUser } from "@/app/(backend)/controllers/admin.controller";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID missing in request." },
        { status: 400 }
      );
    }

    const decodedUser = await verifyAccess(req, ["admin", "HR", "Team Lead"]);
    console.log(`✅ Access granted for: ${decodedUser.email} (${decodedUser.role})`);

    const user = await handleGetSingleUser(userId);

    // ✅ Return JSON in frontend-compatible format
    return NextResponse.json(
      { success: true, user },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: unknown) {
    console.error("❌ GET /api/admin/getuser/[id] Error:", error);

    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
