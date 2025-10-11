// src/app/(backend)/api/auth/me/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/(backend)/models/User";
import TeamLead from "@/app/(backend)/models/teamlead";
import connectDatabase from "@/app/(backend)/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET(request: Request) {
  await connectDatabase();

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    let user = null;
    if (decoded.role === "teamlead") {
      user = await TeamLead.findById(decoded.id).select("-password");
    } else {
      user = await User.findById(decoded.id).select("-password");
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
