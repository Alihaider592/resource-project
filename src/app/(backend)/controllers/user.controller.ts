import { updateUserProfile } from "../services /user.service";
interface DecodedUser {
    id: string;
    role: string;
}
/**
 * Handles the profile update request flow: validation, file upload prep, and delegation.
 * NOTE: File upload logic (S3/Cloudinary) is mocked.
 * * @param userId - The ID of the authenticated user.
 * @param formData - The raw FormData object from the request.
 * @returns The cleaned and updated user profile data.
 * @throws {Error} for validation failures or if the user is not found.
 */
export async function handleProfileUpdateRequest(userId: string, formData: FormData) {
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phonenumber = formData.get('phonenumber')?.toString().trim() || undefined;
    const companyname = formData.get('companyname')?.toString().trim() || undefined;
    const avatarFile = formData.get('avatar'); 
    
    // Validation
    if (!name || name.length < 2) {
        throw new Error("Name must be at least 2 characters.");
    }

    if (!email || !email.includes('@')) {
         throw new Error("A valid email is required.");
    }
    
    let avatarUrl: string | undefined;
    if (avatarFile instanceof File && avatarFile.size > 0) {
        console.log(`Mocking file upload for: ${avatarFile.name}`);
        // Production mein, yeh line actual upload karke URL return karegi
        avatarUrl = `https://cdn.example.com/avatars/${userId}-${Date.now()}.jpg`; 
    }
    
    const updatePayload = {
        name,
        email,
        phonenumber,
        companyname,
        avatarUrl,
    };
    
    // Database service ko call karna
    // Assuming updateUserProfile returns the updated user object or null/undefined if not found
    const updatedUser = await updateUserProfile(userId, updatePayload);
    
    // 🛠️ FIX: Agar service user update nahi kar paati (usually user not found ki wajah se), toh specific error throw karein.
    if (!updatedUser) {
        throw new Error("User not found in the database. Update failed.");
    }

    return updatedUser;
}
