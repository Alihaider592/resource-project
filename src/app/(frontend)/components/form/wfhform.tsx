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

  const [emailEditable, setEmailEditable] = useState(true);

  useEffect(() => {
    // Simulate token decode or localStorage
    const tokenEmail = localStorage.getItem("userEmail") || "";
    const tokenName = localStorage.getItem("userName") || "";

    setFormData((prev) => ({
      ...prev,
      email: tokenEmail,
      name: tokenName,
    }));

    if (tokenEmail) setEmailEditable(false); // disable if email exists
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) return toast.error("User not authenticated");

    const res = await fetch("/api/user/profile/request/wfh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

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
      toast.error(data.message || "Failed to submit WFH request");
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          disabled={!emailEditable}
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
