import mongoose, { Schema, Document } from "mongoose";

export interface ISignupUser extends Document {
  name: string;
  email: string;
  password: string;
  picture?: string | null; // ⬅️ Profile Picture URL ke liye joda gaya
  phonenumber?: string | null; // Profile Update support ke liye joda gaya
  companyname?: string | null; // Profile Update support ke liye joda gaya
}

const SignupUserSchema: Schema<ISignupUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, default: null }, // ⬅️ Schema mein joda gaya
    phonenumber: { type: String, required: false }, // Schema mein joda gaya
    companyname: { type: String, required: false }, // Schema mein joda gaya
  },
  { timestamps: true }
);

const SignupUser =
  mongoose.models.SignupUser ||
  mongoose.model<ISignupUser>("SignupUser", SignupUserSchema);

export default SignupUser;
