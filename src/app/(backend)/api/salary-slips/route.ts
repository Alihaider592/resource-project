import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Salary slip type definition
interface SalarySlip {
  id: string;
  employeeName: string;
  employeeEmail: string;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

// In-memory storage (replace with database in production)
const salarySlips: SalarySlip[] = [];

// GET all salary slips
export async function GET() {
  return NextResponse.json(salarySlips);
}

// POST a new salary slip
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate input
    if (
      !data.employeeName ||
      !data.employeeEmail ||
      !data.month ||
      typeof data.basic !== "number" ||
      typeof data.allowances !== "number" ||
      typeof data.deductions !== "number"
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newSlip: SalarySlip = {
      id: uuidv4(),
      employeeName: data.employeeName,
      employeeEmail: data.employeeEmail,
      month: data.month,
      basic: data.basic,
      allowances: data.allowances,
      deductions: data.deductions,
      netSalary: data.basic + data.allowances - data.deductions,
    };

    salarySlips.push(newSlip);
    return NextResponse.json(newSlip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
