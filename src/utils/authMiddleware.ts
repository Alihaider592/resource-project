import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// ✅ Secret key setup (throw error if missing)
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is missing from environment variables!");
}

export type UserRole = "admin" | "HR" | "Team Lead" | "simple user"|"User";

export interface DecodedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

/**
 * ✅ Verifies JWT and enforces role-based access.
 * @param req - The Next.js request object
 * @param allowedRoles - Optional array of roles allowed to access the route
 * @returns DecodedUser - Returns the decoded JWT payload if valid
 * @throws AuthError - Throws if unauthorized or role is invalid
 */
export async function verifyAccess(
  req: NextRequest,
  allowedRoles: UserRole[] = [] // 👈 optional now
): Promise<DecodedUser> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("❌ Missing or invalid Authorization header");
    throw new AuthError("Unauthorized: Token missing.", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET!) as DecodedUser;

    // ✅ Optional role-based access check
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      console.warn(
        `🚫 Access Denied: User ${decoded.email} (${decoded.role}) tried to access a restricted route`
      );
      throw new AuthError(
        `Forbidden: You do not have permission to perform this action.`,
        403
      );
    }

    console.log(`✅ Authenticated as ${decoded.email} (${decoded.role})`);
    return decoded;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    throw new AuthError("Unauthorized: Invalid or expired token.", 401);
  }
}
