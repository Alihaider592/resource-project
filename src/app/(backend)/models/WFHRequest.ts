import mongoose, { Schema, model, Document } from "mongoose";

export interface IWfhRequest extends Document {
  userId: string;
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const WfhRequestSchema = new Schema<IWfhRequest>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "pending" },
}, { timestamps: true });

const WFHRequest = mongoose.models.WFHRequest || model<IWfhRequest>("WFHRequest", WfhRequestSchema);

export default WFHRequest;
