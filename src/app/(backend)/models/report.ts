import mongoose, { Schema, Document, models } from "mongoose";

export interface ITeam extends Document {
  name: string;
  teamLead: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    teamLead: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Team = models.Team || mongoose.model<ITeam>("Team", TeamSchema);
export default Team;
