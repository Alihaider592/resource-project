import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for LeaveRequest document
export interface ILeaveRequest extends Document {
  userId: Types.ObjectId; // ✅ Use ObjectId for MongoDB references
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected"; // ✅ status field
  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ reference to User collection
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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

// Avoid model overwrite in dev mode
const LeaveRequest =
  mongoose.models.LeaveRequest ||
  mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
