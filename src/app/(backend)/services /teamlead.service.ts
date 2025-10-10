import connectDatabase from "@/app/(backend)/lib/db";
import TeamLead from "@/app/(backend)/models/teamlead";
import { TeamLeadUpdatePayload } from "@/app/(backend)/controllers/teamlead.controller";

export async function getTeamLeadByIdService(id: string) {
  await connectDatabase();
  return TeamLead.findById(id).select("-password");
}

export async function updateTeamLeadService(id: string, data: TeamLeadUpdatePayload) {
  await connectDatabase();
  return TeamLead.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-password");
}

export async function deleteTeamLeadService(id: string) {
  await connectDatabase();
  return TeamLead.findByIdAndDelete(id);
}
