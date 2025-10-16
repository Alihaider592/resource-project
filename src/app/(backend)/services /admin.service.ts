// src/app/(backend)/services/admin.service.ts
import connectDatabase from "@/app/(backend)/lib/db";
import AddUser, { ISAddUser, UserRole, WorkType } from "@/app/(backend)/models/adduser";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

/* -------------------------------------------------------------------------- */
/* INTERFACES                                                                 */
/* -------------------------------------------------------------------------- */
export interface IUserResponse {
  _id: string;
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  role: UserRole;
  workType?: WorkType | null;
  avatar?: string | null;
  phone?: string | null;
  emergencyContact?: string | null;
  cnic?: string | null;
  birthday?: string | null;
  gender?: string | null;
  department?: string | null;
  timing?: string | null;
  joiningDate?: string | null;
  leavingDate?: string | null;
  joining?: string | null;
  leaving?: string | null;
  location?: string | null;
  Branch?: string | null;
  companybranch?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  experienceLevel?: "Fresher" | "Experienced" | null;
  experienceYears?: string | null; // keep string for API safety
  previousCompany?: string | null;
  education?: string | null;
  bankAccount?: string | null;
  salary?: string | null; // keep string for API safety
  additionalInfo?: string | null;
  createdAt?: string | null;
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */
function mapUserToResponse(user: ISAddUser): IUserResponse {
  return {
    _id: String(user._id),
    employeeId: user.employeeId,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    name: user.name ?? `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    workType: user.workType ?? null,
    avatar: user.avatar ?? null,
    phone: user.phone ?? null,
    emergencyContact: user.emergencyContact ?? null,
    cnic: user.cnic ?? null,
    birthday: user.birthday ?? null,
    gender: user.gender ?? null,
    department: user.department ?? null,
    timing: user.timing ?? null,
    joiningDate: user.joiningDate ?? null,
    leavingDate: user.leavingDate ?? null,
    joining: user.joining ? user.joining.toISOString() : null,
    leaving: user.leaving ? user.leaving.toISOString() : null,
    Branch: user.Branch ?? null,
    companybranch: user.companybranch ?? null,
    address: user.address ?? null,
    city: user.city ?? null,
    state: user.state ?? null,
    zip: user.zip ?? null,
    experienceLevel: user.experienceLevel ?? null,
    experienceYears:
      user.experienceYears !== undefined && user.experienceYears !== null
        ? String(user.experienceYears)
        : null,
    previousCompany: user.previousCompany ?? null,
    education: user.education ?? null,
    bankAccount: user.bankAccount ?? null,
    salary:
      user.salary !== undefined && user.salary !== null
        ? String(user.salary)
        : null,
    additionalInfo: user.additionalInfo ?? null,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
  };
}

/* -------------------------------------------------------------------------- */
/* CREATE USER                                                                */
/* -------------------------------------------------------------------------- */
export async function createNewUserService(
  userData: Partial<ISAddUser> & { password: string }
): Promise<IUserResponse> {
  await connectDatabase();

  if (!userData.name || !userData.email || !userData.password || !userData.role) {
    throw new Error("Missing required fields: name, email, password, or role");
  }

  // Check for existing email
  const existing = await AddUser.findOne({ email: userData.email });
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const employeeId = userData.employeeId || `EMP-${Date.now()}`;

  const newUser = await AddUser.create({
    ...userData,
    password: hashedPassword,
    employeeId,
  });

  return mapUserToResponse(newUser);
}

/* -------------------------------------------------------------------------- */
/* GET ALL USERS                                                              */
/* -------------------------------------------------------------------------- */
export async function getAllUsersService(): Promise<IUserResponse[]> {
  await connectDatabase();
  const users = await AddUser.find().sort({ createdAt: -1 }); // newest first
  return users.map(mapUserToResponse);
}

/* -------------------------------------------------------------------------- */
/* GET SINGLE USER                                                            */
/* -------------------------------------------------------------------------- */
export async function getSingleUserService(userId: string): Promise<IUserResponse | null> {
  await connectDatabase();

  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const user = await AddUser.findById(userId);
  return user ? mapUserToResponse(user) : null;
}

/* -------------------------------------------------------------------------- */
/* UPDATE USER                                                                */
/* -------------------------------------------------------------------------- */
export async function updateUserService(
  userId: string,
  updateData: Partial<ISAddUser>
): Promise<IUserResponse> {
  await connectDatabase();

  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const updatedUser = await AddUser.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) throw new Error("User not found");

  return mapUserToResponse(updatedUser);
}

/* -------------------------------------------------------------------------- */
/* DELETE USER                                                                */
/* -------------------------------------------------------------------------- */
export async function deleteUserService(userId: string): Promise<void> {
  await connectDatabase();

  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  const deleted = await AddUser.findByIdAndDelete(userId);
  if (!deleted) throw new Error("User not found");
}
