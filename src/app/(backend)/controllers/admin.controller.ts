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
    return newUser;
  } catch (error: unknown) {
    console.error("❌ Create user error:", error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* GET ALL USERS                                                              */
/* -------------------------------------------------------------------------- */
export async function handleGetAllUsers() {
  try {
    const users = await getAllUsersService();
    return Array.isArray(users) ? users : [];
  } catch (error: unknown) {
    console.error("❌ Get all users error:", error);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* GET SINGLE USER                                                            */
/* -------------------------------------------------------------------------- */
export async function handleGetSingleUser(userId: string) {
  try {
    const user = await getSingleUserService(userId);
    return user ?? null; // ✅ return null if not found
  } catch (error: unknown) {
    console.error("❌ Get single user error:", error);
    return null;
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
    return updatedUser ?? null;
  } catch (error: unknown) {
    console.error("❌ Update user error:", error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE USER                                                                */
/* -------------------------------------------------------------------------- */
export async function handleDeleteUserRequest(userId: string) {
  try {
    await deleteUserService(userId);
    return true;
  } catch (error: unknown) {
    console.error("❌ Delete user error:", error);
    return false;
  }
}
