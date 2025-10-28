"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSend,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

interface Leave {
  _id: string;
  name: string;
  email: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
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
  const [expandedLeaveId, setExpandedLeaveId] = useState<string | null>(null);

  // -------------------- UI Helpers --------------------
  const getStatusClasses = (status: Leave["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: Leave["status"]) => {
    switch (status) {
      case "pending":
        return <FiClock className="w-4 h-4 mr-1" />;
      case "approved":
        return <FiCheckCircle className="w-4 h-4 mr-1" />;
      case "rejected":
        return <FiXCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const handleToggleExpand = (leaveId: string) => {
    setExpandedLeaveId((prev) => (prev === leaveId ? null : leaveId));
  };

  // -------------------- Fetch leaves --------------------
  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in again.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/user/profile/request/leave", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch leaves (${res.status})`);

        const data = await res.json();
        setLeaves(Array.isArray(data.leaves) ? data.leaves : []);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        toast.error("Could not load your leave requests.");
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
      toast.error("Please provide a comment before rejecting.");
      return;
    }

    try {
      setActionLoading(leaveId);
      const token = localStorage.getItem("token");
      const approverName = localStorage.getItem("userName") || "Unknown";

      const res = await fetch("/api/user/profile/request/leave", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveId,
          action,
          comment: comment[leaveId] || "",
          role: userRole,
          approverName, // ✅ Include approverName
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLeaves((prev) =>
          prev.map((l) => (l._id === leaveId ? data.leave : l))
        );
        setComment({ ...comment, [leaveId]: "" });
        setExpandedLeaveId(null);
        toast.success(`Leave request ${action}d successfully!`);
      } else {
        toast.error(data.message || "Failed to update leave.");
      }
    } catch (err) {
      console.error("Error updating leave:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------- Loading / Empty States --------------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <FiClock className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
        <p className="text-gray-600 font-medium">Loading leave requests...</p>
      </div>
    );

  if (!leaves.length)
    return (
      <div className="text-center p-10 mt-10 border border-dashed border-gray-300 rounded-xl bg-white shadow-lg max-w-5xl mx-auto">
        <FiSend className="w-10 h-10 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">No Leaves Found</h3>
        <p className="text-gray-500">You don’t have any leave requests yet.</p>
      </div>
    );

  // -------------------- Main UI --------------------
  return (
    <>
      <Toaster position="top-center" />
      <div className="p-4 sm:p-8 min-h-screen font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-teal-500 pl-4">
          Leave Approval Dashboard
        </h1>

        <div className="max-w-5xl mx-auto overflow-x-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leaves.map((leave, index) => {
                const isExpanded = expandedLeaveId === leave._id;
                const approverDecision = leave.approverStatus?.[userRole];
                const hasActed = !!approverDecision;

                return (
                  <React.Fragment key={leave._id}>
                    <tr
                      className={`transition-all duration-200 cursor-pointer ${
                        isExpanded
                          ? "bg-indigo-50/70"
                          : index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => handleToggleExpand(leave._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {leave.name}
                        </div>
                        <div className="text-xs text-gray-500">{leave.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                        {leave.leaveType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(leave.startDate).toLocaleDateString()} -{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(
                            leave.status
                          )}`}
                        >
                          {getStatusIcon(leave.status)}
                          {leave.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="flex items-center justify-end text-indigo-600 hover:text-indigo-800 transition-colors w-full">
                          {isExpanded ? "Collapse" : "View Details"}
                          {isExpanded ? (
                            <FiChevronUp className="w-5 h-5 ml-1" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 ml-1" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-white border-t border-indigo-200/50 shadow-inner">
                        <td colSpan={5} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="font-bold text-gray-800 mb-1">
                                Reason for Leave:
                              </p>
                              <p className="text-gray-700 italic text-sm">
                                {leave.reason || "No reason provided."}
                              </p>
                            </div>

                            <div className="md:col-span-1 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                              <p className="font-bold text-gray-800 mb-2">
                                Approvers:
                              </p>
                              <div className="space-y-1 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-indigo-800 font-medium">
                                    Team Lead:
                                  </span>
                                  <span className="text-gray-700">
                                    {leave.approvers?.teamLead || "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-indigo-800 font-medium">
                                    HR:
                                  </span>
                                  <span className="text-gray-700">
                                    {leave.approvers?.hr || "N/A"}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {leave.approverComments &&
                              leave.approverComments.length > 0 && (
                                <div className="md:col-span-1 p-4 bg-gray-100 rounded-lg border border-gray-300 max-h-40 overflow-y-auto">
                                  <p className="font-bold text-gray-800 mb-2">
                                    Review History:
                                  </p>
                                  <ul className="space-y-2 text-sm">
                                    {leave.approverComments.map((c, idx) => (
                                      <li
                                        key={idx}
                                        className={`flex items-start ${
                                          c.action === "reject"
                                            ? "text-red-700"
                                            : "text-green-700"
                                        }`}
                                      >
                                        <FiClock className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-gray-500" />
                                        <div className="flex-grow">
                                          <strong className="text-gray-900">
                                            {c.approver}
                                          </strong>{" "}
                                          <span
                                            className={`font-medium ${
                                              c.action === "reject"
                                                ? "text-red-600"
                                                : "text-green-600"
                                            }`}
                                          >
                                            {c.action}d
                                          </span>{" "}
                                          (
                                          {new Date(c.date).toLocaleDateString()}
                                          )
                                          <br />
                                          <span className="italic text-gray-600">
                                            {c.comment || "No comment provided."}
                                          </span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>

                          {userRole !== "user" && leave.status === "pending" && (
                            <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                              <h4 className="text-lg font-bold text-gray-800">
                                Your Action
                              </h4>
                              <textarea
                                placeholder="Add comment (required for rejection)"
                                value={comment[leave._id] || ""}
                                onChange={(e) =>
                                  setComment({
                                    ...comment,
                                    [leave._id]: e.target.value,
                                  })
                                }
                                rows={2}
                                className="w-full border-2 border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-shadow"
                              />
                              <div className="flex gap-4">
                                <button
                                  disabled={actionLoading === leave._id}
                                  onClick={() => handleAction(leave._id, "approve")}
                                  className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-50 transition-all"
                                >
                                  {actionLoading === leave._id ? (
                                    <>
                                      <FiClock className="w-5 h-5 mr-2 animate-spin" /> Processing...
                                    </>
                                  ) : (
                                    <>
                                      <FiCheckCircle className="w-5 h-5 mr-2" /> Approve
                                    </>
                                  )}
                                </button>

                                <button
                                  disabled={
                                    actionLoading === leave._id ||
                                    !comment[leave._id] ||
                                    comment[leave._id].trim() === ""
                                  }
                                  onClick={() => handleAction(leave._id, "reject")}
                                  className="flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                                >
                                  <FiXCircle className="w-5 h-5 mr-2" /> Reject
                                </button>
                              </div>
                            </div>
                          )}

                          {hasActed && (
                            <div
                              className={`mt-4 p-4 rounded-xl text-base font-semibold border-2 ${
                                approverDecision === "approve"
                                  ? "bg-green-50 text-green-700 border-green-300"
                                  : "bg-red-50 text-red-700 border-red-300"
                              }`}
                            >
                              <p>
                                <FiCheckCircle className="inline w-5 h-5 mr-2" />
                                You have already{" "}
                                <strong>{approverDecision}d</strong> this request.
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LeaveApprovalDashboard;
