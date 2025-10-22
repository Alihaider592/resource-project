"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

// ✅ Define the interface for each WFH request
interface WFHRequest {
  _id: string;
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  reason: string;
  workDescription: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export default function WorkFromHomePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    startDate: "",
    endDate: "",
    reason: "",
    workDescription: "",
  });

  const [requests, setRequests] = useState<WFHRequest[]>([]);

  // ✅ Fetch requests (without page refresh)
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/user/profile/request/wfh");
      const data = await res.json();
      if (res.ok) setRequests(data.requests);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Handle form input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit Work From Home request
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/profile/request/wfh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Request sent!");
        setForm({
          name: "",
          email: "",
          startDate: "",
          endDate: "",
          reason: "",
          workDescription: "",
        });
        fetchRequests(); // instantly update UI
      } else {
        toast.error(data.message || "Error sending request");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      toast.error("Server error");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Work From Home Request</h2>

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white shadow p-4 rounded-lg"
      >
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <div className="flex gap-2">
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            className="border rounded p-2 flex-1"
            required
          />
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className="border rounded p-2 flex-1"
            required
          />
        </div>
        <textarea
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={2}
          required
        />
        <textarea
          name="workDescription"
          placeholder="What work will you do at home?"
          value={form.workDescription}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={3}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Send Request
        </button>
      </form>

      {/* ✅ Requests List */}
      <h3 className="text-xl font-semibold mt-6">My WFH Requests</h3>
      <div className="space-y-3">
        {requests.length === 0 && <p>No requests yet.</p>}

        {requests.map((r) => (
          <div
            key={r._id}
            className="border rounded-lg p-3 shadow-sm bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{r.reason}</p>
              <p className="text-sm text-gray-600">
                {r.startDate} → {r.endDate}
              </p>
              <p className="text-sm text-gray-700 italic">
                {r.workDescription}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                r.status === "approved"
                  ? "bg-green-200 text-green-800"
                  : r.status === "rejected"
                  ? "bg-red-200 text-red-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {r.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
