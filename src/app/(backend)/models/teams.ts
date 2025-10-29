import { Schema, model, models, Types } from "mongoose";

// -------------------------
// Interfaces
// -------------------------
export interface Member {
  userId: Types.ObjectId; // Use Types.ObjectId for MongoDB references
  role: "teamlead" | "member";
}

export interface ITeam {
  name: string;
  members: Member[];
  projects: string[];
  createdBy: Types.ObjectId; // Use ObjectId
  createdAt?: Date;
  updatedAt?: Date;
}

// -------------------------
// Schemas
// -------------------------
const MemberSchema = new Schema<Member>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["teamlead", "member"], required: true },
  },
  { _id: false } // No separate _id for members
);

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    members: { type: [MemberSchema], required: true },
    projects: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// -------------------------
// Model
// -------------------------
const Team = models.Team || model<ITeam>("Team", TeamSchema);

export default Team;
