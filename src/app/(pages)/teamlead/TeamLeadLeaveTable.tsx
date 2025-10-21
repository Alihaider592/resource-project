"use client";

import { useEffect, useState } from "react";

interface LeaveRequest {
  _id: string;
  userId: string;
  name: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvers?: {
    teamLead?: string | null;
    hr?: string | null;
  };
}

export default function TeamLeadLeaveTable() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch("/api/user/profile/request/leave");
        const data = await res.json();
        if (res.ok && Array.isArray(data.leaves)) {
          const teamLeadLeaves = data.leaves.filter((l: LeaveRequest) => l.approvers?.teamLead);
          setLeaves(teamLeadLeaves);
        }
      } catch (err) {
        console.error("Failed to fetch leaves:", err);
      }
    };
    fetchLeaves();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Employee</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Type</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Start</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">End</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Reason</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-b last:border-none hover:bg-gray-50">
              <td className="px-4 py-2">{leave.name}</td>
              <td className="px-4 py-2">{leave.leaveType}</td>
              <td className="px-4 py-2">{leave.startDate}</td>
              <td className="px-4 py-2">{leave.endDate}</td>
              <td className="px-4 py-2">{leave.reason}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    leave.status === "pending"
                      ? "bg-yellow-500"
                      : leave.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {leave.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
