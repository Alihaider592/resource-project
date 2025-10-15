import { 
  createNewUserService, 
  getAllUsersService, 
  IUserResponse 
} from "../services /admin.service";
import { UserRole, WorkType } from "@/app/(backend)/models/adduser";

// NewUserRequest interface (already present)
export interface NewUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  workType?: WorkType | null;
  avatar?: string;
  employeeId?: string;
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
  experienceLevel?: "Fresher" | "Experienced" | null;
  previousCompany?: string;
  experienceYears?: string;
  education?: string;
  bankAccount?: string;
  salary?: string;
}

// Handle creation
export async function handleNewUserRequest(
  employeeData: NewUserRequest
): Promise<IUserResponse> {
  return createNewUserService(employeeData);
}

// ✅ Handle fetching all users
export async function handleGetAllUsers(): Promise<IUserResponse[]> {
  return getAllUsersService();
}
