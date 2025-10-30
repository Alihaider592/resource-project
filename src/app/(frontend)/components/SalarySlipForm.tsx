"use client";

import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";

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

export default function SalarySlipDashboard() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [month, setMonth] = useState("");
  const [basic, setBasic] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);

  // Net Salary Calculation
  const netSalary = useMemo(() => basic + allowances - deductions, [basic, allowances, deductions]);

  // Create Salary Slip (API call or local state)
  const createSalarySlip = async () => {
    if (!employeeName || !employeeEmail || !month) {
      alert("Please fill all required fields (Name, Email, Month).");
      return;
    }

    const newSlip: SalarySlip = {
      id: Date.now().toString(),
      employeeName,
      employeeEmail,
      month,
      basic,
      allowances,
      deductions,
      netSalary,
    };

    // Save locally (replace with API call in production)
    setSalarySlips([newSlip, ...salarySlips]);

    alert("✅ Salary slip successfully generated!");

    // Clear inputs
    setEmployeeName("");
    setEmployeeEmail("");
    setMonth("");
    setBasic(0);
    setAllowances(0);
    setDeductions(0);
  };

  // Download PDF
  const downloadPDF = (slip: SalarySlip) => {
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138);
    doc.text("Salary Payout Statement", 105, 20, { align: "center" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(30, 58, 138);
    doc.line(20, 25, 190, 25);

    let y = 35;
    // Employee Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Employee Details:", 20, y); y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${slip.employeeName}`, 20, y); y += 8;
    doc.text(`Email: ${slip.employeeEmail}`, 20, y); y += 8;
    doc.text(`Period: ${slip.month}`, 20, y); y += 12;

    // Earnings
    doc.setFont("helvetica", "bold");
    doc.text("Earnings", 20, y);
    doc.text("Amount (USD)", 150, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Basic Salary`, 20, y);
    doc.text(`${slip.basic.toFixed(2)}`, 150, y); y += 7;
    doc.text(`Allowances`, 20, y);
    doc.text(`${slip.allowances.toFixed(2)}`, 150, y); y += 8;

    // Deductions
    doc.setFont("helvetica", "bold");
    doc.text("Deductions", 20, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Total Deductions`, 20, y);
    doc.text(`-${slip.deductions.toFixed(2)}`, 150, y); y += 10;

    doc.setLineWidth(0.8);
    doc.line(20, y, 190, y); y += 5;

    // Net Salary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(22, 163, 74);
    doc.text(`Net Salary (USD):`, 20, y);
    doc.text(`$${slip.netSalary.toFixed(2)}`, 150, y);

    doc.save(`${slip.employeeName}_SalaryStatement_${slip.month}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      {/* Header */}
      <header className="py-4 mb-8 border-b-4 border-indigo-300">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 tracking-wider">
          Global Payroll Dashboard
        </h1>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Salary Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-indigo-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center text-indigo-700">
              Generate Salary Slip
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                placeholder="Employee Full Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-indigo-400 transition"
              />
              <input
                type="email"
                placeholder="Employee Email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-indigo-400 transition"
              />
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="month-input" className="block text-sm font-medium text-gray-600 mb-1">
                  Select Payout Month
                </label>
                <input
                  id="month-input"
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-3 focus:ring-indigo-400 transition"
                />
              </div>
              <input
                type="number"
                placeholder="Basic Salary (USD)"
                value={basic || ""}
                onChange={(e) => setBasic(Number(e.target.value))}
                className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-teal-400 transition"
              />
              <input
                type="number"
                placeholder="Allowances (USD)"
                value={allowances || ""}
                onChange={(e) => setAllowances(Number(e.target.value))}
                className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-teal-400 transition"
              />
              <input
                type="number"
                placeholder="Deductions (USD)"
                value={deductions || ""}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-3 focus:ring-red-400 transition"
              />
              <div className="p-3 bg-indigo-100 border-2 border-indigo-300 rounded-xl font-semibold text-gray-800 flex justify-between items-center shadow-inner">
                <span>Net Payout (USD):</span>
                <span className="text-2xl text-indigo-700 font-extrabold">${netSalary.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={createSalarySlip}
              className="mt-8 w-full bg-indigo-600 text-white font-bold text-lg p-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 tracking-wider"
            >
              Confirm & Record Salary Slip
            </button>
          </div>
        </div>

        {/* Right column: Salary History */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center text-gray-700">
              Payout History
            </h2>
            {salarySlips.length === 0 && <p className="text-gray-500 italic text-center py-6">No payroll statements generated yet.</p>}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {salarySlips.map((slip) => (
                <div key={slip.id} className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col justify-between items-start border-l-4 border-green-500 hover:shadow-md transition">
                  <div className="w-full">
                    <p className="font-bold text-lg text-indigo-800 truncate">{slip.employeeName}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{slip.month}</p>
                    <p className="text-gray-700 font-extrabold mt-2 flex justify-between items-center">
                      <span>NET (USD):</span>
                      <span className="text-green-600 text-xl">${slip.netSalary.toFixed(2)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => downloadPDF(slip)}
                    className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-green-700 transition duration-200 text-sm"
                  >
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
