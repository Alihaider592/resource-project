// src/app/(backend)/api/admin/adduser/route.ts
import { NextResponse } from "next/server";
import { handleNewUserRequest } from "@/app/(backend)/controllers/admin.controller";
import connectDB from "@/app/(backend)/lib/db";

export const config = {
  api: {
    bodyParser: false, // Required to handle FormData
  },
};

export async function POST(req: Request) {
  try {
    // ✅ Connect to MongoDB
    await connectDB();

    // ✅ Parse incoming FormData (works with App Router)
    const formData = await req.formData();

    // Prepare fields object
    const fields: Record<string, string> = {};
    let avatarPath: string | undefined;

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Save file logic here if needed, or just store name/path
        if (key === "avatar") {
          avatarPath = value.name; // or save the file and get path
        }
      } else {
        fields[key] = value.toString();
      }
    }

    // Build payload to match NewUserRequest interface
    const payload = {
      firstName: fields.firstName ?? "",
      lastName: fields.lastName ?? "",
      email: fields.email ?? "",
      password: fields.password ?? "",
      phone: fields.phone ?? "",
      emergencyContact: fields.emergencyContact ?? "",
      cnic: fields.cnic ?? "",
      birthday: fields.birthday ?? "",
      gender: fields.gender ?? "",
      maritalStatus: fields.maritalStatus ?? "",
      bloodGroup: fields.bloodGroup ?? "",
      address: fields.address ?? "",
      city: fields.city ?? "",
      state: fields.state ?? "",
      zip: fields.zip ?? "",
      department: fields.department ?? "",
      role: (fields.role as "Admin" | "HR" | "simple user" | "TeamLead") ?? "simple user",
      workType: (fields.workType as "On-site" | "Remote" | "Hybrid") ?? "On-site",
      experienceLevel: (fields.experienceLevel as "Fresher" | "Experienced") ?? "Fresher",
      previousCompany: fields.previousCompany ?? "",
      experienceYears: fields.experienceYears?.toString() || "0",
      joiningDate: fields.joiningDate ?? "",
      leavingDate: fields.leavingDate ?? "",
      Branch: fields.Branch ?? "",
      education: fields.education ?? "",
      bankAccount: fields.bankAccount ?? "",
      salary: fields.salary?.toString() || "0",
      joining: fields.joining ?? "",
      leaving: fields.leaving ?? "",
      companybranch: fields.companybranch ?? "",
      timing: fields.timing ?? "",
      avatar: avatarPath, // optional
    };

    // ✅ Save user
    const result = await handleNewUserRequest(payload);

    return NextResponse.json(
      { success: true, message: "User created successfully", data: result },
      { status: 201 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("❌ AddUser Route Error:", error.message);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ------------------------- GET (Method Not Allowed) ------------------------- */
export function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 }
  );
}
