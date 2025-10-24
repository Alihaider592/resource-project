"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

type UserRole = "user" | "teamlead" | "hr";

interface WFHFormProps {
  userRole: UserRole;
  onRequestSubmitted: () => void;
}

export default function WFHForm({ userRole, onRequestSubmitted }: WFHFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    workDetails: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("userName") || "";
    const email = localStorage.getItem("userEmail") || "";
    setFormData((prev) => ({ ...prev, name, email }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/user/profile/request/wfh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success("WFH request submitted!");
      setFormData((prev) => ({
        ...prev,
        reason: "",
        workDetails: "",
        startDate: "",
        endDate: "",
      }));
      onRequestSubmitted();
    } else {
      toast.error("Failed to submit WFH request");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded w-full bg-gray-100"
          value={formData.name}
          readOnly
          placeholder="Name"
        />
        <input
          className="border p-2 rounded w-full bg-gray-100"
          value={formData.email}
          readOnly
          placeholder="Email"
        />
      </div>

      <textarea
        className="border p-2 rounded w-full"
        value={formData.reason}
        placeholder="Reason for work from home"
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
      />

      <textarea
        className="border p-2 rounded w-full"
        value={formData.workDetails}
        placeholder="What work will you do at home?"
        onChange={(e) => setFormData({ ...formData, workDetails: e.target.value })}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Submit WFH Request
      </button>
    </form>
  );
}
