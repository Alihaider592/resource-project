
import { createNewUserService } from "@/app/(backend)/services /admin.service";
import { UserRole, WorkType } from "@/app/(backend)/models/adduser";

/* -------------------------------------------------------------------------- */
/* INTERFACE DEFINITIONS                                                      */
/* -------------------------------------------------------------------------- */
export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  workType?: WorkType;
  avatar?: string;
  employeeId?: string;

  // ✅ Added these fields so TS accepts them
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
  experienceYears?: string;
  education?: string;
  bankAccount?: string;
  salary?: string;
}

/* -------------------------------------------------------------------------- */
/* CONTROLLER FUNCTION                                                        */
/* -------------------------------------------------------------------------- */
export async function handleNewUserRequest(data: NewUserRequest) {
  try {
    const newUser = await createNewUserService(data);
    return newUser;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Controller error:", err.message);
    throw new Error(`Failed to create user: ${err.message}`);
  }
}
