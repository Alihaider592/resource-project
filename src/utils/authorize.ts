import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
}

export function authorize(req: NextRequest, allowedRoles: string[]) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;

    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return decoded; // only allowed roles pass
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
