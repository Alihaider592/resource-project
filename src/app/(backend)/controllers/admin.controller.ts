import connectToDatabase from "@/app/(backend)/lib/db";
import {
  createAdminUser,
  deleteUserById,
  fetchAllUsers,
} from "../services /admin.service";
// import { createAdminUser } from "../services /admin.service";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */
interface NewUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface IUser {
  _id: string | { toString(): string };
  name: string;
  email: string;
  role: string;
  password?: string;
  toObject?: () => IUser;
}

/* -------------------------------------------------------------------------- */
/* 1. CREATE ADMIN USER HANDLER                                                */
/* -------------------------------------------------------------------------- */
export async function handleNewUserRequest(userData: NewUserData) {
  try {
    await connectToDatabase();

    const newUser = await createAdminUser(userData);

    // ✅ Avoid “any” using a type guard instead
    const isMongooseDoc = (obj: unknown): obj is { toObject: () => IUser } =>
      typeof obj === "object" &&
      obj !== null &&
      "toObject" in obj &&
      typeof (obj as { toObject: () => IUser }).toObject === "function";

    const userObj = isMongooseDoc(newUser)
      ? newUser.toObject()
      : (newUser as IUser);

    const { password, ...safeUser } = userObj;
    return safeUser;
  } catch (error: unknown) {
    console.error("❌ Controller Error (Add User):", error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* 2. DELETE USER HANDLER                                                      */
/* -------------------------------------------------------------------------- */
export async function handleDeleteUserRequest(userId: string) {
  try {
    await connectToDatabase();
    await deleteUserById(userId);

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
/* 3. GET ALL USERS HANDLER                                                    */
/* -------------------------------------------------------------------------- */
export async function handleGetAllUsers() {
  try {
    await connectToDatabase();

    const users = await fetchAllUsers();

    if (!Array.isArray(users)) {
      console.warn("⚠️ fetchAllUsers() did not return an array:", users);
      return [];
    }

    // ✅ Typed mapping — no `any`
    return users.map((u: IUser) => ({
      id: typeof u._id === "string" ? u._id : u._id.toString(),
      name: u.name || "Unknown",
      email: u.email || "N/A",
      role: u.role || "user",
    }));
  } catch (error) {
    console.error("❌ Controller Error (Get Users):", error);
    return []; // ✅ Always return array to avoid frontend errors
  }
}
