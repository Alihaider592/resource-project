import { NextResponse, NextRequest } from "next/server";
import { handleNewUserRequest } from "@/app/(backend)/controllers/admin.controller"; 
// ... other imports and config

// Mock function for file upload (Replace with actual cloud storage logic later)
async function uploadFileAndGetUrl(file: File): Promise<string> {
    // In a real application, you would upload the file to S3/GCS here.
    // For now, we mock a successful URL based on the file name.
    console.log(`Mock Uploading avatar file: ${file.name}`);
    return `https://cdn.example.com/admin-avatars/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        
        // 1. Extract File and Text Fields from FormData
        const avatarFile = formData.get("avatar") as File | null;
        let avatarUrl: string | undefined = undefined;

        // 2. Process/Mock Upload Avatar File
        if (avatarFile && avatarFile.size > 0) {
            avatarUrl = await uploadFileAndGetUrl(avatarFile);
        }

        // 3. Prepare User Data Payload
        const userData = {
            name: formData.get("name")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            password: formData.get("password")?.toString() || "",
            role: formData.get("role")?.toString() || "simple user",
            avatar: avatarUrl, // ⬅️ Avatar URL joda gaya
        };

        // 4. DELEGATE to Controller
        const newUser = await handleNewUserRequest(userData);

        // 5. Success Response
        return NextResponse.json(
            { message: "User created successfully", user: newUser }, 
            { status: 201 }
        );
        
    } catch (error: unknown) { 
        // Type Guard to ensure we can access the 'message' property
        const isErrorWithMessage = (err: unknown): err is { message: string } => {
            return typeof err === 'object' && err !== null && 'message' in err;
        };
        
        const errorMessage = isErrorWithMessage(error) ? error.message : "An unknown error occurred.";

        // 6. Error Response
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
