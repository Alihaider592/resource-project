import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "@/app/(backend)/models/User";
import TeamLead, { ITeamLead } from "@/app/(backend)/models/teamlead";
import AddUser, { ISAddUser } from "@/app/(backend)/models/adduser";
import connectDatabase from "@/app/(backend)/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
}

export interface EmployeeData {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  cnic?: string;
  birthday?: string;
  gender?: string;
  maritalStatus?: string;
  address?: string;
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
}

const mapUserToEmployeeData = (
  user: IUser | ITeamLead | ISAddUser
): EmployeeData => {
  if ("employeeId" in user) {
    return {
      employeeId: user.employeeId ?? undefined,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      email: user.email,
      phone: user.phone ?? undefined,
      emergencyContact: user.emergencyContact ?? undefined,
      cnic: user.cnic ?? undefined,
      birthday: user.birthday ?? undefined,
      gender: user.gender ?? undefined,
      maritalStatus: user.maritalStatus ?? undefined,
      address: user.address ?? undefined,
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
    };
  }

  return {
    email: user.email,
    role: user.role,
    avatar: "avatar" in user ? user.avatar ?? null : null,
  };
};

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

    // ✅ Return normalized data under "user" so auth logic works
    return NextResponse.json({ success: true, user: employee });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
