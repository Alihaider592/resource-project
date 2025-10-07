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
  createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
