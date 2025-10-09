import { NextRequest, NextResponse } from "next/server";
import { handleGetAllUsers } from "@/app/(backend)/controllers/admin.controller";
import { verifyAccess, AuthError } from "../../../../../utils/authMiddleware";

/* -------------------------------------------------------------------------- */
/* 🔒 Always Fetch Fresh Data — Disable Route Caching                          */
/* -------------------------------------------------------------------------- */
export const dynamic = "force-dynamic"; // ensures API is always fresh
export const revalidate = 0;            // disables ISR cache (optional safety)

/* -------------------------------------------------------------------------- */
/* 🚀 GET ALL USERS (ADMIN ONLY)                                               */
/* -------------------------------------------------------------------------- */
export async function GET(req: NextRequest) {
  try {
    // 🧩 Step 1: Verify Admin Access
    const user = await verifyAccess(req, ["admin"]);
    console.log(`✅ Access granted for Admin: ${user.email}`);

    // 🧩 Step 2: Fetch users (always from DB)
    const mappedUsers = await handleGetAllUsers();

    // 🧩 Step 3: Validate data structure
    if (!Array.isArray(mappedUsers)) {
      console.warn("⚠️ handleGetAllUsers did not return an array:", mappedUsers);
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // 🧩 Step 4: Return response
    return NextResponse.json(
      { users: mappedUsers, fetchedAt: new Date().toISOString() },
      { status: 200, headers: { "Cache-Control": "no-store" } } // ✅ No cache
    );

  } catch (error: unknown) {
    console.error("❌ GET Users Route Error:", error);

    // 🧩 Auth error handler
    if (error instanceof AuthError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }

    // 🧩 General error handler
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { message: "Failed to fetch users", error: errorMessage, users: [] },
      { status: 500 }
    );
  }
}
