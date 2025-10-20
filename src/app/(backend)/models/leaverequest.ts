import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for LeaveRequest document
export interface ILeaveRequest extends Document {
  userId: Types.ObjectId; // MongoDB reference
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected"; // overall leave status
  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };
  approverStatus: {
    [key: string]: "approve" | "reject"; // key = approver email
  };
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

    // NEW: track each approver's action
    approverStatus: {
      type: Map,
      of: String, // "approve" or "reject"
      default: {},
    },
  },
  { timestamps: true }
);

// Avoid model overwrite in dev mode
const LeaveRequest =
  mongoose.models.LeaveRequest ||
  mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
