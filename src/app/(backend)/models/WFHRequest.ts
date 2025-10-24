import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWFHRequest extends Document {
  name: string;
  email: string;
  reason: string;
  workDetails: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };
  approverStatus?: Record<string, "approve" | "reject">;
  approverComments?: {
    approver: string;
    action: "approve" | "reject";
    comment?: string;
    date: Date;
  }[];
}

const WFHRequestSchema = new Schema<IWFHRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    reason: { type: String, required: true },
    workDetails: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvers: {
      teamLead: { type: String, default: null },
      hr: { type: String, default: null },
    },
    approverStatus: {
      type: Map,
      of: { type: String, enum: ["approve", "reject"] },
      default: {},
    },
    approverComments: [
      {
        approver: { type: String, required: true },
        action: { type: String, enum: ["approve", "reject"], required: true },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in Next.js
const WFHRequest: Model<IWFHRequest> =
  mongoose.models.WFHRequest || mongoose.model<IWFHRequest>("WFHRequest", WFHRequestSchema);

export default WFHRequest;
