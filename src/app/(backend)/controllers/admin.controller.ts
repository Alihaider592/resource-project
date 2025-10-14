
import { getAllUsersService,getSingleUserService,createNewUserService,deleteUserService,updateUserService } from "../services /admin.service";
import { UserRole } from "../models/adduser";

/* -------------------------------------------------------------------------- */
/* TYPES AND INTERFACES                                                       */
/* -------------------------------------------------------------------------- */

interface NewUserRequest {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password: string;
  avatar?: string;

  phone?: string;
  emergencyContact?: string;
  cnic?: string;
  birthday?: string;
  gender?: string;
  maritalStatus?: string;
  bloodGroup?: string;

  department?: string;
  role: UserRole;
  timing?: string;
  joiningDate?: string;
  leavingDate?: string;
  location?: string;
  workType?: string;

  address?: string;
  city?: string;
  state?: string;
  zip?: string;

  experienceLevel?: string;
  experienceYears?: string;
  previousCompany?: string;
  education?: string;

  salary?: string;
  bankAccount?: string;
  additionalInfo?: string;
}

// ✅ Use Partial<NewUserRequest> directly instead of empty interface
type UpdateUserRequest = Partial<NewUserRequest>;
