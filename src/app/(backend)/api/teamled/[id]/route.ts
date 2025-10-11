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

    const lead = await TeamLead.findById(id).select("-password"); // Exclude sensitive info

    if (!lead) {
      console.warn("⚠️ Team lead not found for ID:", id);
      return NextResponse.json(
        { message: "Team lead not found" },
        { status: 404 }
      );
    }

    console.log("✅ Team lead fetched successfully:", lead.name);
    return NextResponse.json({ success: true, user: lead });
  } catch (error) {
    console.error("❌ Error fetching team lead:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
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

    // Parse JSON body instead of formData for modern API usage
    const body = await request.json();
    console.log("🛠️ Updating fields:", body);

    const lead = await TeamLead.findByIdAndUpdate(id, body, { new: true });

    if (!lead) {
      console.warn("⚠️ Team lead not found while updating:", id);
      return NextResponse.json(
        { message: "Team lead not found" },
        { status: 404 }
      );
    }

    console.log("✅ Team lead updated successfully:", lead.name);
    return NextResponse.json({ success: true, user: lead });
  } catch (error) {
    console.error("❌ Error updating team lead:", error);
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
