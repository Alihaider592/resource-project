"use client";

import React, { useEffect, useState } from "react";

interface Leave {
  _id: string;
  userId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvers: {
    teamLead?: string;
    hr?: string;
  };
  approverStatus: { [key: string]: "approve" | "reject" };
}

const LeaveApprovalDashboard = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: token missing");

      const res = await fetch("/api/user/profile/request/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch leaves");
      }

      const data = await res.json();
      setLeaves(data.leaves.filter((leave: Leave) => leave.status === "pending"));
    } catch (error: unknown) {
      if (error instanceof Error) console.error("❌ Fetch leaves error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (leaveId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: token missing");

      const res = await fetch("/api/user/profile/request/leave", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leaveId, action }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchLeaves();
      } else {
        alert(data.message || "Failed to update leave");
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error("❌ Leave action error:", error.message);
    }
  };

  if (loading) return <p className="text-gray-500 text-center mt-4">Loading leaves...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Leave Requests</h2>

      {leaves.length === 0 ? (
        <p className="text-gray-600">No pending leaves</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaves.map((leave) => (
            <div
              key={leave._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">{leave.leaveType}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-1">
                <span className="font-medium">From:</span>{" "}
                {new Date(leave.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-medium">To:</span>{" "}
                {new Date(leave.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm mb-3">
                <span className="font-medium">Reason:</span> {leave.reason}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(leave._id, "approve")}
                  className="flex-1 px-3 py-1 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(leave._id, "reject")}
                  className="flex-1 px-3 py-1 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalDashboard;
