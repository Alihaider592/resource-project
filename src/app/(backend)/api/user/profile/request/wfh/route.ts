import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDatabase from "@/app/(backend)/lib/db";
import WorkFromHome, { IWFHRequest } from "@/app/(backend)/models/WFHRequest";

interface DecodedUser {
  id: string;
  role: string;
  email: string;
  name: string;
  teamId?: string;
}

// Map role to cookie name
const getTokenName = (role: string): string => {
  const r = role.toLowerCase().trim().replace(/\s+/g, "");
  switch (r) {
    case "admin": return "admin-token";
    case "hr": return "hr-token";
    case "teamlead":
    case "team lead": return "teamlead-token";
    case "user":
    case "simpleuser": return "user-token";
    default: return "user-token";
  }
};

// ✅ Async authentication
const authenticateRequest = async (targetRole?: string): Promise<DecodedUser | null> => {
  const cookieStore = await cookies(); // ✅ must await
  const tokenName = getTokenName(targetRole || "");
  let token = cookieStore.get(tokenName)?.value;

  // fallback to generic user token
  if (!token && tokenName !== "user-token") {
    token = cookieStore.get("user-token")?.value;
  }

  if (!token) return null;

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    if (!decoded.id || !decoded.role) return null;
    return decoded;
  } catch (err) {
    console.error("❌ Token verification failed:", (err as Error).message);
    return null;
  }
};

// --- GET: Fetch WFH requests ---
export async function GET(req: NextRequest) {
  await connectDatabase();

  const url = new URL(req.url);
  const viewType = url.searchParams.get("view");
  const requestedRole = url.searchParams.get("role") || "user";

  // ✅ await the async authenticateRequest
  const user = await authenticateRequest(requestedRole);
  if (!user) return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });

  try {
    const authRole = user.role.toLowerCase().replace(/\s+/g, "");
    let filter: Record<string, unknown> = {};

    if (authRole === "hr" || authRole === "admin") {
      if (viewType === "all") filter = {};
      else if (viewType === "my") filter = { userId: user.id };
      else filter = {};
    } else if (authRole === "teamlead" || authRole === "team lead") {
      if (viewType === "team" && user.teamId) filter = { teamId: user.teamId };
      else if (viewType === "my") filter = { userId: user.id };
      else filter = { userId: user.id };
    } else {
      filter = { userId: user.id };
    }

    const requests = await WorkFromHome.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /WFH error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// --- POST: Submit new WFH request ---
export async function POST(req: NextRequest) {
  await connectDatabase();

  // ✅ await the async authenticateRequest
  const user = await authenticateRequest("user");
  if (!user) return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 401 });

  try {
    const body: {
      startDate: string;
      endDate: string;
      reason: string;
      workDescription: string;
    } = await req.json();

    const { startDate, endDate, reason, workDescription } = body;

    if (!startDate || !endDate || !reason || !workDescription) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newRequest: IWFHRequest = new WorkFromHome({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      workDescription,
      status: "pending",
    });

    await newRequest.save();
    return NextResponse.json({ message: "WFH request submitted successfully", request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("❌ POST /WFH error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
