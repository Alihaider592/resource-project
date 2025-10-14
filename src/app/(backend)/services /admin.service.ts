import connectDatabase from "@/app/(backend)/lib/db";
import AddUser, { UserRole, ISAddUser, WorkType } from "@/app/(backend)/models/adduser";
import bcrypt from "bcryptjs";
import { Types, ObjectId } from "mongoose";

// Response interface
export interface IUserResponse {
  _id: string;
  employeeId?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  picture?: string | null;
  phone?: string | null;
  emergencyContact?: string | null;
  cnic?: string | null;
  birthday?: string | null;
  gender?: string | null;
  department?: string | null;
  timing?: string | null;
  joiningDate?: string | null;
  leavingDate?: string | null;
  location?: string | null;
  workType?: WorkType | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  experienceYears?: string | null;
  previousCompany?: string | null;
  education?: string | null;
  salary?: string | null;
  additionalInfo?: string | null;
  createdAt?: Date;
}

// Manual LeanUser type
type LeanUser = Partial<ISAddUser> & { _id: ObjectId; createdAt?: Date; picture?: string };

// -------------------------------------------------------------------------- //
// HELPER TO MAP USERS TO RESPONSE
// -------------------------------------------------------------------------- //
function mapUserToResponse(user: LeanUser): IUserResponse {
  if (!user.name || !user.email || !user.role) throw new Error("Missing required fields");

  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    avatar: user.avatar ?? null,
    picture: user.picture ?? null,
    phone: user.phone ?? null,
    emergencyContact: user.emergencyContact ?? null,
    cnic: user.cnic ?? null,
    birthday: user.birthday ?? null,
    gender: user.gender ?? null,
    department: user.department ?? null,
    timing: user.timing ?? null,
    joiningDate: user.joiningDate ?? null,
    leavingDate: user.leavingDate ?? null,
    location: user.location ?? null,
    workType: user.workType ?? null,
    address: user.address ?? null,
    city: user.city ?? null,
    state: user.state ?? null,
    zip: user.zip ?? null,
    experienceYears: user.experienceYears ?? null,
    previousCompany: user.previousCompany ?? null,
    education: user.education ?? null,
    salary: user.salary ?? null,
    additionalInfo: user.additionalInfo ?? null,
    createdAt: user.createdAt ?? undefined,
  };
}

// -------------------------------------------------------------------------- //
// CRUD OPERATIONS
// -------------------------------------------------------------------------- //

export async function createNewUserService(userData: Partial<ISAddUser> & { password: string }): Promise<IUserResponse> {
  await connectDatabase();
  const { password, ...rest } = userData;

  const existingUser = await AddUser.findOne({ email: rest.email }).lean().exec();
  if (existingUser) throw new Error(`User with email ${rest.email} already registered.`);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await AddUser.create({ ...rest, password: hashedPassword });

  // cast via unknown first to bypass TS lean type issues
  return mapUserToResponse(newUser.toObject() as unknown as LeanUser);
}

export async function getSingleUserService(id: string): Promise<IUserResponse> {
  await connectDatabase();
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid user ID format.");

  const user = await AddUser.findById(id).select("-password").lean().exec();
  if (!user) throw new Error(`User not found`);

  return mapUserToResponse(user as unknown as LeanUser);
}

export async function getAllUsersService(): Promise<IUserResponse[]> {
  await connectDatabase();
  const users = await AddUser.find({}).select("-password").lean().exec();
  return (users as unknown as LeanUser[]).map(mapUserToResponse);
}

export async function updateUserService(userId: string, updateData: Partial<ISAddUser> & { password?: string }): Promise<IUserResponse> {
  await connectDatabase();
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid ID format");

  const updates = { ...updateData };
  if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);

  const updatedUser = await AddUser.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true })
    .select("-password")
    .lean()
    .exec();

  if (!updatedUser) throw new Error("Update failed");

  return mapUserToResponse(updatedUser as unknown as LeanUser);
}

export async function deleteUserService(userId: string): Promise<boolean> {
  await connectDatabase();
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid ID format");

  const deletedUser = await AddUser.findByIdAndDelete(userId).exec();
  if (!deletedUser) throw new Error("Delete failed");

  return true;
}
