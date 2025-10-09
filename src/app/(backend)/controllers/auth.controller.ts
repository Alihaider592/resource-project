import { authenticateUser,registerUser,getUserProfile } from "../services /auth.service";
import { Types } from "mongoose";
interface Credentials { email: string; password: string; }
interface RegisterData { name: string; email: string; password: string; }
interface DecodedUser { id: string; name: string; email: string; role: string; } // From JWT


// --- 1. LOGIN CONTROLLER ---

export async function handleLoginRequest(credentials: Credentials) {
    try {
        const authResult = await authenticateUser(credentials.email, credentials.password);
        return authResult;
        
    } catch (error: unknown) {
        console.error("Controller Error (Login):", error);
        throw error; 
    }
}


// --- 2. SIGNUP CONTROLLER ---

export async function handleSignupRequest(userData: RegisterData) {
    try {
        const user = await registerUser(userData);
        return user;
        
    } catch (error: unknown) {
        console.error("Controller Error (Signup):", error);
        throw error; 
    }
}


// --- 3. ME CONTROLLER ---

export async function handleMeRequest(decodedUser: DecodedUser) {
    try {
        const userProfile = await getUserProfile(decodedUser);
        
        return userProfile;
        
    } catch (error: unknown) {
        console.error("Controller Error (Me):", error);
        throw error; 
    }
}
