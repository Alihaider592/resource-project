"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiClock, FiCheckCircle, FiXCircle, FiChevronDown, FiChevronUp, FiSend } from "react-icons/fi";

interface Leave {
  _id: string;
  name: string;
  email: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvers?: {
    teamLead?: string | null;
    hr?: string | null;
  };
  approverComments?: {
    approver: string;
    action: "approve" | "reject";
    comment?: string;
    date: string;
  }[];
  createdAt: string;
}

interface Props {
  userRole: "user" | "teamlead" | "hr";
}

const LeaveRequestPage: React.FC<Props> = ({ userRole }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLeaveId, setExpandedLeaveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      if (Array.isArray(data.leaves)) {
        setLeaves(
          data.leaves.sort(
            (a: Leave, b: Leave) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } else setLeaves([]);
    } catch (err) {
      console.error(err);
      toast.error("Could not load leave requests.");
      setLeaves([]);
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleToggleExpand = (leaveId: string) => {
    setExpandedLeaveId((prev) => (prev === leaveId ? null : leaveId));
  };

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

  // Filtering & pagination
  const filteredLeaves = leaves.filter((l) => (filter === "all" ? true : l.status === filter));
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const paginatedLeaves = filteredLeaves.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="p-4 sm:p-8 min-h-screen font-sans">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-teal-500 pl-4">Leave Requests</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === f ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-600">
          <FiClock className="w-6 h-6 animate-spin mr-2 text-indigo-500" />
          Loading leave requests...
        </div>
      ) : paginatedLeaves.length === 0 ? (
        <div className="text-center p-10 mt-10 border border-dashed border-gray-300 rounded-xl bg-white shadow-lg max-w-5xl mx-auto">
          <FiSend className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Leaves Found</h3>
          <p className="text-gray-500">You don’t have any leave requests yet.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto overflow-x-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedLeaves.map((leave, index) => {
                const isExpanded = expandedLeaveId === leave._id;
                return (
                  <React.Fragment key={leave._id}>
                    <tr
                      className={`cursor-pointer transition-all duration-200 ${
                        isExpanded ? "bg-indigo-50/70" : index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => handleToggleExpand(leave._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{leave.name}</div>
                        <div className="text-xs text-gray-500">{leave.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">{leave.leaveType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(leave.status)}`}>
                          {getStatusIcon(leave.status)}
                          {leave.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="flex items-center justify-end text-indigo-600 hover:text-indigo-800 w-full">
                          {isExpanded ? "Collapse" : "View Details"}
                          {isExpanded ? <FiChevronUp className="w-5 h-5 ml-1" /> : <FiChevronDown className="w-5 h-5 ml-1" />}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-white border-t border-indigo-200/50 shadow-inner">
                        <td colSpan={5} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="font-bold text-gray-800 mb-1">Reason for Leave:</p>
                              <p className="text-gray-700 italic text-sm">{leave.reason || "No reason provided."}</p>
                            </div>

                            <div className="md:col-span-1 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                              <p className="font-bold text-gray-800 mb-2">Approvers:</p>
                              <div className="space-y-1 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-indigo-800 font-medium">Team Lead:</span>
                                  <span className="text-gray-700">{leave.approvers?.teamLead || "N/A"}</span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-indigo-800 font-medium">HR:</span>
                                  <span className="text-gray-700">{leave.approvers?.hr || "N/A"}</span>
                                </p>
                              </div>
                            </div>

                            {leave.approverComments?.length ? (
                              <div className="md:col-span-3 p-4 bg-gray-100 rounded-lg border border-gray-300 max-h-40 overflow-y-auto">
                                <p className="font-bold text-gray-800 mb-2">Review History:</p>
                                <ul className="space-y-2 text-sm">
                                  {leave.approverComments.map((c, idx) => (
                                    <li key={idx} className={`flex items-start ${c.action === "reject" ? "text-red-700" : "text-green-700"}`}>
                                      <FiClock className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-gray-500" />
                                      <div className="flex-grow">
                                        <strong className="text-gray-900">{c.approver}</strong>{" "}
                                        <span className={`font-medium ${c.action === "reject" ? "text-red-600" : "text-green-600"}`}>{c.action}d</span> ({formatDate(c.date)})
                                        <br />
                                        <span className="italic text-gray-600">{c.comment || "No comment provided."}</span>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 flex justify-center items-center">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-l bg-gray-200 hover:bg-gray-300">Prev</button>
              <span className="px-4 py-2 border-t border-b">{currentPage}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-r bg-gray-200 hover:bg-gray-300">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveRequestPage;
