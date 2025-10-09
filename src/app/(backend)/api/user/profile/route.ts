import { NextResponse, NextRequest } from "next/server";
import { handleProfileUpdateRequest } from "@/app/(backend)/controllers/user.controller";

export const dynamic = "force-dynamic"; // 🚀 Disable Next.js caching for this route
export const revalidate = 0; // 🚫 Prevent ISR cache reuse
export const fetchCache = "force-no-store"; // 🧠 Enforce always-fresh fetch behavior

/**
 * Checks if a string is a valid MongoDB ObjectId format (24 hexadecimal characters).
 */
const isMongoId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

/**
 * Extracts user ID from a JWT token (no verification, just decode).
 */
const getUserIdFromToken = (token: string): string | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return payload.id || null;
  } catch {
    return null;
  }
};

export async function PUT(request: NextRequest) {
  let userId: string | null = null;

  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) throw new Error("Authentication failed. Token missing.");

    userId = getUserIdFromToken(token);
    if (!userId) throw new Error("Unauthorized. Invalid token.");

    if (!isMongoId(userId))
      throw new Error("ID validation failed. The user ID in the token is malformed.");

    // ✅ Read FormData for file upload and text fields
    const formData = await request.formData();

    // ✅ Update profile via controller
    const updatedUser = await handleProfileUpdateRequest(userId, formData);

    // ✅ Always return a fresh, uncached response
    return new NextResponse(
      JSON.stringify({
        message: "Profile updated successfully! ✅",
        user: updatedUser,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";
    console.error("Profile Update API Error:", errorMessage);

    let statusCode = 500;
    if (
      errorMessage.includes("Authentication") ||
      errorMessage.includes("Unauthorized") ||
      errorMessage.includes("Invalid token")
    ) {
      statusCode = 401;
    } else if (errorMessage.includes("not found")) {
      statusCode = 404;
    } else if (
      errorMessage.includes("required") ||
      errorMessage.includes("valid") ||
      errorMessage.includes("malformed") ||
      errorMessage.includes("ID validation failed")
    ) {
      statusCode = 400;
    }

    return NextResponse.json(
      { error: errorMessage },
      {
        status: statusCode,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
