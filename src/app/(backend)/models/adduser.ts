import mongoose, { Schema, Document, Model } from "mongoose";

// Allowed roles
export type UserRole = "Admin" | "HR" | "User" | "TeamLead";

// Work type
export type WorkType = "On-site" | "Remote" | "Hybrid";

// Employee Document Interface
export interface ISAddUser extends Document {
  // Core user details
  employeeId: string;
  firstName: string;
  lastName: string;
  name: string; // full name (optional)
  email: string;
  password: string;
  avatar?: string | null;
  picture?: string | null; // ✅ added picture

  // Contact info
  phone?: string | null;
  emergencyContact?: string | null;
  cnic?: string | null;
  birthday?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  bloodGroup?: string | null;

  // Job details
  department?: string | null;
  role: UserRole;
  timing?: string | null;
  joiningDate?: string | null;
  leavingDate?: string | null;
  location?: string | null;
  workType?: WorkType | null;

  // Address info
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;

  // Education & Experience
  experienceYears?: string | null;
  previousCompany?: string | null;
  education?: string | null;
  experienceLevel?: "Fresher" | "Experienced" | null;

  // Financial & Additional
  salary?: string | null;
  bankAccount?: string | null;
  additionalInfo?: string | null;

  // Optional legacy fields
  phonenumber?: string | null;
  companyname?: string | null;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

const AddUserSchema: Schema<ISAddUser> = new Schema(
  {
    // 🔹 Core Details
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    picture: { type: String, default: null }, // ✅ added

    // 🔹 Contact Info
    phone: { type: String, default: null },
    emergencyContact: { type: String, default: null },
    cnic: { type: String, default: null },
    birthday: { type: String, default: null },
    gender: { type: String, default: null },
    maritalStatus: { type: String, default: null },
    bloodGroup: { type: String, default: null },

    // 🔹 Job Info
    department: { type: String, default: null },
    role: { type: String, required: true, enum: ["Admin", "HR", "User", "TeamLead"] },
    timing: { type: String, default: null },
    joiningDate: { type: String, default: null },
    leavingDate: { type: String, default: null },
    location: { type: String, default: null },
    workType: { type: String, enum: ["On-site", "Remote", "Hybrid"], default: "On-site" },

    // 🔹 Address Info
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zip: { type: String, default: null },

    // 🔹 Education & Experience
    experienceLevel: { type: String, enum: ["Fresher", "Experienced"], default: null },
    experienceYears: { type: String, default: null },
    previousCompany: { type: String, default: null },
    education: { type: String, default: null },

    // 🔹 Financial & Additional
    salary: { type: String, default: null },
    bankAccount: { type: String, default: null },
    additionalInfo: { type: String, default: null },

    // 🔹 Optional Legacy
    phonenumber: { type: String, default: null },
    companyname: { type: String, default: null },
  },
  { timestamps: true } // ✅ ensures createdAt & updatedAt
);

// Prevent model overwrite in Next.js
const AddUser: Model<ISAddUser> =
  mongoose.models.AddUser || mongoose.model<ISAddUser>("AddUser", AddUserSchema);

export default AddUser;
