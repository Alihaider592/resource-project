import mongoose, { Schema, Document } from "mongoose";

export interface IWorkFromHome extends Document {
  name: string;
  email: string;
  date: string;
  workType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  role: "user" | "teamlead" | "hr";
  createdAt: Date;
  approvedBy?: string;
  rejectedBy?: string;
  updatedAt?: Date;
}

const WorkFromHomeSchema = new Schema<IWorkFromHome>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    workType: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    role: { type: String, enum: ["user", "teamlead", "hr"], required: true },
    approvedBy: { type: String, default: null },
    rejectedBy: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.WorkFromHome ||
  mongoose.model<IWorkFromHome>("WorkFromHome", WorkFromHomeSchema);
