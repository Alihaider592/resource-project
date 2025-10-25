"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LeaveRow, Leave } from "./LeaveRow";
import { LeaveForm } from "./form/leaveform";
import { Pagination } from "./Pagination";

interface LeaveSystemProps {
  userRole: "user" | "teamlead" | "hr";
}

export default function LeaveRequestPage({ userRole }: LeaveSystemProps) {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const storedName = typeof window !== "undefined" ? localStorage.getItem("userName") : "";
  const storedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : "";

  // 🟢 Fetch only logged-in user's leaves (token-based)
  const fetchLeaves = useCallback(async () => {
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/profile/request/leave", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch leaves");

      // ✅ backend already returns only user's leaves (no email filtering required)
      const sorted = Array.isArray(data.leaves)
        ? data.leaves.sort(
            (a: Leave, b: Leave) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [];

      setLeaves(sorted);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  }, [token]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // 🟡 Filtering logic
  const allFilteredLeaves = leaves.filter((l) =>
    filter === "all" ? true : l.status === filter
  );

  const totalPages = Math.ceil(allFilteredLeaves.length / itemsPerPage);
  const paginatedLeaves = allFilteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-indigo-200/50">
        <h2 className="text-3xl font-extrabold text-gray-900">My Leaves</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition"
        >
          + Request New Leave
        </button>
      </div>

      {/* Leave Table */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-200 mt-4 overflow-hidden">
        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <h3 className="text-xl font-bold text-gray-700">
            Leave History ({allFilteredLeaves.length})
          </h3>
          <div className="flex space-x-2">
            {(["all", "pending", "approved", "rejected"] as const).map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  setFilter(btn);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  filter === btn
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {btn.charAt(0).toUpperCase() + btn.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">
              Loading leave requests...
            </div>
          ) : paginatedLeaves.length > 0 ? (
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/70 text-gray-600 uppercase text-xs tracking-wider">
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Email</th>
                  <th className="px-4 py-3 font-bold">Type</th>
                  <th className="px-4 py-3 font-bold">Dates</th>
                  <th className="px-4 py-3 font-bold">Reason</th>
                  <th className="px-4 py-3 font-bold">Approvers</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.map((l) => (
                  <LeaveRow key={l._id} leave={l} formatDate={formatDate} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {filter === "all"
                ? "No leave requests found."
                : `No ${filter} requests to display.`}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={allFilteredLeaves.length}
          />
        )}
      </section>

      {/* Slide-in Leave Form */}
      {showForm && token && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          {/* Drawer */}
          <div className="ml-auto w-full max-w-xl h-full flex flex-col bg-white shadow-2xl rounded-l-2xl animate-slideInRight z-50">
            <LeaveForm
              initialData={{
                name: storedName || "",
                email: storedEmail || "",
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
              }}
              token={token}
              onClose={() => setShowForm(false)}
              onSubmitSuccess={() => {
                setShowForm(false);
                fetchLeaves();
              }}
            />
          </div>
        </div>
      )}

      {/* Slide-in animation */}
      <style jsx>{`
        .animate-slideInRight {
          transform: translateX(100%);
          opacity: 0;
          animation: slideInRight 0.4s forwards cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideInRight {
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
