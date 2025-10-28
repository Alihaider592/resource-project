"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiSend,
} from "react-icons/fi";

interface ApproverComment {
  approver: string;
  action: "approve" | "reject";
  comment?: string;
  date: string;
}

interface WFHRequest {
  _id: string;
  name: string;
  email: string;
  date: string;
  workType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  approverComments?: ApproverComment[];
}

interface WorkFromHomeListProps {
  user: { name: string; email: string; role: "user" | "teamlead" | "hr" };
  refreshKey?: number;
}

export default function MyWFHRequests({ user, refreshKey }: WorkFromHomeListProps) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/profile/request/wfh/get?email=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Filter only the logged-in user's requests
      const myRequests = (data.requests || []).filter((req: WFHRequest) => req.email === user.email);
      setRequests(myRequests);
    } catch (err) {
      console.error("❌ Failed to load WFH requests:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refreshKey]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setExpandedId(null);
      setCurrentPage(page);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <FiClock className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
        <p className="text-gray-600 font-medium">Loading WFH requests...</p>
      </div>
    );

  <div className="p-4 sm:p-8 min-h-screen font-sans max-w-7xl mx-auto">
  {/* Header with filter buttons */}
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
    <h2 className="text-2xl font-bold flex items-center gap-2">
      <FiUsers />{" "}
      {filter === "all"
        ? "All Work From Home Requests"
        : filter === "pending"
        ? "Pending Requests"
        : filter === "approved"
        ? "Approved Requests"
        : "Rejected Requests"}
    </h2>

    {/* Filter buttons */}
    <div className="mt-4 sm:mt-0 flex space-x-2">
      {(["all", "pending", "approved", "rejected"] as const).map((status) => (
        <button
          key={status}
          onClick={() => {
            setFilter(status);
            setCurrentPage(1);
          }}
          className={`px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300
            ${
              filter === status
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {status === "all"
            ? "All Requests"
            : status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  </div>
</div>


  return (
    <>
      <Toaster position="top-center" />
      <div className="p-4 sm:p-8 min-h-screen font-sans max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiUsers /> My Work From Home Requests
          </h2>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <FiFilter className="text-gray-600" />
            <div className="flex space-x-2">
  {(["all", "pending", "approved", "rejected"] as const).map((status) => (
    <button
      key={status}
      onClick={() => {
        setFilter(status);
        setCurrentPage(1);
      }}
      className={`px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300
        ${
          filter === status
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      {status === "all"
        ? "All Requests"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  ))}
</div>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Work Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedRequests.map((req) => {
                const isExpanded = expandedId === req._id;
                const latestReject = req.approverComments?.slice().reverse().find((c) => c.action === "reject");

                return (
                  <React.Fragment key={req._id}>
                    <tr
                      className={`cursor-pointer transition-all duration-200 ${isExpanded ? "bg-indigo-50/70" : "hover:bg-gray-50"}`}
                      onClick={() => setExpandedId(isExpanded ? null : req._id)}
                    >
                      <td className="px-6 py-4 text-indigo-600 font-medium">{req.workType}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" /> {req.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(req.status)}`}>
                          {req.status === "pending" && <FiClock className="w-4 h-4 mr-1" />}
                          {req.status === "approved" && <FiCheckCircle className="w-4 h-4 mr-1" />}
                          {req.status === "rejected" && <FiXCircle className="w-4 h-4 mr-1" />}
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 flex items-center justify-end w-full">
                          {isExpanded ? "Collapse" : "View Details"}
                          {isExpanded ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="p-6 space-y-3">
                          <p className="font-bold text-gray-800">Reason:</p>
                          <p className="text-gray-700 italic">{req.reason}</p>

                          {req.status === "rejected" && latestReject && (
                            <div className="bg-red-50 border border-red-300 rounded-xl p-3">
                              <p className="text-red-700 font-bold">Rejection Reason:</p>
                              <p className="text-red-600 italic">{latestReject.comment || "No reason provided"}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Rejected by <strong>{latestReject.approver}</strong> on {new Date(latestReject.date).toLocaleString()}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600 disabled:opacity-50"
              >
                <FiChevronLeft className="mr-1" /> Previous
              </button>
              <span className="text-gray-700 text-sm">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600 disabled:opacity-50"
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
