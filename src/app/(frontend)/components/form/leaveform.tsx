"use client";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { FiSend, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

interface LeaveFormData {
  name: string;
  email: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveFormProps {
  token: string | null;
  initialData?: Partial<LeaveFormData>;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({
  token,
  onClose,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<LeaveFormData>({
    name: "",
    email: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // -------------------- Auto-fill Name & Email --------------------
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userName = payload.name || "";
        const userEmail = payload.email || "";
        setFormData((prev) => ({
          ...prev,
          name: userName,
          email: userEmail,
        }));
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    } else {
      // fallback to localStorage
      const userName = localStorage.getItem("userName") || "";
      const userEmail = localStorage.getItem("userEmail") || "";
      setFormData((prev) => ({
        ...prev,
        name: userName,
        email: userEmail,
      }));
    }
  }, [token]);

  // -------------------- Form Handlers --------------------
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

      // Reset only leave-related fields
      setFormData((prev) => ({
        ...prev,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      }));

      onSubmitSuccess();
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-l-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center bg-purple-600 text-white px-6 py-4">
        <div>
          <h2 className="text-2xl font-extrabold">Submit New Leave Request</h2>
          <p className="mt-1 text-sm text-indigo-200">
            Fill in the details to submit your time-off request.
          </p>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center text-indigo-200 hover:text-white transition-colors"
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Name */}
        <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
          <label className="block text-sm font-bold mb-1 text-gray-700">Name</label>
          <input
            name="name"
            value={formData.name}
            readOnly
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none disabled:bg-gray-200 disabled:text-gray-600 transition-all shadow-sm"
          />
        </div>

        {/* Email */}
        <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
          <label className="block text-sm font-bold mb-1 text-gray-700">Email Address</label>
          <input
            name="email"
            value={formData.email}
            readOnly
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none disabled:bg-gray-200 disabled:text-gray-600 transition-all shadow-sm"
          />
        </div>

        {/* Leave Type */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none bg-white transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="" disabled>
              Select Leave Type
            </option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Emergency Leave">Emergency Leave</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">Start Date</label>
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
            <label className="block text-sm font-bold mb-1 text-gray-700">End Date</label>
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
          <label className="block text-sm font-bold mb-1 text-gray-700">Reason for Leave</label>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center bg-purple-600 text-white py-3 rounded-xl font-extrabold shadow-xl hover:bg-purple-700 transition-all"
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
      </form>
    </div>
  );
};
