import mongoose, { Schema, Document, models } from "mongoose";

export interface ITeamLead extends Document {
  name: string;
  email: string;
  password: string;
  role: string; // should always be "teamlead"
  avatar?: string;
  teamName?: string;
  department?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamLeadSchema = new Schema<ITeamLead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "teamlead" },
    avatar: { type: String, default: "" },
    teamName: { type: String, default: "" },
    department: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

const TeamLead = models.TeamLead || mongoose.model<ITeamLead>("TeamLead", TeamLeadSchema);
export default TeamLead;
