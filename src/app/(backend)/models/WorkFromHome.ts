import mongoose, { Schema, Document, Model } from "mongoose";

export interface Member {
  userId: string; // frontend or Mongo _id as string
  role: "teamlead" | "member";
}

export interface ITeamBase {
  _id: string; // frontend-generated id
  name: string;
  members: Member[];
  projects: string[];
  createdBy: string; // ✅ plain string
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface ITeamDocument extends Omit<ITeamBase, "_id">, Document<string> {
  _id: string;
}

const MemberSchema = new Schema<Member>(
  {
    userId: { type: String, required: true },
    role: { type: String, enum: ["teamlead", "member"], required: true },
  },
  { _id: false }
);

const TeamSchema = new Schema<ITeamDocument>({
  _id: { type: String, required: true }, // frontend-generated
  name: { type: String, required: true },
  members: { type: [MemberSchema], required: true },
  projects: { type: [String], default: [] },
  createdBy: { type: String, required: true }, // ✅ FIXED
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Middleware: ensure exactly one teamlead
TeamSchema.pre<ITeamDocument>("save", function (next) {
  const leadCount = this.members.filter((m) => m.role === "teamlead").length;
  if (leadCount !== 1) {
    return next(new Error("A team must have exactly one teamlead."));
  }
  next();
});

// ✅ Safe model export for Next.js
const Team: Model<ITeamDocument> =
  mongoose.models.Team || mongoose.model<ITeamDocument>("Team", TeamSchema);

export default Team;
