import connectDatabase from "@/app/(backend)/lib/db";
import AddUser from "@/app/(backend)/models/adduser"; 
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

// --- 1. CREATE USER LOGIC (from your provided code) ---

export async function createAdminUser(userData: { name: string, email: string, password: string, role: string }) {
    await connectDatabase(); 

    const { name, email, password, role } = userData;

        if (!name || !email || !password) {
        throw new Error("Missing required fields (name, email, password)");
    }

    
    const existingUser = await AddUser.findOne({ email });
    if (existingUser) {
        throw new Error(`User with email ${email} already registered.`);
    }

    
    const allowedRoles = ["simple user", "admin", "HR", "Team Lead"];
    if (!allowedRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await AddUser.create({
        name,
        email,
        password: hashedPassword,
        role,
    });
    
    return newUser; 
}

// --- 2. DELETE USER LOGIC (Required by your API: /deleteuser/[id]) ---

/**
 * Deletes a user record by ID.
 * @param {string} userId - The ID of the user to delete.
 */
export async function deleteUserById(userId: string): Promise<boolean> {
    await connectDatabase(); 

    // Optional: Check if the ID is a valid MongoDB ObjectId format
    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid ID format.");
    }

    const deletedUser = await AddUser.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw new Error(`User with ID ${userId} not found.`); 
    }
    
    return true; 
}


// --- 3. FETCH USERS LOGIC (Required by your API: /getusers) ---

/**
 * Fetches all users from the database.
 */
export async function fetchAllUsers() {
    await connectDatabase(); 

    // Database Operation: Fetch all users, explicitly excluding the 'password' field.
    const users = await AddUser.find({}).select('-password').lean().exec();

    // The .lean() method ensures the function returns plain JavaScript objects,
    // which is often faster and better for Service output.
    return users;
}