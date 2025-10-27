import mongoose, { Schema, Document } from "mongoose";

export interface IWorkFromHome extends Document {
  name: string;
  email: string;
  date: string;
  workType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvals: {
    teamlead?: { status: "approved" | "rejected"; reason?: string; date?: Date };
    hr?: { status: "approved" | "rejected"; reason?: string; date?: Date };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalSchema = new Schema(
  {
    status: { type: String, enum: ["approved", "rejected"] },
    reason: { type: String },
    date: { type: Date },
  },
  { _id: false } // No separate _id for approvals
);

const WorkFromHomeSchema = new Schema<IWorkFromHome>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    workType: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvals: {
      teamlead: { type: ApprovalSchema, default: undefined },
      hr: { type: ApprovalSchema, default: undefined },
    },
  },
  { timestamps: true }
);

export default mongoose.models.WorkFromHome || mongoose.model("WorkFromHome", WorkFromHomeSchema);
