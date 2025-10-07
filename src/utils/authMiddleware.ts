// utils/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your_secret_key";

export type UserRole = "admin" | "HR" | "Team Lead" | "simpleuser";

export interface DecodedUser {
  email: string;
  role: UserRole;
  name: string;
}

// Middleware to protect API routes
export async function authorize(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<NextResponse | null> {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as DecodedUser;

    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    (req as NextRequest & { user?: DecodedUser }).user = decoded;

    return null;
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
