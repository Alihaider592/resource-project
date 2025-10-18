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
  avatar?: string;
  timing?: string;
}

/* -------------------------------------------------------------------------- */
/* HELPER: MAP USER TO EMPLOYEE DATA                                          */
/* -------------------------------------------------------------------------- */
const mapUserToEmployeeData = (
  user: IUser | ITeamLead | ISAddUser
): EmployeeData => {
  const avatarValue = "avatar" in user && user.avatar ? user.avatar : "";

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
      avatar: avatarValue,
      timing: user.timing ?? undefined,
    };
  }

  return {
    _id: user._id?.toString(),
    email: user.email,
    role: user.role ?? undefined,
    avatar: avatarValue,
  };
};

/* -------------------------------------------------------------------------- */
/* HELPER: NORMALIZE ROLE                                                     */
/* -------------------------------------------------------------------------- */
function normalizeRole(role?: string) {
  if (!role) return role;
  const r = role.toLowerCase().replace(/\s+/g, "");
  switch (r) {
    case "user":
    case "simpleuser":
      return "simple user";
    case "hr":
      return "HR";
    case "teamlead":
    case "teamlead":
      return "Team Lead";
    case "admin":
      return "Admin";
    default:
      return role;
  }
}

/* -------------------------------------------------------------------------- */
/* TYPE-SAFE FIELD UPDATE HELPER                                              */
/* -------------------------------------------------------------------------- */
function updateUserFields<T extends IUser | ITeamLead | ISAddUser>(
  user: T,
  data: Partial<EmployeeData>,
  allowedFields: (keyof EmployeeData)[]
): void {
  allowedFields.forEach((field) => {
    const value = data[field];
    if (value === undefined) return;

    if (field === "avatar") {
      (user as unknown as Record<string, string | undefined>)[field] = String(value);
    } else if (field === "experienceYears" || field === "salary") {
      (user as unknown as Record<string, string | undefined>)[field] =
        value != null ? String(value) : undefined;
    } else if (
      field === "joining" ||
      field === "leaving" ||
      field === "joiningDate" ||
      field === "leavingDate"
    ) {
      const dateValue = new Date(String(value));
      if (!isNaN(dateValue.getTime())) {
        (user as unknown as Record<string, Date | undefined>)[field] = dateValue;
      }
    } else {
      (user as unknown as Record<string, unknown>)[field] = value;
    }
  });
}

/* -------------------------------------------------------------------------- */
/* GET /api/auth/me                                                           */
/* -------------------------------------------------------------------------- */
export async function GET(request: Request) {
  try {
    await connectDatabase();

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
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
    if (employee.role) employee.role = normalizeRole(employee.role);

    return NextResponse.json({ success: true, user: employee });
  } catch (error: unknown) {
    console.error("Auth GET error:", (error as Error).message, error);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}

/* -------------------------------------------------------------------------- */
/* PUT /api/auth/me (update profile)                                          */
/* -------------------------------------------------------------------------- */
export async function PUT(request: Request) {
  try {
    await connectDatabase();

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    const body: Partial<EmployeeData> = await request.json();

    const user =
      (await User.findById(decoded.id)) ||
      (await TeamLead.findById(decoded.id)) ||
      (await AddUser.findById(decoded.id));

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Require employeeId for AddUser
    if ("employeeId" in user) {
      if (!user.employeeId && !body.employeeId) {
        return NextResponse.json(
          { message: "`employeeId` is required for this user" },
          { status: 400 }
        );
      }
      if (body.employeeId) user.employeeId = body.employeeId;
    }

    // Allowed fields to update (including dates handled in updateUserFields)
    const allowedFields: (keyof EmployeeData)[] = [
      "firstName",
      "lastName",
      "phone",
      "emergencyContact",
      "cnic",
      "birthday",
      "joining",
      "leaving",
      "joiningDate",
      "leavingDate",
      "gender",
      "maritalStatus",
      "address",
      "Branch",
      "companybranch",
      "city",
      "state",
      "zip",
      "department",
      "role",
      "workType",
      "experienceLevel",
      "previousCompany",
      "experienceYears",
      "education",
      "bankAccount",
      "salary",
      "avatar",
      "timing",
    ];

    updateUserFields(user, body, allowedFields);

    // Normalize role after update
    if ("role" in body && body.role) {
      (user as unknown as Record<string, string | undefined>).role = normalizeRole(body.role);
    }

    await user.save();

    const employee: EmployeeData = mapUserToEmployeeData(user);
    if (employee.role) employee.role = normalizeRole(employee.role);

    return NextResponse.json({ success: true, user: employee });
  } catch (error: unknown) {
    console.error("Auth PUT error:", (error as Error).message, error);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
