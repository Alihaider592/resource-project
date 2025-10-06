import mongoose, { Schema, Document, Model } from "mongoose";

// The TypeScript type definition for clarity
export type UserRole =
  | "simple user"
  | "admin"
  | "HR"
  | "Team Lead"
  | "CEO"
  | "CTO";

export interface ISAddUser extends Document {
  name: string;
  email: string;
  password: string;
  picture?: string | null;
  role: UserRole;
}

const AddUserSchema: Schema<ISAddUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, default: null },
    role:{type:String,required:true ,enum: ["simple user", "admin", "HR", "Team Lead", "CEO", "CTO"] },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent Mongoose error
const AddUser: Model<ISAddUser> =
  mongoose.models.AddUser || mongoose.model<ISAddUser>("AddUser", AddUserSchema);

export default AddUser;