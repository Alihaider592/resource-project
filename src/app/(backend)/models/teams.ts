import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  members: { userId: string; role: "teamlead" | "member" }[];
  projects: string[];
  createdBy: string; 
  createdAt: Date;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  members: [
    {
      userId: { type: String, required: true },
      role: { type: String, enum: ["teamlead", "member"], required: true },
    },
  ],
  projects: [{ type: String }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
