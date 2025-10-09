// src/app/(backend)/api/admin/adduser/route.ts

import { NextResponse, NextRequest } from "next/server";
import { handleNewUserRequest } from "@/app/(backend)/controllers/admin.controller"; 
// ... other imports and config

export async function POST(req: NextRequest) {
    try {
        // ... (I/O and Delegation logic remains the same)
        const formData = await req.formData();
        const userData = {
            name: formData.get("name")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            password: formData.get("password")?.toString() || "",
            role: formData.get("role")?.toString() || "simple user",
        };

        const newUser = await handleNewUserRequest(userData);

        return NextResponse.json(
            { message: "User created successfully", user: newUser }, 
            { status: 201 }
        );
        
    } catch (error: unknown) { // ⬅️ FIX: Use 'unknown' instead of 'any'
        // Type Guard to ensure we can access the 'message' property
        const isErrorWithMessage = (err: unknown): err is { message: string } => {
            return typeof err === 'object' && err !== null && 'message' in err;
        };
        
        const errorMessage = isErrorWithMessage(error) ? error.message : "An unknown error occurred.";

        // 5. I/O: Send the error response based on the error thrown by the Service/Controller
        console.error("❌ Route Handler Error:", errorMessage);
        
        let statusCode = 500;

        // Check for specific error messages for 400 Bad Request status
        if (errorMessage.includes("Missing") || errorMessage.includes("Invalid role")) {
            statusCode = 400;
        } else if (errorMessage.includes("already registered")) {
             statusCode = 409; // Conflict
        }
        
        return NextResponse.json(
            { message: "Operation Failed", error: errorMessage },
            { status: statusCode }
        );
    }
}