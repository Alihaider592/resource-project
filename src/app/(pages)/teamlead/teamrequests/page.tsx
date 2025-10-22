"use client";

import { FiFileText, FiCoffee, FiHome } from "react-icons/fi";
import Link from "next/link";

const requestTypes = [
  { name: "Leaves", icon: <FiFileText size={24} />, href: "/teamlead/leaves" },
  { name: "Work From Home", icon: <FiCoffee size={24} />, href: "/teamlead/teamrequests/wfh" },
  { name: "Home Loan", icon: <FiHome size={24} />, href: "/teamlead/employee-requests/homeloan" },
];

export default function TeamLeadEmployeeRequestsPage() {
  return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Requests</h1>
        <p className="mb-8 text-gray-600">
          Select a request type from the sidebar to view details.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestTypes.map((request) => (
            <Link key={request.name} href={request.href}>
              <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-teal-500">
                <div className="p-3 bg-teal-100 text-teal-700 rounded-full">
                  {request.icon}
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  {request.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
  );
}
