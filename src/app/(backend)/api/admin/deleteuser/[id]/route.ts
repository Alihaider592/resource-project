import { NextRequest, NextResponse } from "next/server";
import { handleDeleteUserRequest } from "@/app/(backend)/controllers/admin.controller";

interface Params {
  id: string;
}

export async function DELETE(req: NextRequest, context: { params?: Params }) {
  console.log("🟢 DELETE request received");
  console.log("🟠 context.params:", context?.params);

  const id = context?.params?.id;

  if (!id) {
    console.error("❌ No 'id' found in context.params");
    return NextResponse.json(
      { error: "User ID is required", message: "Missing route parameter /:id" },
      { status: 400 }
    );
  }

  try {
    console.log("🟢 Deleting user with ID:", id);
    const result = await handleDeleteUserRequest(id);
    console.log("✅ User deleted successfully:", result);

    return NextResponse.json(
      { message: "User deleted successfully", result },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("❌ DELETE Route Handler Error:", errorMessage);

    let statusCode = 500;
    if (errorMessage.toLowerCase().includes("not found")) {
      statusCode = 404;
    } else if (errorMessage.toLowerCase().includes("invalid id")) {
      statusCode = 400;
    }

    return NextResponse.json(
      { error: "Deletion Failed", message: errorMessage },
      { status: statusCode }
    );
  }
}
