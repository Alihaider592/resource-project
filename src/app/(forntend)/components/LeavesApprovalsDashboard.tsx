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

  // ✅ Fetch pending leaves for HR/Team Lead
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: token missing");

      const res = await fetch("/api/user/profile/request/leave", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch leaves");
      }

      const data = await res.json();
      setLeaves(data.leaves.filter((leave: Leave) => leave.status === "pending"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Fetch leaves error:", error.message);
      } else {
        console.error("❌ Fetch leaves error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ Approve or reject leave
  const handleAction = async (leaveId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: token missing");

      const res = await fetch("/api/user/profile/request/leave", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ leaveId, action }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Leave ${action}d successfully`);
        fetchLeaves();
      } else {
        alert(data.message || "Failed to update leave");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Leave action error:", error.message);
      } else {
        console.error("❌ Leave action error:", error);
      }
    }
  };

  if (loading) return <p>Loading leaves...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Leave Requests</h2>
      {leaves.length === 0 ? (
        <p>No pending leaves</p>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <div key={leave._id} className="p-4 border rounded shadow-sm">
              <p><strong>Type:</strong> {leave.leaveType}</p>
              <p><strong>From:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> {leave.reason}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleAction(leave._id, "approve")}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(leave._id, "reject")}
                  className="px-3 py-1 bg-red-500 text-white rounded"
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
