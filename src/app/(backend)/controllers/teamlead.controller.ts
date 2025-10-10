import { NextResponse } from "next/server";
import TeamLead from "@/models/TeamLead"; // ✅ make sure model name and path are correct

// ✅ Get Team Lead by ID
export async function getTeamLeadByIdController(id: string) {
  try {
    const teamLead = await TeamLead.findById(id);
    if (!teamLead) {
      return NextResponse.json({ message: "Team Lead not found" }, { status: 404 });
    }
    return NextResponse.json(teamLead, { status: 200 });
  } catch (error) {
    console.error("Error fetching team lead:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ Update Team Lead
export async function updateTeamLeadController(id: string, data: Record<string, unknown>) {
  try {
    const updatedTeamLead = await TeamLead.findByIdAndUpdate(id, data, { new: true });
    if (!updatedTeamLead) {
      return NextResponse.json({ message: "Team Lead not found" }, { status: 404 });
    }
    return NextResponse.json(updatedTeamLead, { status: 200 });
  } catch (error) {
    console.error("Error updating team lead:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ Delete Team Lead
export async function deleteTeamLeadController(id: string) {
  try {
    const deleted = await TeamLead.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Team Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Team Lead deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting team lead:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
