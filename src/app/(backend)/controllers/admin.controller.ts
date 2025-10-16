import {
  getAllUsersService,
  getSingleUserService,
  createNewUserService,
  deleteUserService,
  updateUserService,
} from "../services /admin.service";
import { UserRole, WorkType, ISAddUser } from "@/app/(backend)/models/adduser";

/* -------------------------------------------------------------------------- */
/* INTERFACE DEFINITIONS                                                      */
/* -------------------------------------------------------------------------- */
export interface NewUserRequest {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password: string;
  role: UserRole;
  workType?: WorkType;
  avatar?: string;
  employeeId?: string;
  joiningDate?: string; // API string
  leavingDate?: string; // API string
  Branch?: string;
  timing?: string;
  joining?: string; // input string
  leaving?: string; // input string
  companybranch?: string;
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
    if (!data.name && (data.firstName || data.lastName)) {
      data.name = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
    }

    const formattedData: Partial<ISAddUser> & { password: string } = {
      ...data,
      experienceYears: data.experienceYears ? Number(data.experienceYears) : undefined,
      salary: data.salary ? Number(data.salary) : undefined,
      joining: data.joining ? new Date(data.joining) : undefined,
      leaving: data.leaving ? new Date(data.leaving) : undefined,
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
    const formattedUpdateData: Partial<ISAddUser> = {
      ...updateData,
      experienceYears: updateData.experienceYears ? Number(updateData.experienceYears) : undefined,
      salary: updateData.salary ? Number(updateData.salary) : undefined,
      joining: updateData.joining ? new Date(updateData.joining) : undefined,
      leaving: updateData.leaving ? new Date(updateData.leaving) : undefined,
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
export async function handleDeleteUserRequest(userId: string) {
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
