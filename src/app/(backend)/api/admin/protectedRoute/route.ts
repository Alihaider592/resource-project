import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import SignupUser from "@/app/(backend)/models/signupuser";
import AddUser from "@/app/(backend)/models/adduser";
import connectDatabase from "@/app/(backend)/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface DecodedToken extends JwtPayload {
  id: string;
}

export async function GET(request: Request) {
  try {
    await connectDatabase();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // ✅ Check both models (SignupUser and AddUser)
    const user =
      (await SignupUser.findById(decoded.id).select("-password")) ||
      (await AddUser.findById(decoded.id).select("-password"));

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Protected route error:", errorMessage);
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
