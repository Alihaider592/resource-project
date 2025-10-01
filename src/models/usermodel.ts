// /models/UserModel.ts
import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  companyname: { type: String },
  comment: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  password: { type: String, required: true },
});

const User = models.User || model("User", UserSchema);
export default User;
