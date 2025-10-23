"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "@/app/(frontend)/components/Pagination";

// ===================================
// INTERFACES
// ===================================
interface LeaveFormData {
  name: string;
  email: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

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
  createdAt: string;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

// ===================================
// MAIN COMPONENT
// ===================================
export default function LeaveRequestPage() {
  const [formData, setFormData] = useState<LeaveFormData>({
    name: "",
    email: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ===================================
  // FETCH LEAVES
  // ===================================
  const fetchLeaves = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile/request/leave", {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch leaves");

      const sortedLeaves = Array.isArray(data.leaves)
        ? data.leaves.sort(
            (a: Leave, b: Leave) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [];

      setLeaves(sortedLeaves);
      setCurrentPage(1); // Reset page on fetch
    } catch (err) {
      console.error(err);
      if (err instanceof Error) toast.error(err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchLeaves();

    // Autofill name & email if saved
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedName || storedEmail) {
      setFormData((prev) => ({
        ...prev,
        name: storedName || "",
        email: storedEmail || "",
      }));
    }
  }, [fetchLeaves]);

  // ===================================
  // FORM HANDLERS
  // ===================================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/user/profile/request/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      toast.success("✅ Leave request submitted successfully!");
      setFormData({
        ...formData,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setShowForm(false);
      fetchLeaves();
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================
  // UTILS
  // ===================================
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFilterButtonClass = (buttonFilter: FilterType) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
      filter === buttonFilter
        ? "bg-purple-600 text-white shadow-md"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  const renderLeaveRow = (leave: Leave) => (
    <tr
      key={leave._id}
      className="border-b border-gray-100 transition-colors hover:bg-purple-50/50"
    >
      <td className="px-4 py-3 text-sm text-gray-800">{leave.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">
        {leave.email}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{leave.leaveType}</td>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
        {formatDate(leave.startDate)} <span className="text-gray-400">→</span>{" "}
        {formatDate(leave.endDate)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
        {leave.reason}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {leave.approvers.teamLead || "-"}, {leave.approvers.hr || "-"}
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-3 py-1 text-xs font-bold text-center rounded-full shadow-sm text-white ${
            leave.status === "pending"
              ? "bg-yellow-500"
              : leave.status === "approved"
              ? "bg-green-600"
              : "bg-red-500"
          }`}
        >
          {leave.status.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
        {formatDate(leave.createdAt)}
      </td>
    </tr>
  );

  // ===================================
  // FILTER + PAGINATION LOGIC
  // ===================================
  const allFilteredLeaves = leaves.filter((leave) =>
    filter === "all" ? true : leave.status === filter
  );
  const totalItems = allFilteredLeaves.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    else if (totalPages === 0 && currentPage !== 1) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginatedLeaves = allFilteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ===================================
  // RENDER
  // ===================================
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 relative min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Leave Management Dashboard 🏖️
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          + Request New Leave
        </button>
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-700">
            All Leave Requests ({allFilteredLeaves.length})
          </h3>
          <div className="flex space-x-2">
            {(["all", "pending", "approved", "rejected"] as const).map(
              (btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    setFilter(btn);
                    setCurrentPage(1);
                  }}
                  className={getFilterButtonClass(btn)}
                >
                  {btn.charAt(0).toUpperCase() + btn.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {paginatedLeaves.length > 0 ? (
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/70 text-gray-600 uppercase text-xs tracking-wider">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Dates</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                  <th className="px-4 py-3 font-semibold">Approvers</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Submitted On</th>
                </tr>
              </thead>
              <tbody>{paginatedLeaves.map(renderLeaveRow)}</tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {filter === "all"
                ? "No leave requests found."
                : `No ${filter} requests to display.`}
            </div>
          )}
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </section>

      {/* Slide-over Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
            onClick={() => setShowForm(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 max-w-lg w-full">
            <div className="h-full flex flex-col bg-white shadow-xl animate-slideInRight">
              <div className="px-6 py-5 bg-gray-50 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Submit New Leave Request
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Fill in the details to submit your time-off request.
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="ml-3 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700"
                >
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      disabled={!!formData.name}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-shadow"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      disabled={!!formData.email}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-shadow"
                    />
                  </div>

                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Leave Type
                    </label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white transition-shadow"
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Reason for Leave
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Clearly state the reason"
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-shadow"
                    />
                  </div>

                  <div className="py-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 disabled:bg-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg"
                    >
                      {submitting ? "Submitting..." : "Submit Leave Request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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
