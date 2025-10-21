"use client";

import React, { useEffect, useState } from "react";

interface Leave {
  _id: string;
  name: string;
  email: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvers: {
    teamLead?: string | null;
    hr?: string | null;
  };
  approverStatus?: { [key: string]: "approve" | "reject" };
  approverComments?: {
    approver: string;
    action: "approve" | "reject";
    comment?: string;
    date: string;
  }[];
}

interface Props {
  userRole: "teamlead" | "hr" | "user";
}

const LeaveApprovalDashboard: React.FC<Props> = ({ userRole }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [comment, setComment] = useState<{ [key: string]: string }>({});

  // -------------------- Fetch leaves via REST --------------------
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch("/api/user/profile/request/leave");

        if (!res.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await res.json();

        if (res.ok && Array.isArray(data.leaves)) {
          setLeaves(data.leaves);
        } else {
          setLeaves([]);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // -------------------- Handle approve/reject --------------------
  const handleAction = async (leaveId: string, action: "approve" | "reject") => {
    if (action === "reject" && (!comment[leaveId] || comment[leaveId].trim() === "")) {
      alert("Please provide a comment before rejecting.");
      return;
    }

    try {
      setActionLoading(leaveId);

      const approverName =
        localStorage.getItem("userName") || (userRole === "hr" ? "HR" : "Team Lead");

      const res = await fetch("/api/user/profile/request/leave", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveId,
          action,
          approverName,
          role: userRole,
          comment: comment[leaveId] || "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLeaves((prev) =>
          prev.map((l) => (l._id === leaveId ? data.leave : l))
        );
        setComment({ ...comment, [leaveId]: "" });
      } else {
        alert(data.message || "Failed to update leave.");
      }
    } catch (err) {
      console.error("Error updating leave:", err);
      alert("Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading)
    return <p className="text-gray-500 animate-pulse">Loading leave requests...</p>;

  if (!leaves.length)
    return (
      <div className="text-center text-gray-600 font-medium mt-10">
        No leave requests found.
      </div>
    );

  return (
    <div className="space-y-6 p-4">
      {leaves.map((leave) => {
        const approverDecision = leave.approverStatus?.[userRole];
        const hasActed = !!approverDecision;

        return (
          <div
            key={leave._id}
            className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {leave.name} ({leave.email})
                </h3>
                <p className="text-sm text-gray-600">
                  {leave.leaveType} | {new Date(leave.startDate).toLocaleDateString()} →{" "}
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  leave.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : leave.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {leave.status.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-700 mb-3">
              <strong>Reason:</strong> {leave.reason}
            </p>

            {/* Approvers info */}
            <div className="flex flex-wrap gap-3 text-sm mb-3">
              <span className="bg-gray-100 px-3 py-1 rounded-lg">
                👨‍💼 Team Lead:{" "}
                {leave.approvers?.teamLead || <span className="text-gray-400">N/A</span>}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-lg">
                🧑‍💼 HR:{" "}
                {leave.approvers?.hr || <span className="text-gray-400">N/A</span>}
              </span>
            </div>

            {/* Comments list */}
            {leave.approverComments && leave.approverComments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm">
                <p className="font-medium text-gray-700 mb-1">Previous Actions:</p>
                <ul className="space-y-1">
                  {leave.approverComments.map((c, idx) => (
                    <li key={idx} className="text-gray-600">
                      <strong>{c.approver}</strong> {c.action}d —{" "}
                      {c.comment || "No comment"} (
                      {new Date(c.date).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action section */}
            {userRole !== "user" && !hasActed && leave.status === "pending" && (
              <div className="mt-4 space-y-3">
                <textarea
                  placeholder="Add comment (required for reject)"
                  value={comment[leave._id] || ""}
                  onChange={(e) =>
                    setComment({ ...comment, [leave._id]: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    disabled={actionLoading === leave._id}
                    onClick={() => handleAction(leave._id, "approve")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading === leave._id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    disabled={
                      actionLoading === leave._id ||
                      !comment[leave._id] ||
                      comment[leave._id].trim() === ""
                    }
                    onClick={() => handleAction(leave._id, "reject")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {/* If already acted */}
            {hasActed && (
              <p className="mt-3 text-sm text-gray-500 italic">
                You already {approverDecision}d this request.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LeaveApprovalDashboard;
