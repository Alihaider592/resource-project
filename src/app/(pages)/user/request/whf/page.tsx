"use client";

import { useEffect, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { LeaveRequest } from "../../../teamlead/types";
import toast from "react-hot-toast";

export default function WorkFromHomePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch user's WFH requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/user/profile/request/wfh");
        const data = await res.json();
        if (res.ok && Array.isArray(data.requests)) {
          setRequests(data.requests);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Failed to fetch WFH requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Submit WFH request
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/profile/request/wfh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("WFH request submitted!");
        setRequests((prev) => [...prev, data.request]);
        setStartDate("");
        setEndDate("");
        setReason("");
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10"
      >
         Work From Home
      </motion.h1>

      {/* WFH Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 mb-10 space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800">Apply for WFH</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </motion.form>

      {/* WFH Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          My WFH Requests
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No WFH requests submitted.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border border-gray-200">Start Date</th>
                  <th className="p-3 border border-gray-200">End Date</th>
                  <th className="p-3 border border-gray-200">Reason</th>
                  <th className="p-3 border border-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-200">
                      {req.startDate}
                    </td>
                    <td className="p-3 border border-gray-200">
                      {req.endDate}
                    </td>
                    <td className="p-3 border border-gray-200">{req.reason}</td>
                    <td className="p-3 border border-gray-200 capitalize">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : req.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
