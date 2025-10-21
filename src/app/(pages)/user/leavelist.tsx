"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Leave {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };
}

export default function LeaveList() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchLeaves = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/user/profile/request/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch leaves");
      setLeaves(data.leaves);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h3 className="text-xl font-semibold mb-4">My Leave Requests</h3>
      {leaves.length === 0 ? (
        <p className="text-gray-500">No leave requests yet.</p>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <div
              key={leave._id}
              className="flex justify-between items-center border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              <div>
                <p>
                  <span className="font-semibold">Type:</span> {leave.leaveType}
                </p>
                <p>
                  <span className="font-semibold">Dates:</span> {leave.startDate} → {leave.endDate}
                </p>
                <p>
                  <span className="font-semibold">Reason:</span> {leave.reason}
                </p>
                <p>
                  <span className="font-semibold">Approvers:</span>{" "}
                  {leave.approvers.teamLead || "-"}, {leave.approvers.hr || "-"}
                </p>
              </div>
              <div className="flex items-center p-5 mt-5 justify-center">
                <span
                  className={`px-3 py-1 mt-5 rounded-full font-semibold ${
                    leave.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : leave.status === "approved"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {leave.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
