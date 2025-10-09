// FIX: Module path updated to match the likely file structure with a space in 'services /admin.service'.
import { getAllUsersService, getSingleUserService, createNewUserService, deleteUserService, updateUserService } from "../services /admin.service"; 
import { UserRole } from "../models/adduser"; // ⬅️ Role type for validation

/* -------------------------------------------------------------------------- */
/* TYPES AND INTERFACES (Updated to include profile fields)                     */
/* -------------------------------------------------------------------------- */

interface NewUserRequest {
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string; // Avatar URL is optional
}

interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    avatar?: string; // Avatar URL is optional
    phonenumber?: string;
    companyname?: string;
}

interface IUser {
    _id: string | { toString(): string };
    name: string;
    email: string;
    role: string;
    password?: string;
    avatar?: string | null;
    picture?: string | null; // For models consistency check
    phonenumber?: string | null;
    companyname?: string | null;
    createdAt?: Date;
    // toObject is needed for Mongoose documents
    toObject?: () => Omit<IUser, 'toObject' | '_id'> & { _id: string }; 
}

/* -------------------------------------------------------------------------- */
/* 1. CREATE NEW USER HANDLER (Includes Avatar and Role Validation)            */
/* -------------------------------------------------------------------------- */

/**
 * Handles the request to create a new user (via Admin Panel).
 * Performs validation and delegates to the Service.
 */
export async function handleNewUserRequest(data: NewUserRequest) {
    // 1. Basic Validation
    if (!data.name || !data.email || !data.password || !data.role) {
        throw new Error("Missing required fields: name, email, password, and role.");
    }
    
    // Validate role against enum
    const validRoles: UserRole[] = ["simple user", "admin", "HR", "Team Lead", "CEO", "CTO"];
    if (!validRoles.includes(data.role as UserRole)) {
        throw new Error("Invalid role specified.");
    }

    // 2. Delegate to Service layer for creation (handles hashing and DB save)
    const newUser = await createNewUserService(data);
    
    // 3. Return cleaned user object
    return {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar || null, // Return the saved avatar URL
    };
}


/* -------------------------------------------------------------------------- */
/* 2. GET SINGLE USER HANDLER (New addition for fetching user profile)          */
/* -------------------------------------------------------------------------- */

/**
 * Handles fetching a single user by ID.
 * @param id - The user's MongoDB ID.
 * @returns The cleaned user object.
 */
export async function handleGetSingleUser(id: string) {
    if (!id) {
        throw new Error("Missing user ID.");
    }

    // 1. Delegate to Service layer
    const user = await getSingleUserService(id);

    // 2. Clean and map the data for the API response
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || user.picture || null, 
        phonenumber: user.phonenumber || null,
        companyname: user.companyname || null,
        createdAt: user.createdAt,
    };
}


/* -------------------------------------------------------------------------- */
/* 3. UPDATE USER HANDLER (New: For Admin editing user details)                */
/* -------------------------------------------------------------------------- */

/**
 * Handles the request from Admin to update a user's details.
 * @param userId - The ID of the user to update.
 * @param updateData - The fields to update, including avatar URL.
 * @returns The updated and cleaned user object.
 */
export async function handleUpdateUserRequest(userId: string, updateData: UpdateUserRequest) {
    if (!userId) {
        throw new Error("Missing user ID for update operation.");
    }
    
    // 1. Role Validation (If role is being updated)
    if (updateData.role) {
        const validRoles: UserRole[] = ["simple user", "admin", "HR", "Team Lead", "CEO", "CTO"];
        if (!validRoles.includes(updateData.role as UserRole)) {
            throw new Error("Invalid role specified for update.");
        }
    }
    
    // 2. Delegate to Service layer
    const updatedUser = await updateUserService(userId, updateData);

    // 3. Return updated and cleaned user object
    return {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar || updatedUser.picture || null,
        phonenumber: updatedUser.phonenumber || null,
        companyname: updatedUser.companyname || null,
        createdAt: updatedUser.createdAt,
    };
}


/* -------------------------------------------------------------------------- */
/* 4. DELETE USER HANDLER                                                      */
/* -------------------------------------------------------------------------- */
export async function handleDeleteUserRequest(userId: string) {
  try {
    // 1. Delegate to Service layer
    await deleteUserService(userId);

    return {
      message: `✅ User with ID ${userId} successfully deleted.`,
      success: true,
    };
  } catch (error: unknown) {
    console.error("❌ Controller Error (Delete User):", error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 5. GET ALL USERS HANDLER (Includes all profile fields)                      */
/* -------------------------------------------------------------------------- */
export async function handleGetAllUsers() {
  try {
    // 1. Delegate to the Service layer to fetch data from all relevant models
    const allUsers = await getAllUsersService();

    if (!Array.isArray(allUsers)) {
      console.warn("⚠️ getAllUsersService() did not return an array:", allUsers);
      return [];
    }
    
    // 2. Map and clean the data for the API response, including new fields
    // FIX: Replaced 'any' with 'IUser' for type safety
    const mappedUsers = allUsers.map((user: IUser) => ({ 
        id: typeof user._id === 'string' ? user._id : user._id.toString(), // Added explicit ID check for safety
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || user.picture || null, // Handle both 'avatar' and 'picture' fields
        phonenumber: user.phonenumber || null,
        companyname: user.companyname || null,
        createdAt: user.createdAt,
    }));
    
    // 3. Return the cleaned array
    return mappedUsers;

  } catch (error) {
    console.error("❌ Controller Error (Get Users):", error);
    return []; // Always return array to avoid frontend errors
  }
}
