import {
  getAllUsersService,
  getSingleUserService,
  createNewUserService,
  deleteUserService,
  updateUserService,
} from "../services /admin.service";

import { UserRole, WorkType } from "@/app/(backend)/models/adduser";

/* -------------------------------------------------------------------------- */
/* INTERFACE DEFINITIONS                                                      */
/* -------------------------------------------------------------------------- */
export interface NewUserRequest {
  name?: string;
  email: string;
  password: string;
  role: UserRole;
  workType?: WorkType;
  avatar?: string;
  employeeId?: string;

  firstName?: string;
  lastName?: string;
  cnic?: string;
  phone?: string;
  emergencyContact?: string;
  birthday?: string;
  gender?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  department?: string;
  experienceLevel?: "Fresher" | "Experienced";
  previousCompany?: string;
  experienceYears?: string; // input comes as string
  education?: string;
  bankAccount?: string;
  salary?: string; // input comes as string
}

/* -------------------------------------------------------------------------- */
/* CREATE NEW USER                                                            */
/* -------------------------------------------------------------------------- */
export async function handleNewUserRequest(data: NewUserRequest) {
  try {
    // If name is not provided, combine firstName and lastName
    if (!data.name && (data.firstName || data.lastName)) {
      data.name = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
    }

    // ✅ Convert numeric strings to numbers before sending to service
    const formattedData = {
      ...data,
      experienceYears: data.experienceYears
        ? Number(data.experienceYears)
        : null,
      salary: data.salary ? Number(data.salary) : null,
    };

    const newUser = await createNewUserService(formattedData);
    return {
      success: true,
      message: "✅ User created successfully",
      user: newUser,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Create user error:", err.message);
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/* GET ALL USERS                                                              */
/* -------------------------------------------------------------------------- */
export async function handleGetAllUsers() {
  try {
    const users = await getAllUsersService();
    return {
      success: true,
      message: "✅ Users fetched successfully",
      users,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Get all users error:", err.message);
    throw new Error(`Failed to fetch users: ${err.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/* GET SINGLE USER                                                            */
/* -------------------------------------------------------------------------- */
export async function handleGetSingleUser(userId: string) {
  try {
    const user = await getSingleUserService(userId);
    if (!user) throw new Error("User not found");

    return {
      success: true,
      message: "✅ User fetched successfully",
      user,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Get single user error:", err.message);
    throw new Error(`Failed to fetch user: ${err.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/* UPDATE USER                                                                */
/* -------------------------------------------------------------------------- */
export async function handleUpdateUser(
  userId: string,
  updateData: Partial<NewUserRequest>
) {
  try {
    // ✅ Convert numeric strings to numbers before update
    const formattedUpdateData = {
      ...updateData,
      experienceYears: updateData.experienceYears
        ? Number(updateData.experienceYears)
        : null,
      salary: updateData.salary ? Number(updateData.salary) : null,
    };

    const updatedUser = await updateUserService(userId, formattedUpdateData);
    return {
      success: true,
      message: "✅ User updated successfully",
      user: updatedUser,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Update user error:", err.message);
    throw new Error(`Failed to update user: ${err.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE USER                                                                */
/* -------------------------------------------------------------------------- */
export async function handleDeleteUser(userId: string) {
  try {
    await deleteUserService(userId);
    return {
      success: true,
      message: "🗑️ User deleted successfully",
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Delete user error:", err.message);
    throw new Error(`Failed to delete user: ${err.message}`);
  }
}
