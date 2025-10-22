import mongoose, { Schema, Document } from "mongoose";

export interface IWFHRequest extends Document {
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  reason: string;
  workDescription: string; // what employee will do at home
  status: "pending" | "approved" | "rejected";
  approverRole?: "hr" | "teamlead" | null;
  rejectionReason?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const WFHRequestSchema = new Schema<IWFHRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, required: true },
    workDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approverRole: { type: String, enum: ["hr", "teamlead", null], default: null },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

const WFHRequest =
  mongoose.models.WFHRequest || mongoose.model<IWFHRequest>("WFHRequest", WFHRequestSchema);

export default WFHRequest;
