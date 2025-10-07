import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { name: string; role: string; email: string };

    return NextResponse.json({ user: decoded });
  } catch (err) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}
