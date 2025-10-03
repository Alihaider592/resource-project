import { NextResponse } from "next/server";
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser";
import bcrypt from "bcryptjs";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  try {
    await connectDatabase();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const file = formData.get("picture") as File | null;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await AddUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    let filePath = null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      filePath = `/uploads/${filename}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AddUser.create({
      name,
      email,
      password: hashedPassword,
      picture: filePath, 
    });

    return NextResponse.json(
      {
        message: "User added successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          picture: user.picture,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
