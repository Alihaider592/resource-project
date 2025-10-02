import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/db";
import User from "../../models/userm";
import { verifyToken } from "../../lib/jwthelper";
import bcrypt from "bcryptjs";
// import { adminOnly } from "@/lib/middleware/adminOnly";
import { adminOnly } from "@/lib/middelwear/adminonly";
// export async function POST(req: Request) {
  
  // ...
// }

// Define a type for the decoded token
interface DecodedToken {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function POST(req: Request) {
    const errorResponse = await adminOnly(req);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { token, name, email, password, role } = await req.json();

    const decoded = verifyToken(token) as DecodedToken;

    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ error: "User exists" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    return NextResponse.json({ message: "User added" });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
