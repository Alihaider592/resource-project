import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phonenumber: string;
  companyname: string;
  comment?: string;
  role: "admin" | "hr" | "teamlead" | "simpleuser";
  department?: string;
  team?: string;
  avatar?: string; // ✅ ADDED: Field for the avatar URL/path
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  companyname: { type: String, required: true },
  comment: { type: String },
  role: {
    type: String,
    enum: ["admin", "hr", "teamlead", "simpleuser"],
    default: "simpleuser",
  },
  department: { type: String },
  team: { type: String },
  avatar: { type: String }, // ✅ ADDED: Schema definition for avatar
  createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;