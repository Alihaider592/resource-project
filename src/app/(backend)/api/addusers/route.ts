import { NextResponse } from "next/server";
import connectDatabase from "../../lib/db";
import AddUser from "../../models/adduser";
export async function GET() {
  try {
    await connectDatabase();
    const users = await AddUser.find().select("_id name email role"); 
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
