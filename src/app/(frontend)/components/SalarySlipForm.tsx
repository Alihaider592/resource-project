"use client";

import React, { useState } from "react";
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

export default function SalarySlipForm() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [month, setMonth] = useState("");
  const [basic, setBasic] = useState<number>(0);
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);

  const createSalarySlip = async () => {
    if (!employeeName || !employeeEmail || !month) {
      alert("Please fill all required fields");
      return;
    }

    const res = await fetch("/api/salary-slips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeName, employeeEmail, month, basic, allowances, deductions }),
    });

    if (res.ok) {
      const newSlip = await res.json();
      setSalarySlips([...salarySlips, newSlip]);
      alert("Salary slip created!");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create salary slip");
    }
  };

  const downloadPDF = (slip: SalarySlip) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Salary Slip", 20, 20);
    doc.setFontSize(12);
    doc.text(`Employee: ${slip.employeeName}`, 20, 40);
    doc.text(`Email: ${slip.employeeEmail}`, 20, 50);
    doc.text(`Month: ${slip.month}`, 20, 60);
    doc.text(`Basic: ${slip.basic}`, 20, 70);
    doc.text(`Allowances: ${slip.allowances}`, 20, 80);
    doc.text(`Deductions: ${slip.deductions}`, 20, 90);
    doc.text(`Net Salary: ${slip.netSalary}`, 20, 100);
    doc.save(`${slip.employeeName}_SalarySlip.pdf`);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Salary Slip Generator</h1>

      <input
        placeholder="Employee Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
        className="border p-2 m-1 w-full"
      />
      <input
        placeholder="Employee Email"
        value={employeeEmail}
        onChange={(e) => setEmployeeEmail(e.target.value)}
        className="border p-2 m-1 w-full"
      />
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 m-1 w-full"
      />
      <input
        type="number"
        placeholder="Basic Salary"
        value={basic}
        onChange={(e) => setBasic(Number(e.target.value))}
        className="border p-2 m-1 w-full"
      />
      <input
        type="number"
        placeholder="Allowances"
        value={allowances}
        onChange={(e) => setAllowances(Number(e.target.value))}
        className="border p-2 m-1 w-full"
      />
      <input
        type="number"
        placeholder="Deductions"
        value={deductions}
        onChange={(e) => setDeductions(Number(e.target.value))}
        className="border p-2 m-1 w-full"
      />
      <button
        onClick={createSalarySlip}
        className="bg-blue-500 text-white p-2 m-2 rounded w-full"
      >
        Create Salary Slip
      </button>

      <h2 className="text-lg font-bold mt-4">Generated Slips</h2>
      {salarySlips.map((slip) => (
        <div key={slip.id} className="border p-2 my-2">
          <p>
            {slip.employeeName} - {slip.month} - Net: {slip.netSalary}
          </p>
          <button
            onClick={() => downloadPDF(slip)}
            className="bg-green-500 text-white p-1 rounded mt-1"
          >
            Download PDF
          </button>
        </div>
      ))}
    </div>
  );
}
