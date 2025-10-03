import mongoose, { Schema, Document } from "mongoose";

export interface ISAddUser extends Document {
  name: string;
  email: string;
  password: string;
  picture?: string;   
}

const AddUserSchema: Schema<ISAddUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, default: null }, 
  },
  { timestamps: true }
);

const AddUser =
  mongoose.models.AddUser || mongoose.model<ISAddUser>("AddUser", AddUserSchema);

export default AddUser;
