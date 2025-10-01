
// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/db";
// import User from "@/models/User";

// // Define TypeScript interface for request body
// interface UserBody {
//   name: string;
//   email: string;
//   phonenumber: string;
//   companyname?: string;
//   comment?: string;
// }

// export async function POST(request: Request) {
//   try {
//     await connectToDatabase();

//     // Parse and type the request body
//     const body: UserBody = await request.json();
//     const { name, email, phonenumber, companyname, comment } = body;

//     // Validate required fields
//     if (!name || !email || !phonenumber) {
//       return NextResponse.json(
//         { error: "Name, email, and phone number are required." },
//         { status: 400 }
//       );
//     }

//     // Check for duplicate email
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User with this email already exists." },
//         { status: 409 }
//       );
//     }

//     // Create new user
//     const newUser = new User({
//       name,
//       email,
//       phonenumber,
//       companyname,
//       comment,
//     });

//     await newUser.save();

//     return NextResponse.json(newUser, { status: 201 });
//   } catch (error) {
//     // Safer error handling
//     const message =
//       error instanceof Error ? error.message : "Something went wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }



// export async function GET() {
//   return NextResponse.json({ message: "API is working!" });
// }
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// TypeScript interface for request body
interface UserBody {
  name: string;
  email: string;
  phonenumber: string;
  companyname?: string;
  comment?: string;
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // Parse and type the request body
    const body: UserBody = await request.json();
    const { name, email, phonenumber, companyname, comment } = body;

    // Validate required fields
    if (!name || !email || !phonenumber) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    // Create new user or update existing one
    const user = await User.findOneAndUpdate(
      { email }, // search by email
      { name, phonenumber, companyname, comment }, // update fields
      { new: true, upsert: true } // create if not exists
    );

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "API is working!" });
}
