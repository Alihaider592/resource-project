import mongoose, { Schema, Document } from "mongoose";

export interface IWFH extends Document {
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  reason: string;
  workDescription: string;
  status: "pending" | "approved" | "rejected";
  approvers: {
    hr?: string | null;
    teamLead?: string | null;
  };
  rejectionReason?: string | null;
  createdAt: Date;
}

const WorkFromHomeSchema = new Schema<IWFH>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, required: true },
    workDescription: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvers: {
      hr: { type: String, default: null },
      teamLead: { type: String, default: null },
    },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

const WorkFromHome =
  mongoose.models.WorkFromHome || mongoose.model<IWFH>("WorkFromHome", WorkFromHomeSchema);

export default WorkFromHome;
