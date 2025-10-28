import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "teamlead" | "hr" | "admin";
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["user", "teamlead", "hr", "admin"], default: "user" },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
