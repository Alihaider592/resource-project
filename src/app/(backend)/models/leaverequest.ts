import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
  userId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected"; // ✅ new field
  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    userId: { type: String, required: true },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },

    // ✅ new default field
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

const LeaveRequest =
  mongoose.models.LeaveRequest ||
  mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
