import { NextResponse, NextRequest } from "next/server";
import { handleNewUserRequest } from "@/app/(backend)/controllers/admin.controller";

// Mock file upload (replace later with actual upload logic)
async function uploadFileAndGetUrl(file: File): Promise<string> {
  console.log(`📤 Uploading avatar: ${file.name}`);
  return `https://cdn.example.com/uploads/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 🖼️ Optional avatar upload
    const avatarFile = formData.get("avatar") as File | null;
    let avatarUrl: string | undefined;
    if (avatarFile && avatarFile.size > 0) {
      avatarUrl = await uploadFileAndGetUrl(avatarFile);
    }

    // 🧾 Extract main fields
    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const role = formData.get("role")?.toString() || "User";

    // Combine name
    const fullName = `${firstName} ${lastName}`.trim();

    // 🧩 Build full employee data payload
    const employeeData = {
      // Account Info
      name: fullName,
      email,
      password,
      role,
      avatar: avatarUrl,

      // Employee Info
      employeeId: formData.get("employeeId")?.toString() || "",
      cnic: formData.get("cnic")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      emergencyContact: formData.get("emergencyContact")?.toString() || "",
      birthday: formData.get("birthday")?.toString() || "",
      gender: formData.get("gender")?.toString() || "",
      maritalStatus: formData.get("maritalStatus")?.toString() || "",
      bloodGroup: formData.get("bloodGroup")?.toString() || "",

      // Address
      address: formData.get("address")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      state: formData.get("state")?.toString() || "",
      zip: formData.get("zip")?.toString() || "",

      // Professional
      department: formData.get("department")?.toString() || "",
      workType: formData.get("workType")?.toString() || "On-site",
      experienceLevel: formData.get("experienceLevel")?.toString() || "",
      previousCompany: formData.get("previousCompany")?.toString() || "",
      experienceYears: formData.get("experienceYears")?.toString() || "",

      // Education & Finance
      education: formData.get("education")?.toString() || "",
      bankAccount: formData.get("bankAccount")?.toString() || "",
      salary: formData.get("salary")?.toString() || "",
    };

    // 🔍 Basic validation
    if (!firstName || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields: firstName, email, or password" },
        { status: 400 }
      );
    }

    // 💾 Save user to DB via controller
    const newEmployee = await handleNewUserRequest(employeeData);

    return NextResponse.json(
      { message: "✅ Employee created successfully", employee: newEmployee },
      { status: 201 }
    );

  } catch (error: unknown) {
    const isErrorWithMessage = (err: unknown): err is { message: string } =>
      typeof err === "object" && err !== null && "message" in err;

    const errorMessage = isErrorWithMessage(error)
      ? error.message
      : "An unknown error occurred.";

    console.error("❌ Route Handler Error:", errorMessage);

    let statusCode = 500;
    if (errorMessage.includes("Missing") || errorMessage.includes("Invalid")) statusCode = 400;
    else if (errorMessage.includes("already registered")) statusCode = 409;

    return NextResponse.json(
      { message: "Operation Failed", error: errorMessage },
      { status: statusCode }
    );
  }
}
