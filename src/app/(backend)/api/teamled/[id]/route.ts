import { NextResponse } from "next/server";
import connectdatabase from "@/app/(backend)/lib/db";
import TeamLead from "@/app/(backend)/models/teamlead";

// ✅ GET /api/teamlead/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectdatabase();
  const { id } = params;

  try {
    const lead = await TeamLead.findById(id);
    if (!lead)
      return NextResponse.json({ message: "Team lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error fetching team lead:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ PUT /api/teamlead/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectdatabase();
  const { id } = params;
  const formData = await request.formData();

  const updateData: Record<string, string> = {};
  formData.forEach((value, key) => {
    updateData[key] = value.toString();
  });

  try {
    const lead = await TeamLead.findByIdAndUpdate(id, updateData, { new: true });
    if (!lead)
      return NextResponse.json({ message: "Team lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating team lead:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
