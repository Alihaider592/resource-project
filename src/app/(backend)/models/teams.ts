import mongoose, { Schema, Document, Model, Types } from "mongoose";

// TypeScript interfaces
export interface ITeamBase {
  name: string;
  members: { userId: Types.ObjectId; role: "teamlead" | "member" }[];
  projects: string[];
  createdBy: Types.ObjectId;
  status: "pending" | "approved" | "rejected"; // new field for request status
  createdAt: Date;
}

export interface ITeamDocument extends ITeamBase, Document {}

// Member sub-schema
const MemberSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["teamlead", "member"], required: true },
});

// Main Team schema
const TeamSchema: Schema<ITeamDocument> = new Schema({
  name: { type: String, required: true },
  members: { type: [MemberSchema], required: true },
  projects: { type: [String], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // default pending
  createdAt: { type: Date, default: Date.now },
});

// Pre-save validation: exactly one teamlead
TeamSchema.pre<ITeamDocument>("save", function (next) {
  const leadCount = this.members.filter(m => m.role === "teamlead").length;
  if (leadCount !== 1) {
    return next(new Error("A team must have exactly one teamlead."));
  }
  next();
});

// Create Mongoose model
const TeamModel: Model<ITeamDocument> =
  mongoose.models.Team || mongoose.model<ITeamDocument>("Team", TeamSchema);

export default TeamModel;
