import { NextRequest, NextResponse } from "next/server";
import { handleDeleteUserRequest } from "@/app/(backend)/controllers/admin.controller";
interface Params {
  id: string;
}
export async function DELETE(
  req: NextRequest,
  context: { params: Params }
) {
  const { id } = context.params;
   if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    const result = await handleDeleteUserRequest(id);
    return NextResponse.json(result, { status: 200 });    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("❌ DELETE Route Handler Error:", errorMessage)
    let statusCode = 500;
    if (errorMessage.includes("not found")) {
      statusCode = 404; 
    } else if (errorMessage.includes("invalid ID")) {
      statusCode = 400; 
    }
    return NextResponse.json(
        { error: "Deletion Failed", message: errorMessage }, 
        { status: statusCode }
    );
  }
}