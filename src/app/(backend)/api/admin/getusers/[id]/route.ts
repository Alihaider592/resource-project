import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser"; // ✅ correct model
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// GET user by ID (admin only)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDatabase();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
      email: string;
    };

    if (!decoded || (decoded.role !== "Admin" && decoded.role !== "HR")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins or HR only." },
        { status: 403 }
      );
    }

    const { id } = await params; // ✅ make sure params is awaited if it's a Promise
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    const user = await AddUser.findById(id).select("-password"); // ✅ query correct collection

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("❌ Error fetching user:", err);
    return NextResponse.json(
      { success: false, message: "Server error.", error: err.message },
      { status: 500 }
    );
  }
}
