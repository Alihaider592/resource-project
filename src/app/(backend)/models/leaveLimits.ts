import mongoose from "mongoose";

const LeaveLimitSchema = new mongoose.Schema({
  leaveType: { type: String, required: true },
  maxLeaves: { type: Number, required: true },
});

export default mongoose.models.LeaveLimit || mongoose.model("LeaveLimit", LeaveLimitSchema);
