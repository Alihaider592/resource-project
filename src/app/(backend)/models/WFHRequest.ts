import mongoose, { Document, Schema, Model } from "mongoose";

// --- Type Definitions ---
export interface IWFHRequest extends Document {
  userId: string;
  name: string;
  email: string;
  role: string;
  teamId?: string | null; // For team-based filtering
  startDate: Date;
  endDate: Date;
  reason: string;
  workDescription: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema Definition ---
const WFHRequestSchema: Schema<IWFHRequest> = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    teamId: { type: String, default: null, index: true }, // Index for fast team lookups
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    workDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

// --- Model Export ---
const WorkFromHome: Model<IWFHRequest> =
  (mongoose.models.WorkFromHome as Model<IWFHRequest>) ||
  mongoose.model<IWFHRequest>("WorkFromHome", WFHRequestSchema);

export default WorkFromHome;
