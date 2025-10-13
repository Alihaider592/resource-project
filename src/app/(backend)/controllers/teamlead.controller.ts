import { NextResponse } from "next/server";
import TeamLead, { ITeamLead } from "../models/teamlead";

interface UpdateTeamLeadPayload {
  name?: string;
  email?: string;
  avatar?: string;
  phonenumber?: string;
  companyname?: string;
  role?: string;
}

export async function getTeamLeadByIdController(id: string) {
  try {
    const lead = await TeamLead.findById(id);
    if (!lead) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function updateTeamLeadController(
  id: string,
  data: UpdateTeamLeadPayload
) {
  try {
    const lead = await TeamLead.findByIdAndUpdate(id, data, { new: true });
    if (!lead) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function deleteTeamLeadController(id: string) {
  try {
    const lead = await TeamLead.findByIdAndDelete(id);
    if (!lead) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
