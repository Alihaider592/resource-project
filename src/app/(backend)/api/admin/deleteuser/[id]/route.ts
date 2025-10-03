import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/db";
import connectdatabase from "@/app/(backend)/lib/db";
// import User from "@/models/User";
import AddUser from "@/app/(backend)/models/adduser";

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;

//   try {
//     await connectdatabase();
//     const deletedUser = await AddUser.findByIdAndDelete(id);

//     if (!deletedUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/db";
// import User from "@/models/User";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

  try {
    await connectdatabase();

    const deleted = await AddUser.findByIdAndDelete(id);

    if (!deleted) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/admin/deleteuser/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
