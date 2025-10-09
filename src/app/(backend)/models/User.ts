import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phonenumber?: string; // Made optional for updates
  companyname?: string; // Made optional for updates
  comment?: string;
  role: "admin" | "hr" | "teamlead" | "simpleuser";
  department?: string;
  team?: string;
  avatar?: string; // ⬅️ Yahi field picture URL store karta hai
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // IMPORTANT FIX: Made non-required for flexible updates
  phonenumber: { type: String, required: false }, 
  companyname: { type: String, required: false }, 
  
  comment: { type: String },
  role: {
    type: String,
    enum: ["admin", "hr", "teamlead", "simpleuser"],
    default: "simpleuser",
  },
  department: { type: String },
  team: { type: String },
  avatar: { type: String }, // ⬅️ Avatar field yahan define hai
  createdAt: { type: Date, default: Date.now },
});

// Fix to prevent Mongoose re-initialization errors in Next.js
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);

export default User;
