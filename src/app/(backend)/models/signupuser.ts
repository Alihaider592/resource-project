import mongoose, { Schema, Document } from "mongoose";

export interface ISignupUser extends Document {
  name: string;
  email: string;
  password: string;
}

const SignupUserSchema: Schema<ISignupUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const SignupUser =
  mongoose.models.SignupUser ||
  mongoose.model<ISignupUser>("SignupUser", SignupUserSchema);

export default SignupUser;
