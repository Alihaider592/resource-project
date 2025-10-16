import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phonenumber?: string;
  companyname?: string;
  comment?: string;
  role: "admin" | "hr" | "teamlead" | "simple user"; // ✅ consistent lowercase roles
  department?: string;
  team?: string;
  avatar?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: false },
  companyname: { type: String, required: false },
  comment: { type: String },
  role: {
    type: String,
    enum: ["admin", "hr", "teamlead", "simple user",], // ✅ lowercase and matches interface
    default: "simple user",
  },
  department: { type: String },
  team: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent model re-registration errors in Next.js
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);

export default User;
