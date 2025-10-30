"use client";

import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";

export interface SalarySlip {
  id: string;
  employeeName: string;
  employeeEmail: string;
  payoutDate: string; // YYYY-MM-DD
  basic: number;
  allowances: number;
  deductions: number;
  netSalary: number;
}

interface SalarySlipDashboardProps {
  role: "hr" | "admin";
  employees?: { name: string; email: string }[];
}

const getCurrentDate = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatPayoutDate = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[Number(month) - 1]} ${Number(day)}, ${year}`;
};

export default function SalarySlipDashboard({ role, employees = [] }: SalarySlipDashboardProps) {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [payoutDate, setPayoutDate] = useState(getCurrentDate());
  const [basic, setBasic] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);

  const netSalary = useMemo(() => basic + allowances - deductions, [basic, allowances, deductions]);

  const createSalarySlip = () => {
    if (!employeeName || !employeeEmail) {
      alert("Please fill all required fields.");
      return;
    }
    const slip: SalarySlip = {
      id: Date.now().toString(),
      employeeName,
      employeeEmail,
      payoutDate,
      basic,
      allowances,
      deductions,
      netSalary,
    };
    setSalarySlips([slip, ...salarySlips]);
    alert("✅ Salary slip generated successfully!");
    setEmployeeName("");
    setEmployeeEmail("");
    setPayoutDate(getCurrentDate());
    setBasic(0);
    setAllowances(0);
    setDeductions(0);
  };

  const downloadPDF = (slip: SalarySlip) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138);
    doc.text("Salary Payout Statement", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.setDrawColor(30, 58, 138);
    doc.line(20, 25, 190, 25);

    let y = 35;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Employee Details:", 20, y); y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${slip.employeeName}`, 20, y); y += 8;
    doc.text(`Email: ${slip.employeeEmail}`, 20, y); y += 8;
    doc.text(`Payout Date: ${formatPayoutDate(slip.payoutDate)}`, 20, y); y += 12;

    doc.setFont("helvetica", "bold");
    doc.text("Earnings", 20, y);
    doc.text("Amount (USD)", 150, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Basic Salary`, 20, y); doc.text(`${slip.basic.toFixed(2)}`, 150, y); y += 7;
    doc.text(`Allowances`, 20, y); doc.text(`${slip.allowances.toFixed(2)}`, 150, y); y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Deductions", 20, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Total Deductions`, 20, y); doc.text(`-${slip.deductions.toFixed(2)}`, 150, y); y += 10;

    doc.setLineWidth(0.8);
    doc.line(20, y, 190, y); y += 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74);
    doc.text(`Net Salary (USD):`, 20, y);
    doc.text(`$${slip.netSalary.toFixed(2)}`, 150, y);

    doc.save(`${slip.employeeName}_SalaryStatement_${slip.payoutDate}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      <header className="py-4 mb-8 border-b-4 border-purple-300">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 tracking-wider">
          Global Payroll Dashboard
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-purple-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center text-purple-700">
              Generate Salary Slip
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employees.length > 0 && role === "hr" ? (
                <select
                  className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-purple-400 transition"
                  value={employeeEmail}
                  onChange={(e) => {
                    const emp = employees.find(emp => emp.email === e.target.value);
                    setEmployeeName(emp?.name || "");
                    setEmployeeEmail(emp?.email || "");
                  }}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => <option key={emp.email} value={emp.email}>{emp.name}</option>)}
                </select>
              ) : (
                <input
                  placeholder="Employee Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-purple-400 transition"
                />
              )}
              {employees.length === 0 && (
                <input
                  placeholder="Employee Email"
                  type="email"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-purple-400 transition"
                />
              )}

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Payout Date</label>
                <input type="date" value={payoutDate} disabled className="border-2 border-gray-300 rounded-xl p-3 w-full bg-gray-100 cursor-not-allowed" />
              </div>

              <input type="number" placeholder="Basic Salary (USD)" value={basic || ""} onChange={e => setBasic(Number(e.target.value))} className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-teal-400 transition" />
              <input type="number" placeholder="Allowances (USD)" value={allowances || ""} onChange={e => setAllowances(Number(e.target.value))} className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-teal-400 transition" />
              <input type="number" placeholder="Deductions (USD)" value={deductions || ""} onChange={e => setDeductions(Number(e.target.value))} className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-red-400 transition" />

              <div className="p-3 bg-purple-100 border-2 border-purple-300 rounded-xl font-semibold flex justify-between items-center">
                <span>Net Salary (USD)</span>
                <span className="text-2xl text-purple-700 font-extrabold">${netSalary.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={createSalarySlip} className="mt-8 w-full bg-purple-600 text-white font-bold text-lg p-4 rounded-xl hover:bg-purple-700 transition-all duration-300">
              Confirm & Record Salary Slip
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-700">Payout History</h2>
            {salarySlips.length === 0 && <p className="text-gray-500 italic text-center py-6">No slips yet.</p>}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {salarySlips.map(slip => (
                <div key={slip.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm hover:shadow-md transition">
                  <p className="font-bold text-purple-800">{slip.employeeName}</p>
                  <p className="text-gray-500 text-xs">{formatPayoutDate(slip.payoutDate)}</p>
                  <p className="text-gray-700 font-extrabold flex justify-between mt-2">
                    <span>NET (USD)</span>
                    <span className="text-green-600 text-xl">${slip.netSalary.toFixed(2)}</span>
                  </p>
                  <button onClick={() => downloadPDF(slip)} className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition">
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
