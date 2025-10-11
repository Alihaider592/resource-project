import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/(backend)/models/User";
import connectdatabase from "@/app/(backend)/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET(request: Request) {
  try {
    await connectdatabase();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Match role correctly
    const validRoles = ["admin", "teamlead", "hr", "simpleuser", "Team Lead"];
    if (!validRoles.includes(user.role)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err: unknown) {
    // ✅ Fix: explicitly type-narrow 'err'
    let errorMessage = "Unknown error occurred";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    console.error("Protected route error:", errorMessage);
    return NextResponse.json(
      { message: "Invalid or expired token", error: errorMessage },
      { status: 401 }
    );
  }
}
