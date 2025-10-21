import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
  name: string;
  email: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";

  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };

  approverStatus: {
    [key: string]: "approve" | "reject";
  };

  approverComments: {
    approver: string;
    action: "approve" | "reject";
    comment?: string;
    date: Date;
  }[];
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
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

    approverStatus: {
      type: Map,
      of: String, // approve | reject
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

// Prevent model overwrite during hot reload
const LeaveRequest =
  mongoose.models.LeaveRequest ||
  mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
