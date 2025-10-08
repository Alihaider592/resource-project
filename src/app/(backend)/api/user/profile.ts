// app/api/user/profile/route.ts

import { NextResponse } from 'next/server';
import connectdatabase from '../../lib/db'; // Your connection file
import User, { IUser } from '../../models/User'; // Your Mongoose Model and Interface
import { revalidatePath } from 'next/cache';

// NOTE: This assumes you have a function to verify the JWT and extract the user ID
// For a real app, you would use a secure library to decode and verify the token.
const getUserIdFromToken = (token: string): string | null => {
    try {
        // !!! REPLACE with actual secure JWT decoding and verification !!!
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        
        // This relies on your JWT having an 'id' field, like the one in your network log
        return payload.id || null;
    } catch (e) {
        return null;
    }
};


export async function profile(request: Request) {
    try {
        await connectdatabase();

        // 1. Authentication/Authorization: Extract User ID from Token
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return NextResponse.json({ message: "Authentication failed. Token missing." }, { status: 401 });
        }
        
        const userId: string | null = getUserIdFromToken(token);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 });
        }

        // 2. Parse FormData (necessary because your frontend sends files/FormData)
        const formData: FormData = await request.formData();
        
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const phonenumber = formData.get('phonenumber')?.toString().trim();
        const companyname = formData.get('companyname')?.toString().trim();
        const avatarFile = formData.get('avatar'); // File object
        
        // 3. Construct Update Payload and Validation
        const updatePayload: Partial<IUser> = {};
        
        if (!name || name.length < 2) {
            return NextResponse.json({ message: "Name must be at least 2 characters." }, { status: 400 });
        }
        updatePayload.name = name;

        if (!email || !email.includes('@')) {
             return NextResponse.json({ message: "A valid email is required." }, { status: 400 });
        }
        updatePayload.email = email;

        // Add other required fields
        if (phonenumber) updatePayload.phonenumber = phonenumber;
        if (companyname) updatePayload.companyname = companyname;

        // 4. Avatar Handling (Conceptual)
        if (avatarFile instanceof File) {
            // !!! REQUIRED: File upload logic goes here (S3, Cloudinary, etc.)
            // updatePayload.avatar = 'uploaded_image_url';
        }

        // 5. Update MongoDB
        const updatedUser: IUser | null = await User.findByIdAndUpdate(
            userId,
            { $set: updatePayload },
            { new: true, runValidators: true }
        ); // You should select out the password field if it exists on the model

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        // 6. Success Response
        revalidatePath('/profile');
        
        return NextResponse.json({
            message: "Profile updated successfully! ✅",
            user: { 
                id: updatedUser.id.toString(), 
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar ?? null,
            },
        }, { status: 200 });

    } catch (error) {
        console.error("Profile Update API Error:", error);
        
        let errorMessage: string = "An unknown server error occurred.";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}