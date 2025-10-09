import { NextRequest } from "next/server"; 
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "your_secret_key";
export type UserRole = "admin" | "HR" | "Team Lead" | "simple user"; 
export interface DecodedUser {
  email: string;
  role: UserRole;
  name: string;
  id: string; 
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
 * Verifies the JWT and checks if the user's role is authorized.
 * @param req - The NextRequest object.
 * @param allowedRoles - An array of roles permitted to access the resource.
 * @returns {DecodedUser} The decoded user payload if authorized.
 * @throws {AuthError} If authentication or authorization fails.
 */
export async function verifyAccess(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<DecodedUser> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    throw new AuthError("Unauthorized: Token missing.", 401);
  }
  try {
    const decoded = jwt.verify(token, SECRET) as DecodedUser;
       if (!allowedRoles.includes(decoded.role)) {
      throw new AuthError(`Forbidden: Insufficient role (${decoded.role}).`, 403);
    }
    return decoded;
  } catch (error) {
    throw new AuthError("Unauthorized: Invalid or expired token.", 401);
  }
}