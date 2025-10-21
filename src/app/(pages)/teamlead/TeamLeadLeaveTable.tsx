"use client";

import React from "react";
import { LeaveRequest } from "./types"; 

interface Props {
  leaves: LeaveRequest[];
}

export default function TeamLeadLeaveTable({ leaves }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse border border-gray-200">
        <thead>
          <tr className="bg-teal-500 text-white ">
            <th className="p-3">Employee Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Leave Type</th>
            <th className="p-3">Start Date</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="hover:bg-gray-50">
              <td className="p-3 ">{leave.name || "N/A"}</td>
              <td className="p-3 ">{leave.email || "N/A"}</td>
              <td className="p-3 ">{leave.leaveType}</td>
              <td className="p-3 ">{leave.startDate}</td>
              <td className="p-3 ">{leave.endDate}</td>
              <td className="p-3 ">{leave.reason}</td>
              <td className="p-3  capitalize">
                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    leave.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : leave.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {leave.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
