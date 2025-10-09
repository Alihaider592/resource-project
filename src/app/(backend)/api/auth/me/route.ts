import { NextRequest, NextResponse } from "next/server";
// import { handleMeRequest } from "../../controllers/auth.controller"; // ⬅️ Controller
import { handleMeRequest } from "@/app/(backend)/controllers/auth.controller";
// Assuming authMiddleware is one directory up, then utils
import { verifyAccess, AuthError, DecodedUser } from "../../../../../utils/authMiddleware"; 

/**
 * Route Handler: Fetches current user profile based on JWT token.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. AUTHORIZATION CHECK (JWT decode and role check)
    // /me is accessible to all authenticated roles
    const decodedUser = await verifyAccess(req, ["admin", "HR", "Team Lead", "simple user"]) as DecodedUser;

    // 2. DELEGATE: Controller ko decoded data bhejo
    const userProfile = await handleMeRequest(decodedUser);

    // 3. RESPONSE: Send back the cleaned profile
    return NextResponse.json({ user: userProfile }, { status: 200 });
    
  } catch (error: unknown) {
    // 4. ERROR TRANSLATION
    if (error instanceof AuthError) {
        // Unauthorized (401) or Forbidden (403)
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Auth/me Route Handler Error:", errorMessage);

    return NextResponse.json(
      { error: "Failed to fetch user profile", message: errorMessage },
      { status: 500 }
    );
  }
}
