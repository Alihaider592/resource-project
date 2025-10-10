import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JwtPayloadType extends JwtPayload {
  id: string;
  role: "admin" | "HR" | "simple user" | "teamlead";
}

export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadType;

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Welcome admin!" });
  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
