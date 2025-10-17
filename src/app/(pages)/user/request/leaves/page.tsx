"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

interface LeaveFormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export default function LeaveRequestPage() {
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  // ✅ Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle login (simulated)
  const handleLogin = async () => {
    try {
      // Simulate login API call
      const dummyToken = "your_jwt_token_here"; // replace with real login API
      localStorage.setItem("token", dummyToken);
      setToken(dummyToken);
      toast.success("✅ Logged in successfully!");
    } catch (err) {
      toast.error("❌ Login failed");
    }
  };

  // ✅ Handle leave request submit
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
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <Toaster position="top-right" />

      {/* Login button for testing */}
      {!token && (
        <button
          onClick={handleLogin}
          className="mb-6 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
        >
          Login to get token
        </button>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Leave Request Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Leave Type</label>
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
          <label className="block text-gray-700 font-medium mb-1">Start Date</label>
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
          <label className="block text-gray-700 font-medium mb-1">End Date</label>
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
          <label className="block text-gray-700 font-medium mb-1">Reason</label>
          <textarea
            name="reason"
            rows={4}
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder="Enter your reason for leave..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !token}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-500"
        >
          {submitting ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
}
