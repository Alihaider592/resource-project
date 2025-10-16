import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teamlead" | "hr" | "simpleuser";
  iat?: number;
  exp?: number;
}

// Type guard to normalize decoded JWT
function extractDecodedToken(obj: unknown): DecodedToken | null {
  if (typeof obj !== "object" || obj === null) return null;

  const record = obj as Record<string, unknown>;

  const roleStr =
    typeof record.role === "string"
      ? record.role.toLowerCase().replace(/\s+/g, "")
      : "";

  // Accept both "user" and "simpleuser"
  const validRoles = ["admin", "teamlead", "hr", "simpleuser", "user"];

  if (
    typeof record.id === "string" &&
    typeof record.email === "string" &&
    validRoles.includes(roleStr)
  ) {
    return {
      id: record.id,
      name: typeof record.name === "string" ? record.name : "",
      email: record.email,
      role: roleStr === "user" ? "simpleuser" : (roleStr as DecodedToken["role"]),
      iat: typeof record.iat === "number" ? record.iat : undefined,
      exp: typeof record.exp === "number" ? record.exp : undefined,
    };
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const decodedRaw = jwt.verify(token, secret) as unknown;

    const decoded = extractDecodedToken(decodedRaw);

    if (!decoded) {
      console.log("Decoded JWT failed type guard:", decodedRaw);
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // ✅ Success: return normalized user data
    return NextResponse.json({ message: "Authorized", user: decoded });
  } catch (err) {
    console.error("Protected Route Error:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
