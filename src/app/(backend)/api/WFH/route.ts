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

export async function PUT(req: Request) {
  try {
    await connectDatabase();
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { requestId, action } = await req.json(); // action = "approved" | "rejected"
    if (!requestId || !["approved", "rejected"].includes(action))
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const request = await WFHRequest.findById(requestId);
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    // TEAM LEAD LOGIC
    if (user.role === "teamlead") {
      request.approvers.teamLead = action;
      // If approved by TL, HR must review next
      if (action === "rejected") request.status = "rejected";
    }

    // HR LOGIC
    if (user.role === "hr") {
      request.approvers.hr = action;
      if (action === "rejected") request.status = "rejected";
      if (action === "approved" && request.approvers.teamLead === "approved") {
        request.status = "approved";
      }
    }

    await request.save();

    return NextResponse.json({ message: "Request updated", request }, { status: 200 });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
