import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDatabase from "@/app/(backend)/lib/db";
import WFHRequest from "@/app/(backend)/models/WFHRequest";
import User from "@/app/(backend)/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const getUserFromToken = async (req: Request) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.id).select("_id name email role");
    return user;
  } catch {
    return null;
  }
};

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { startDate, endDate, reason } = await req.json();
    if (!startDate || !endDate || !reason)
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

    const newRequest = await WFHRequest.create({
      user: user._id,
      name: user.name,
      email: user.email,
      startDate,
      endDate,
      reason,
      status: "pending",
      approvers: {
        teamLead: null,
        hr: null,
      },
    });

    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating WFH request:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDatabase();
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const requests = await WFHRequest.find({ user: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching WFH requests:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
