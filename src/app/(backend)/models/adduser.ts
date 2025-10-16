import mongoose, { Schema, Document, Model } from "mongoose";

/* -------------------------------------------------------------------------- */
/* ROLE & WORK TYPE ENUMS                                                     */
/* -------------------------------------------------------------------------- */

// Allowed roles
export type UserRole = "Admin" | "HR" | "simple user" | "TeamLead";
export const UserRoles = {
  ADMIN: "Admin" as UserRole,
  HR: "HR" as UserRole,
  USER: "simpl Uuser" as UserRole,
  TEAM_LEAD: "TeamLead" as UserRole,
};

// Work types
export type WorkType = "On-site" | "Remote" | "Hybrid";
export const WorkTypes = {
  ON_SITE: "On-site" as WorkType,
  REMOTE: "Remote" as WorkType,
  HYBRID: "Hybrid" as WorkType,
};

/* -------------------------------------------------------------------------- */
/* EXPERIENCE LEVEL ENUM                                                      */
/* -------------------------------------------------------------------------- */
export type ExperienceLevel = "Fresher" | "Experienced";

/* -------------------------------------------------------------------------- */
/* INTERFACE                                                                  */
/* -------------------------------------------------------------------------- */
export interface ISAddUser extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  workType?: WorkType;
  avatar?: string;
  phone?: string;
  emergencyContact?: string;
  cnic?: string;
  birthday?: string;
  gender?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  department?: string;
  timing?: string;
  joiningDate?: string;
  leavingDate?: string;
  joining?: Date;
  leaving?: Date;
  location?: string;
  Branch?: string;
  companybranch?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  experienceLevel?: ExperienceLevel;
  experienceYears?: number;
  previousCompany?: string;
  education?: string;
  bankAccount?: string;
  salary?: number;
  additionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* -------------------------------------------------------------------------- */
/* SCHEMA                                                                     */
/* -------------------------------------------------------------------------- */
const AddUserSchema: Schema<ISAddUser> = new Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, required: true, enum: Object.values(UserRoles) },
    workType: { type: String, enum: Object.values(WorkTypes), default: WorkTypes.ON_SITE },
    avatar: { type: String, default: null },

    phone: { type: String, default: null },
    emergencyContact: { type: String, default: null },
    cnic: { type: String, default: null },
    birthday: { type: String, default: null },
    gender: { type: String, default: null },
    maritalStatus: { type: String, default: null },
    bloodGroup: { type: String, default: null },
    department: { type: String, default: null },
    timing: { type: String, default: null },

    joiningDate: { type: String, default: null },
    leavingDate: { type: String, default: null },
    joining: { type: Date, default: null },
    leaving: { type: Date, default: null },

    location: { type: String, default: null },
    Branch: { type: String, default: null },
    companybranch: { type: String, default: null },
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zip: { type: String, default: null },

    experienceLevel: { type: String, enum: ["Fresher", "Experienced"], default: null },
    experienceYears: { type: Number, default: 0, min: 0 },
    previousCompany: { type: String, default: null },
    education: { type: String, default: null },

    bankAccount: { type: String, default: null },
    salary: { type: Number, default: 0, min: 0 },

    additionalInfo: { type: String, default: null },
  },
  { timestamps: true }
);

/* -------------------------------------------------------------------------- */
/* MODEL EXPORT                                                               */
/* -------------------------------------------------------------------------- */
const AddUser: Model<ISAddUser> = mongoose.models.AddUser || mongoose.model<ISAddUser>("AddUser", AddUserSchema);

export default AddUser;
