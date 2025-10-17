import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDatabase from "@/app/(backend)/lib/db";

import User, { IUser } from "@/app/(backend)/models/User";
import TeamLead, { ITeamLead } from "@/app/(backend)/models/teamlead";
import AddUser, { ISAddUser } from "@/app/(backend)/models/adduser";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */
interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export interface EmployeeData {
  _id?: string;
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  cnic?: string;
  birthday?: string;
  joining?: string;
  leaving?: string;
  joiningDate?: string;
  leavingDate?: string;
  gender?: string;
  maritalStatus?: string;
  address?: string;
  Branch?: string;
  companybranch?: string;
  city?: string;
  state?: string;
  zip?: string;
  department?: string;
  role?: string;
  workType?: string;
  experienceLevel?: string;
  previousCompany?: string;
  experienceYears?: string;
  education?: string;
  bankAccount?: string;
  salary?: string;
  avatar?: string | null;
  timing?: string;
}

/* -------------------------------------------------------------------------- */
/* HELPER: MAP USER TO EMPLOYEE DATA                                          */
/* -------------------------------------------------------------------------- */
const mapUserToEmployeeData = (
  user: IUser | ITeamLead | ISAddUser
): EmployeeData => {
  if ("employeeId" in user) {
    return {
      _id: user._id?.toString(),
      employeeId: user.employeeId ?? undefined,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      email: user.email,
      phone: user.phone ?? undefined,
      emergencyContact: user.emergencyContact ?? undefined,
      cnic: user.cnic ?? undefined,
      birthday: user.birthday ?? undefined,
      joining: user.joining ? user.joining.toISOString() : undefined,
      leaving: user.leaving ? user.leaving.toISOString() : undefined,
      joiningDate: user.joiningDate ?? undefined,
      leavingDate: user.leavingDate ?? undefined,
      gender: user.gender ?? undefined,
      maritalStatus: user.maritalStatus ?? undefined,
      address: user.address ?? undefined,
      Branch: user.Branch ?? undefined,
      companybranch: user.companybranch ?? undefined,
      city: user.city ?? undefined,
      state: user.state ?? undefined,
      zip: user.zip ?? undefined,
      department: user.department ?? undefined,
      role: user.role ?? undefined,
      workType: user.workType ?? undefined,
      experienceLevel: user.experienceLevel ?? undefined,
      previousCompany: user.previousCompany ?? undefined,
      experienceYears:
        user.experienceYears != null ? String(user.experienceYears) : undefined,
      education: user.education ?? undefined,
      bankAccount: user.bankAccount ?? undefined,
      salary: user.salary != null ? String(user.salary) : undefined,
      avatar: user.avatar ?? null,
      timing: user.timing ?? undefined,
    };
  }

  return {
    _id: user._id?.toString(),
    email: user.email,
    role: user.role ?? undefined,
    avatar: "avatar" in user ? user.avatar ?? null : null,
  };
};

/* -------------------------------------------------------------------------- */
/* GET /api/auth/me                                                           */
/* -------------------------------------------------------------------------- */
export async function GET(request: Request) {
  try {
    await connectDatabase();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const user =
      (await User.findById(decoded.id).select("-password -__v")) ||
      (await TeamLead.findById(decoded.id).select("-password -__v")) ||
      (await AddUser.findById(decoded.id).select("-password -__v"));

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const employee: EmployeeData = mapUserToEmployeeData(user);

    // ✅ Normalize role for frontend
    if (employee.role) {
      const role = employee.role.toLowerCase().replace(/\s+/g, "");
      employee.role = role === "user" || role === "simpleuser" ? "simple user" : role;
    }

    return NextResponse.json({ success: true, user: employee });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
