import { NextResponse } from "next/server";
import connectToDatabase from "@/app/(backend)/lib/db";
import TeamLead from "@/app/(backend)/models/teamlead";

// ✅ GET /api/teamlead/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("📥 Incoming GET request for TeamLead ID:", id);

  try {
    await connectToDatabase();
    const lead = await TeamLead.findById(id);

    if (!lead) {
      console.warn("⚠️ Team lead not found for ID:", id);
      return NextResponse.json({ message: "Team lead not found" }, { status: 404 });
    }

    console.log("✅ Team lead fetched successfully:", lead.name);
    return NextResponse.json(lead);
  } catch (error) {
    console.error("❌ Error fetching team lead:", error);
    return NextResponse.json({ message: "Server error", error: String(error) }, { status: 500 });
  }
}

// ✅ PUT /api/teamlead/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("📥 Incoming PUT request for TeamLead ID:", id);

  try {
    await connectToDatabase();

    const formData = await request.formData();
    const updateData: Record<string, string> = {};

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        updateData[key] = value;
      }
    });

    console.log("🛠️ Updating fields:", updateData);

    const lead = await TeamLead.findByIdAndUpdate(id, updateData, { new: true });

    if (!lead) {
      console.warn("⚠️ Team lead not found while updating:", id);
      return NextResponse.json({ message: "Team lead not found" }, { status: 404 });
    }

    console.log("✅ Team lead updated successfully:", lead.name);
    return NextResponse.json(lead);
  } catch (error) {
    console.error("❌ Error updating team lead:", error);
    return NextResponse.json({ message: "Server error", error: String(error) }, { status: 500 });
  }
}
