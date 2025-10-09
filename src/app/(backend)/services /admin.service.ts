import connectDatabase from "@/app/(backend)/lib/db";
import AddUser, { ISAddUser } from "@/app/(backend)/models/adduser"; // Admin added users, ISAddUser is Mongoose interface
// FIX: Changed ISSignupUser to ISignupUser (Error 2724)
import SignupUser, { ISignupUser } from "@/app/(backend)/models/signupuser"; // Self-registered users, ISignupUser is Mongoose interface
import bcrypt from "bcryptjs";
// FIX: Removed LeanDocument import (Error 2724)
import { Types } from "mongoose";

/* -------------------------------------------------------------------------- */
/* TYPES AND INTERFACES                                                       */
/* -------------------------------------------------------------------------- */

// Lean Document Type: Jo data database se .lean() ke zariye aata hai (plain JS object).
// FIX: Using intersection type to represent the lean output and resolve the Mongoose import issue.
// This is the shape of the data after .lean(), before being mapped to IUserResponse.
type ILeanUser = (ISAddUser | ISignupUser) & { _id: string, password?: string };


// Standard Response Type: Jo data .toObject() ya non-lean operations se aata hai.
export interface IUserResponse {
    _id: string; // ObjectId ko string mein convert kar diya gaya hai for API compatibility
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    picture?: string | null;
    phonenumber?: string | null;
    companyname?: string | null;
    createdAt?: Date;
}


// Request types
interface NewUserRequest {
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
}

interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    avatar?: string;
    phonenumber?: string;
    companyname?: string;
}

/* -------------------------------------------------------------------------- */
/* Type Helper for conversion from LeanDocument to clean IUserResponse        */
/* -------------------------------------------------------------------------- */

// Mongoose LeanDocument ko clean API response object mein convert karta hai.
function mapLeanUserToResponse(user: ILeanUser): IUserResponse {
    // LeanDocument properties ko destructure kiya gaya hai,
    // aur `password` ko hata diya gaya hai, agar woh accidentally shaamil ho.
    // FIX (ESLint unused vars): password ko _password rename kiya.
    const { password: _password, ...rest } = user;
    
    // FIX (ESLint no-explicit-any): `any` ko `unknown as IUserResponse` se badal diya.
    // Union type se property access ke errors ko theek karne ke liye `rest` ko cast kiya gaya hai.
    const r = rest as unknown as IUserResponse; 
    
    return {
        _id: r._id.toString(), // Ensure _id is always a string
        name: r.name,
        email: r.email,
        role: r.role,
        // Naye optional fields ko shamil karein
        avatar: r.avatar || null,
        picture: r.picture || null,
        phonenumber: r.phonenumber || null,
        companyname: r.companyname || null,
        createdAt: r.createdAt,
    } as IUserResponse;
}

/* -------------------------------------------------------------------------- */
/* 1. CREATE NEW USER SERVICE (AddUser Model Only)                            */
/* -------------------------------------------------------------------------- */

/**
 * Creates a new user (admin-added) in the AddUser collection.
 * @throws Error if user already exists.
 */
export async function createNewUserService(userData: NewUserRequest): Promise<IUserResponse> {
    await connectDatabase();

    const { name, email, password, role, avatar } = userData;

    // Check for existing user in BOTH models before creation
    const existingAddUser = await AddUser.findOne({ email });
    const existingSignupUser = await SignupUser.findOne({ email });

    if (existingAddUser || existingSignupUser) {
        throw new Error(`User with email ${email} already registered.`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await AddUser.create({
        name,
        email,
        password: hashedPassword,
        role,
        avatar: avatar || null,
    });
    
    // FIX (ESLint no-explicit-any): `any` ko type-safe assertion से badal diya.
    // FIX (ESLint unused vars): `ignoredPassword` ko `_ignoredPassword` rename kiya.
    const rawUserObject = newUser.toObject() as (ISAddUser & { _id: Types.ObjectId }); 
    const { password: _ignoredPassword, ...userObject } = rawUserObject;

    return {
        ...userObject,
        // _id is now known to be a Mongoose ObjectId after the cast above.
        _id: userObject._id.toString(), // Ensure _id is a string
    } as IUserResponse;
}

/* -------------------------------------------------------------------------- */
/* 2. GET SINGLE USER SERVICE (Check Both Models)                             */
/* -------------------------------------------------------------------------- */

/**
 * Fetches a single user by ID from either AddUser or SignupUser model.
 */
export async function getSingleUserService(id: string): Promise<IUserResponse> {
    await connectDatabase();

    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID format.");
    }
    
    // Search in AddUser model first (using .lean() for performance)
    let user = await AddUser.findById(id).select('-password').lean().exec() as ILeanUser | null;

    // If not found, search in SignupUser model
    if (!user) {
        user = await SignupUser.findById(id).select('-password').lean().exec() as ILeanUser | null;
    }
    
    if (!user) {
        throw new Error(`User with ID ${id} not found.`);
    }

    return mapLeanUserToResponse(user);
}

/* -------------------------------------------------------------------------- */
/* 3. GET ALL USERS SERVICE (Check Both Models)                               */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all users from both AddUser and SignupUser collections.
 */
export async function getAllUsersService(): Promise<IUserResponse[]> {
    await connectDatabase();

    // FIX (Code 2352): Mongoose's FlattenMaps type ko handle karne ke liye `as unknown as` ka prayog.
    // Fetch from both collections, excluding password field
    const addUsers = await AddUser.find({}).select('-password').lean().exec() as unknown as ILeanUser[];
    const signupUsers = await SignupUser.find({}).select('-password').lean().exec() as unknown as ILeanUser[];

    // Combine and map
    const allUsers: ILeanUser[] = [...addUsers, ...signupUsers];

    return allUsers.map(mapLeanUserToResponse);
}


/* -------------------------------------------------------------------------- */
/* 4. UPDATE USER SERVICE (Check Both Models and Update the found one)        */
/* -------------------------------------------------------------------------- */

/**
 * Updates user details in whichever model the user is found (AddUser or SignupUser).
 */
export async function updateUserService(userId: string, updateData: UpdateUserRequest): Promise<IUserResponse> {
    await connectDatabase();

    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format.");
    }
    
    // Prepare updates
    interface IUpdates extends UpdateUserRequest {
        password?: string;
    }
    const updates: IUpdates = { ...updateData };
    
    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    // Try to find and update in AddUser model
    let updatedUser = await AddUser.findByIdAndUpdate(
        userId, 
        { $set: updates }, 
        { new: true, runValidators: true } 
    ).select('-password').lean().exec() as ILeanUser | null;

    // If not found, try to find and update in SignupUser model
    if (!updatedUser) {
        updatedUser = await SignupUser.findByIdAndUpdate(
            userId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        ).select('-password').lean().exec() as ILeanUser | null;
    }

    if (!updatedUser) {
        throw new Error(`User with ID ${userId} not found or update failed.`);
    }

    return mapLeanUserToResponse(updatedUser);
}

/* -------------------------------------------------------------------------- */
/* 5. DELETE USER SERVICE (Check Both Models and Delete from both if found)   */
/* -------------------------------------------------------------------------- */

/**
 * Deletes a user record from both possible collections.
 */
export async function deleteUserService(userId: string): Promise<boolean> {
    await connectDatabase();

    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid ID format.");
    }

    // Try deleting from both models
    const deletedAddUser = await AddUser.findByIdAndDelete(userId);
    const deletedSignupUser = await SignupUser.findByIdAndDelete(userId);

    // If neither deletion was successful, the user wasn't found
    if (!deletedAddUser && !deletedSignupUser) {
        throw new Error(`User with ID ${userId} not found.`);
    }
    
    return true; 
}
