import { NextResponse } from "next/server";
import connectdatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";
export async function GET() {
  try {
    await connectdatabase();

    const users = await AddUser.find({}, { name: 1, email: 1, picture: 1 });

    // Convert _id to string for React key
    const mappedUsers = users.map((AddUser) => ({
      id: AddUser._id.toString(),
      name: AddUser.name,
      email: AddUser.email,
      picture: AddUser.picture || null,
    }));

    return NextResponse.json({ users: mappedUsers });
  } catch (error) {
    console.error("GET /api/admin/getusers error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
