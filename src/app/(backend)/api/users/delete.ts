import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwtHelper";
import connectToDatabase from "../../lib/db";
import User from "../../models/userm";
import { verifyToken } from "../../lib/jwthelper";
// import { adminClient } from "better-auth/client/plugins";
import { adminOnly } from "@/lib/middelwear/adminonly";
// export async function POST(req: Request) {
  
  // ...
// }

// Define the type of the decoded token
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
    const { token, userId } = await req.json();

    const decoded = verifyToken(token) as DecodedToken;

    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User deleted" });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) message = err.message;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
