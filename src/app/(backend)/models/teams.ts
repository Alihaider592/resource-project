import mongoose, { Schema, Document, Model, Types } from "mongoose";

// ==========================
// Member Interface
// ==========================
export interface Member {
  userId: Types.ObjectId; // ✅ ObjectId reference to AddUser
  role: "teamlead" | "member";
}

// ==========================
// Team Interfaces
// ==========================
export interface ITeamBase {
  name: string;
  members: Member[];
  projects: string[];
  createdBy: Types.ObjectId; // ✅ Reference to AddUser
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamDocument extends ITeamBase, Document {
  _id: Types.ObjectId;
}

// ==========================
// Member Subschema
// ==========================
const MemberSchema = new Schema<Member>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "AddUser", required: true },
    role: {
      type: String,
      enum: ["teamlead", "member"],
      required: true,
    },
  },
  { _id: false }
);

// ==========================
// Team Schema
// ==========================
const TeamSchema = new Schema<ITeamDocument>(
  {
    name: { type: String, required: true, trim: true },
    members: { type: [MemberSchema], required: true },
    projects: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "AddUser", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // ✅ Auto adds createdAt & updatedAt
  }
);

// ==========================
// Validation Middleware
// ==========================
TeamSchema.pre<ITeamDocument>("save", function (next) {
  const leadCount = this.members.filter((m) => m.role === "teamlead").length;
  if (leadCount !== 1) {
    return next(new Error("A team must have exactly one teamlead."));
  }
  next();
});

// ==========================
// Model Export
// ==========================
const Team: Model<ITeamDocument> =
  mongoose.models.Team || mongoose.model<ITeamDocument>("Team", TeamSchema);

export default Team;
