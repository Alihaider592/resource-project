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
  approverStatus?: { [key: string]: "approve" | "reject" };
}

interface Props {
  userRole: "teamlead" | "hr" | "user"; 
}

const LeaveApprovalDashboard: React.FC<Props> = ({ userRole }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        // ✅ Without token — simple GET request
        const res = await fetch("/api/user/profile/request/leave");
        const data = await res.json();

        if (res.ok && data.leaves) {
          let filteredLeaves: Leave[] = [];

          if (userRole === "teamlead") {
            filteredLeaves = data.leaves.filter(
              (leave: Leave) =>
                leave.approvers?.teamLead && leave.status === "pending"
            );
          } else if (userRole === "hr") {
            filteredLeaves = data.leaves.filter(
              (leave: Leave) =>
                leave.approvers?.hr && leave.status === "pending"
            );
          } else {
            filteredLeaves = data.leaves;
          }

          setLeaves(filteredLeaves);
        } else {
          console.warn("No leaves found or invalid response.");
          setLeaves([]);
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [userRole]);

  if (loading) return <p className="text-gray-500">Loading leave requests...</p>;

  if (!leaves.length)
    return (
      <div className="text-center text-gray-600 font-medium mt-10">
        No pending leave requests for you.
      </div>
    );

  return (
    <div className="space-y-4 p-4">
      {leaves.map((leave) => (
        <div
          key={leave._id}
          className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition"
        >
          <p className="font-semibold text-gray-800">
            Type: <span className="text-blue-600">{leave.leaveType}</span>
          </p>
          <p>
            <strong>From:</strong>{" "}
            {new Date(leave.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>To:</strong>{" "}
            {new Date(leave.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Reason:</strong> {leave.reason}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Status:{" "}
            <span
              className={`font-semibold ${
                leave.status === "pending"
                  ? "text-yellow-600"
                  : leave.status === "approved"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {leave.status.toUpperCase()}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default LeaveApprovalDashboard;
