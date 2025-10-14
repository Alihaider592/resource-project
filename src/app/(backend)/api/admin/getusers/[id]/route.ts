import { NextRequest, NextResponse } from "next/server";
import { verifyAccess, AuthError } from "@/utils/authMiddleware";
import { handleGetSingleUser } from "@/app/(backend)/controllers/admin.controller"; 

// ✅ Always fetch fresh data (disable caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * @route   GET /api/getuser/[id]
 * @desc    Fetch single user by ID
 * @access  Private (Admin, HR, Team Lead, Simple User)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Step 1: Verify JWT and extract user info
    const authUser = await verifyAccess(req, ["admin", "HR", "Team Lead", "simple user"]);
    console.log(`✅ Access granted for: ${authUser.email} (${authUser.role})`);

    // ✅ Step 2: Validate requested user ID
    const userId = params?.id;
    if (!userId) {
      console.warn("⚠️ No user ID provided in params");
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // ✅ Step 3: Access control — non-admin users can only view their own profile
    if (
      authUser.role !== "admin" &&
      authUser.role !== "HR" &&
      authUser.id !== userId
    ) {
      console.warn(`🚫 Unauthorized: ${authUser.role} tried to access another profile`);
      return NextResponse.json(
        { success: false, message: "You are not authorized to view this profile." },
        { status: 403 }
      );
    }

    // ✅ Step 4: Fetch user data from DB (via controller)
    const foundUser = await handleGetSingleUser(userId);

    if (!foundUser) {
      console.warn(`⚠️ User not found with ID: ${userId}`);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Step 5: Respond with user data
    return NextResponse.json(
      {
        success: true,
        user: foundUser,
        fetchedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: unknown) {
    console.error("❌ GET /api/getuser/[id] Error:", error);

    // ✅ Handle custom Auth errors
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      );
    }

    // ✅ Generic error handler
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message: "Failed to fetch user", error: errorMessage },
      { status: 500 }
    );
  }
}
