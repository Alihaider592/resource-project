"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSend, FiHome } from "react-icons/fi";

interface User {
  name: string;
  email: string;
  role: "user" | "teamlead" | "hr";
}

interface WorkFromHomeFormProps {
  user: User;
}

export const WorkFromHomeForm: React.FC<WorkFromHomeFormProps> = ({ user }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    workType: "",
    reason: "",
  });

  // Auto-fill name and email from user prop
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.workType || !form.reason) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/user/profile/request/wfh/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: user.role,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Work From Home request submitted!");
        setForm((prev) => ({
          ...prev,
          date: "",
          workType: "",
          reason: "",
        }));
      } else {
        toast.error(data.message || "Failed to submit WFH request.");
      }
    } catch (error) {
      console.error("WFH apply error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiHome className="text-purple-600" /> Apply for Work From Home
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            readOnly
            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">WFH Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Work Type */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Type of Work
          </label>
          <select
            name="workType"
            value={form.workType}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select work type</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="testing">Testing</option>
            <option value="management">Management</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Explain why you are requesting WFH..."
            className="w-full border border-gray-300 p-2 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
        >
          <FiSend /> Submit Request
        </button>
      </form>
    </div>
  );
};
