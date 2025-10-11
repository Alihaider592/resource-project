import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/(backend)/models/User";
import connectdatabase from "@/app/(backend)/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET(req: Request) {
  await connectdatabase();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    if (decoded.role.toLowerCase() !== "teamlead") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
