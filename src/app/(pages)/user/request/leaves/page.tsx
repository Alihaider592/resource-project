"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiSend, FiClock, FiCheckCircle, FiXCircle, FiCalendar } from 'react-icons/fi';

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

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

// ===================================
// UTILITY COMPONENTS
// ===================================

// Simplified and type-safe Pagination component
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-between items-center px-4 py-3 sm:px-6 border-t border-gray-100">
            <div className="text-sm text-gray-600">
                Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} results
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                                ? 'z-10 bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </nav>
        </div>
    );
};


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
      // Added a small delay to simulate network latency and show loading states if needed
      // await new Promise(resolve => setTimeout(resolve, 500)); 
      
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
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  const renderStatusTag = (status: Leave['status']) => {
    let colorClasses;
    let icon;

    switch (status) {
        case "pending":
            colorClasses = "bg-yellow-100 text-yellow-800 border-yellow-300";
            icon = <FiClock className="w-3 h-3 mr-1" />;
            break;
        case "approved":
            colorClasses = "bg-green-100 text-green-800 border-green-300";
            icon = <FiCheckCircle className="w-3 h-3 mr-1" />;
            break;
        case "rejected":
            colorClasses = "bg-red-100 text-red-800 border-red-300";
            icon = <FiXCircle className="w-3 h-3 mr-1" />;
            break;
        default:
            colorClasses = "bg-gray-100 text-gray-800 border-gray-300";
            icon = null;
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${colorClasses}`}>
            {icon}
            {status.toUpperCase()}
        </span>
    );
  };
  
  const renderLeaveRow = (leave: Leave) => (
    <tr
      key={leave._id}
      className="border-b border-gray-100 transition-colors hover:bg-indigo-50/50"
    >
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{leave.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">
        {leave.email}
      </td>
      <td className="px-4 py-3 text-sm text-indigo-600 font-medium">{leave.leaveType}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap flex items-center">
        <FiCalendar className="w-4 h-4 mr-1 text-gray-500" />
        {formatDate(leave.startDate)} <span className="text-gray-400 mx-1">→</span>{" "}
        {formatDate(leave.endDate)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
        {leave.reason}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <span className="font-medium">{leave.approvers.teamLead || "-"}</span>, {leave.approvers.hr || "-"}
      </td>
      <td className="px-4 py-3">{renderStatusTag(leave.status)}</td>
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
    <div className="max-w-7xl mx-auto p-6 space-y-8 relative min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b-4 border-indigo-200/50">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <FiSend className="w-7 h-7 mr-3 text-indigo-600" />
          Leave Management Dashboard
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-400/50 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          + Request New Leave
        </button>
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <h3 className="text-xl font-bold text-gray-700">
            Leave History ({allFilteredLeaves.length})
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

        {/* Pagination Component (using local stub) */}
        {totalPages > 1 && (
             <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
            />
        )}
      </section>

      {/* SLIDE-OVER FORM (Aesthetically Improved) */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity"
            onClick={() => setShowForm(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 max-w-xl w-full">
            <div className="h-full flex flex-col bg-white shadow-2xl rounded-l-2xl animate-slideInRight">
              {/* Form Header */}
              <div className="px-6 py-6 bg-indigo-600 text-white flex justify-between items-center rounded-tl-2xl">
                <div>
                  <h2 className="text-2xl font-extrabold">
                    Submit New Leave Request
                  </h2>
                  <p className="mt-1 text-sm text-indigo-200">
                    Fill in the details to submit your time-off request.
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="ml-3 h-8 w-8 flex items-center justify-center text-indigo-200 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="h-7 w-7"
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

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                    <label className="block text-sm font-bold mb-1 text-gray-700">
                      Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      disabled={!!formData.name}
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none disabled:bg-gray-200 disabled:text-gray-600 transition-all shadow-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
                    <label className="block text-sm font-bold mb-1 text-gray-700">
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
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none disabled:bg-gray-200 disabled:text-gray-600 transition-all shadow-sm"
                    />
                  </div>

                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">
                      Leave Type
                    </label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none bg-white transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Leave Type</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1 text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1 text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">
                      Reason for Leave
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows={4}
                      required
                      placeholder="Clearly state the reason"
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none resize-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="py-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-xl font-extrabold shadow-xl shadow-indigo-500/50 hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 disabled:opacity-60 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-[1.005]"
                    >
                      {submitting ? (
                        <>
                          <FiClock className="w-5 h-5 mr-2 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5 mr-2" /> Submit Leave Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for Slide-over animation */}
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
