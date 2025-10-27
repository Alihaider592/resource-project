// src/app/(backend)/models/WorkFromHome.ts
import mongoose, { Schema, model, Document } from "mongoose";

interface Approval {
  status: "approved" | "rejected";
  reason?: string;
  approver: string;
  date: Date;
}

export interface IWorkFromHome extends Document {
  name: string;
  email: string;
  date: string;
  workType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvals: {
    teamlead?: Approval;
    hr?: Approval;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalSchema = new Schema<Approval>({
  status: { type: String, enum: ["approved", "rejected"], required: true },
  reason: { type: String },
  approver: { type: String, required: true },
  date: { type: Date, required: true },
});

const WorkFromHomeSchema = new Schema<IWorkFromHome>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    workType: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvals: {
      teamlead: { type: ApprovalSchema, default: null },
      hr: { type: ApprovalSchema, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models.WorkFromHome || model<IWorkFromHome>("WorkFromHome", WorkFromHomeSchema);
