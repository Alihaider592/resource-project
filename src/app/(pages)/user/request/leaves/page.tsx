"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

interface LeaveFormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface Leave {
  _id: string;
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

export default function LeaveRequestPage() {
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch leaves
  const fetchLeaves = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch("/api/user/profile/request/leave", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch leaves");
      setLeaves(Array.isArray(data.leaves) ? data.leaves : []);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) toast.error(err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!token) {
      toast.error("Please login to submit a request");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/user/profile/request/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      toast.success("✅ Leave request submitted successfully!");
      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      setShowForm(false);
      fetchLeaves();
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pendingLeaves: Leave[] = leaves.filter((l) => l.status === "pending");
  const approvedLeaves: Leave[] = leaves.filter((l) => l.status === "approved");
  const rejectedLeaves: Leave[] = leaves.filter((l) => l.status === "rejected");

  const renderLeaveRow = (leave: Leave) => (
    <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-2">{leave.leaveType}</td>
      <td className="px-4 py-2">
        {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
      </td>
      <td className="px-4 py-2">{leave.reason}</td>
      <td className="px-4 py-2">
        {leave.approvers.teamLead || "-"}, {leave.approvers.hr || "-"}
      </td>
      <td
  className={`px-2 py-1 text-[12px] mt-2 font-semibold text-center rounded-full text-white inline-block ${
    leave.status === "pending"
      ? "bg-yellow-500"
      : leave.status === "approved"
      ? "bg-green-500"
      : "bg-red-500"
  }`}
>

        {leave.status.toUpperCase()}
      </td>
      <td className="px-4 py-2 text-gray-400 text-sm">{formatDate(leave.createdAt)}</td>
    </tr>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 relative">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Leave Requests</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
        >
          Create
        </button>
      </div>

      {/* Leaves Sections */}
      {(
        [
          ["Pending Leaves", pendingLeaves],
          ["Approved Leaves", approvedLeaves],
          ["Rejected Leaves", rejectedLeaves],
        ] as [string, Leave[]][]
      ).map(([title, sectionLeaves], idx) =>
        sectionLeaves.length > 0 ? (
          <section
            key={idx}
            className="bg-white rounded-xl shadow-lg p-4 transition-all duration-500 hover:shadow-2xl"
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Dates</th>
                    <th className="px-4 py-2">Reason</th>
                    <th className="px-4 py-2">Approvers</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Submitted</th>
                  </tr>
                </thead>
                <tbody>{sectionLeaves.map(renderLeaveRow)}</tbody>
              </table>
            </div>
          </section>
        ) : null
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Shadow Overlay */}
          <div
            className="absolute inset-0 bg-gray-200 opacity-40 shadow-2xl"
            onClick={() => setShowForm(false)}
          ></div>

          {/* Form Modal */}
          <div className="relative bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-slideIn scale-100 transition-all duration-500">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Request Leave</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">Leave Type</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Enter reason..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !token}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
              >
                {submitting ? "Submitting..." : "Submit Leave Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Slide-in Animation */}
      <style jsx>{`
        .animate-slideIn {
          transform: translateY(-20px);
          opacity: 0;
          animation: slideIn 0.4s forwards ease-out;
        }
        @keyframes slideIn {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
