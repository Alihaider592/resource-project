import mongoose, { Schema, model, models, Document } from "mongoose";

interface Approval {
  status: "approved" | "rejected";
  reason?: string;
  approver: string;
  date: Date;
}

interface ApproverComment {
  approver: string;
  action: "approve" | "reject";
  comment?: string;
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
    teamlead?: Approval | null;
    hr?: Approval | null;
  };
  approverComments: ApproverComment[];
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalSchema = new Schema<Approval>({
  status: { type: String, enum: ["approved", "rejected"], required: true },
  reason: { type: String },
  approver: { type: String, required: true },
  date: { type: Date, required: true },
});

const ApproverCommentSchema = new Schema<ApproverComment>({
  approver: { type: String, required: true },
  action: { type: String, enum: ["approve", "reject"], required: true },
  comment: { type: String, default: "" },
  date: { type: Date, required: true },
});

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
    approvals: {
      teamlead: { type: ApprovalSchema, default: null },
      hr: { type: ApprovalSchema, default: null },
    },
    // ✅ Always initialize to an empty array
    approverComments: { type: [ApproverCommentSchema], default: [] },
  },
  { timestamps: true }
);

// ✅ Safe export pattern for Next.js hot reloads
const WorkFromHomeModel =
  models?.WorkFromHome || model<IWorkFromHome>("WorkFromHome", WorkFromHomeSchema);

export default WorkFromHomeModel;
