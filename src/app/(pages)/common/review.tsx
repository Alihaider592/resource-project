"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// ✅ Define type for each WFH request
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

export default function WFHReviewPage({ role }: { role: "hr" | "teamlead" }) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState<string | null>(null);

  // ✅ Fetch requests from backend
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/user/profile/request/wfh");
      const data = await res.json();
      if (res.ok) setRequests(data.requests);
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Approve / Reject logic
  const handleAction = async (id: string, action: "approved" | "rejected") => {
    const body = { id, action, approverRole: role } as {
      id: string;
      action: "approved" | "rejected";
      approverRole: "hr" | "teamlead";
      rejectionReason?: string;
    };

    if (action === "rejected") {
      if (!rejectionReason.trim()) {
        toast.error("Please enter a rejection reason");
        return;
      }
      body.rejectionReason = rejectionReason;
    }

    try {
      const res = await fetch("/api/user/profile/request/wfh/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Request ${action}`);
        setShowRejectBox(null);
        setRejectionReason("");
        fetchRequests();
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ✅ Render all requests
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">
        {role === "hr" ? "HR Dashboard — WFH Requests" : "Team Lead — WFH Requests"}
      </h2>

      {requests.map((r) => (
        <div key={r._id} className="border p-4 rounded-lg shadow-sm bg-white space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{r.name}</p>
              <p className="text-sm text-gray-600">{r.email}</p>
              <p>
                <strong>From:</strong> {r.startDate} → {r.endDate}
              </p>
              <p>
                <strong>Reason:</strong> {r.reason}
              </p>
              <p>
                <strong>Work:</strong> {r.workDescription}
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

          {/* Approve / Reject Buttons */}
          {r.status === "pending" && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => handleAction(r._id, "approved")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  setShowRejectBox(showRejectBox === r._id ? null : r._id)
                }
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>

              {showRejectBox === r._id && (
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="text"
                    placeholder="Reason for rejection"
                    className="border rounded p-1 flex-1"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <button
                    onClick={() => handleAction(r._id, "rejected")}
                    className="bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}

          {r.rejectionReason && (
            <p className="text-sm text-red-600 italic mt-1">
              Rejection Reason: {r.rejectionReason}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
