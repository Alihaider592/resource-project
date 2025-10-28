import mongoose, { Schema, Document, Model } from "mongoose";

// Separate interface for TypeScript
export interface ITeamBase {
  name: string;
  members: { userId: string; role: "teamlead" | "member" }[];
  projects: string[];
  createdBy: string;
  createdAt: Date;
}

// Mongoose document type
export interface ITeamDocument extends ITeamBase, Document {}

const MemberSchema: Schema = new Schema({
  userId: { type: String, required: true },
  role: { type: String, enum: ["teamlead", "member"], required: true },
});

const TeamSchema: Schema<ITeamDocument> = new Schema({
  name: { type: String, required: true },
  members: { type: [MemberSchema], required: true },
  projects: { type: [String], default: [] },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Validate that exactly one teamlead exists
TeamSchema.pre<ITeamDocument>("save", function (next) {
  const leadCount = this.members.filter(m => m.role === "teamlead").length;
  if (leadCount !== 1) {
    return next(new Error("A team must have exactly one teamlead."));
  }
  next();
});

// Create Model
const TeamModel: Model<ITeamDocument> =
  mongoose.models.Team || mongoose.model<ITeamDocument>("Team", TeamSchema);

export default TeamModel;
