// LeaveApprovalDashboard.tsx
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

interface Props {
  userRole: "teamlead" | "hr" | "user"; // Add roles as needed
}

const LeaveApprovalDashboard: React.FC<Props> = ({ userRole }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaves from backend
  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // Don't logout, just skip

        const res = await fetch("/api/user/profile/request/leave", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.leaves) {
          // Filter pending leaves depending on role
          let filteredLeaves: Leave[] = [];
          if (userRole === "teamlead") {
            filteredLeaves = data.leaves.filter(
              (leave: Leave) =>
                leave.approvers.teamLead === data.user?.email && leave.status === "pending"
            );
          } else if (userRole === "hr") {
            filteredLeaves = data.leaves.filter(
              (leave: Leave) =>
                leave.approvers.hr === data.user?.email && leave.status === "pending"
            );
          } else {
            filteredLeaves = data.leaves;
          }

          setLeaves(filteredLeaves);
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [userRole]);

  const handleLeaveAction = async (leaveId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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
        setLeaves((prev) => prev.filter((l) => l._id !== leaveId));
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading leaves...</p>;
  if (!leaves.length) return <p>No pending leaves</p>;

  return (
    <div className="space-y-4">
      {leaves.map((leave) => (
        <div key={leave._id} className="p-4 border rounded shadow-sm">
          <p><strong>Type:</strong> {leave.leaveType}</p>
          <p><strong>From:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
          <p><strong>Reason:</strong> {leave.reason}</p>

          {userRole !== "user" && leave.status === "pending" && (
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleLeaveAction(leave._id, "approve")}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleLeaveAction(leave._id, "reject")}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveApprovalDashboard;
