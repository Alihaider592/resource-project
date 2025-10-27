"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiCalendar,
  FiRefreshCcw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface WFHRequest {
  _id: string;
  name: string;
  email: string;
  date: string;
  workType: string;
  reason: string;
  role: "user" | "teamlead" | "hr";
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

interface WorkFromHomeListProps {
  user: { name: string; email: string; role: "user" | "teamlead" | "hr" };
}

export default function WorkFromHomeList({ user }: WorkFromHomeListProps) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // number of requests per page
  const totalPages = Math.ceil(requests.length / pageSize);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/user/profile/request/wfh/get?email=${user.email}&role=${user.role}`
      );
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      setRequests(data.requests || []);
    } catch (error) {
      console.error("❌ Failed to load WFH requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (user.role === "user") {
      toast.error("You are not authorized to perform this action.");
      return;
    }

    try {
      const res = await fetch(`/api/user/profile/request/wfh/action/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, approver: user.email }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Request ${action}d successfully`);
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Action error:", error);
      toast.error("Something went wrong while updating the request");
    }
  };

  // Pagination helpers
  const paginatedRequests = requests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const nextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  if (!requests || requests.length === 0)
    return <p className="text-center text-gray-500 mt-10">No requests found</p>;

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiUsers /> Work From Home Requests
        </h2>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
        >
          <FiRefreshCcw /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Work Type</th>
              <th className="p-2 border-b">Reason</th>
              <th className="p-2 border-b text-center">Status</th>
              {(user.role === "teamlead" || user.role === "hr") && (
                <th className="p-2 border-b text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedRequests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{req.name}</td>
                <td className="p-2 border-b">{req.email}</td>
                <td className="p-2 border-b flex items-center gap-2">
                  <FiCalendar /> {req.date}
                </td>
                <td className="p-2 border-b">{req.workType}</td>
                <td className="p-2 border-b">{req.reason}</td>
                <td className="p-2 border-b text-center">
                  {req.status === "pending" && (
                    <span className="text-yellow-500 flex justify-center items-center gap-1">
                      <FiClock /> Pending
                    </span>
                  )}
                  {req.status === "approved" && (
                    <span className="text-green-600 flex justify-center items-center gap-1">
                      <FiCheckCircle /> Approved
                    </span>
                  )}
                  {req.status === "rejected" && (
                    <span className="text-red-600 flex justify-center items-center gap-1">
                      <FiXCircle /> Rejected
                    </span>
                  )}
                </td>
                {(user.role === "teamlead" || user.role === "hr") && (
                  <td className="p-2 border-b text-center">
                    {req.status === "pending" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleAction(req._id, "approve")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "reject")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No actions</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft />
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
