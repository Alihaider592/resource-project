import mongoose, { Schema, Document } from "mongoose";

export interface IWFHRequest extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const WFHRequestSchema = new Schema<IWFHRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvers: {
      teamLead: { type: String, default: null },
      hr: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const WFHRequest =
  mongoose.models.WFHRequest || mongoose.model<IWFHRequest>("WFHRequest", WFHRequestSchema);

export default WFHRequest;
