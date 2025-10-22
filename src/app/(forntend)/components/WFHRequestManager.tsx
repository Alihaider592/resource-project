"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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

export default function WFHRequestManager({ role }: { role: "hr" | "teamlead" }) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // ✅ Fetch all WFH requests (now unified)
  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/request/wfh?role=${role}`);
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests);
      } else {
        toast.error(data.message || "Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [role]);

  // ✅ Approve / Reject logic
  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (action === "reject" && !rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const res = await fetch(`/api/request/wfh/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason: rejectReason, role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Request ${action}ed successfully!`);
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id
              ? {
                  ...req,
                  status: action === "approve" ? "approved" : "rejected",
                  rejectionReason: rejectReason,
                }
              : req
          )
        );
        setRejecting(null);
        setRejectReason("");
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Something went wrong");
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
        {role === "hr" ? "Employee Work From Home Requests" : "Team Work From Home Requests"}
      </motion.h1>

      {loading ? (
        <p className="text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border border-gray-200">Name</th>
                <th className="p-3 border border-gray-200">Dates</th>
                <th className="p-3 border border-gray-200">Reason</th>
                <th className="p-3 border border-gray-200">Work Description</th>
                <th className="p-3 border border-gray-200">Status</th>
                <th className="p-3 border border-gray-200 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-200 font-semibold">{req.name}</td>
                  <td className="p-3 border border-gray-200">
                    {req.startDate} → {req.endDate}
                  </td>
                  <td className="p-3 border border-gray-200">{req.reason}</td>
                  <td className="p-3 border border-gray-200">{req.workDescription}</td>
                  <td className="p-3 border border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-200 text-center">
                    {req.status === "pending" && (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleAction(req._id, "approve")}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejecting(req._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Rejection Modal */}
      {rejecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full border rounded-md p-2"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRejecting(null)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(rejecting, "reject")}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Submit
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
