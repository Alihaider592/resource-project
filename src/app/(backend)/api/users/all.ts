import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwtHelper";

// Define a type for the decoded token
import connectToDatabase from "../../lib/db";
import { verifyToken } from "../../lib/jwthelper";
import User from "../../models/userm";
interface DecodedToken {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token) as DecodedToken;

    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await User.find({}, "-password"); // exclude passwords
    return NextResponse.json(users);
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
