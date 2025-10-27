"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiCalendar,
  FiRefreshCcw,
} from "react-icons/fi";

interface Approval {
  status: "approved" | "rejected";
  reason?: string;
}

interface WFHRequest {
  _id: string;
  name: string;
  email: string;
  date: string;
  workType: string;
  reason: string;
  role: "user" | "teamlead" | "hr";
  status: "pending" | "approved" | "rejected";
  approvals: {
    teamlead?: Approval;
    hr?: Approval;
  };
  createdAt?: string;
}

interface WorkFromHomeListProps {
  user: { name: string; email: string; role: "user" | "teamlead" | "hr" };
}
interface ActionPayload {
  action: "approve" | "reject";
  approver: string;
  role: "teamlead" | "hr";
  reason?: string;
}

export default function WorkFromHomeList({ user }: WorkFromHomeListProps) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal state
  const [rejectModal, setRejectModal] = useState<{
    visible: boolean;
    requestId: string | null;
  }>({ visible: false, requestId: null });
  const [rejectReason, setRejectReason] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/user/profile/request/wfh/get?email=${user.email}&role=${user.role}`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setRequests(data.requests || []);
    } catch (error) {
      console.error("❌ Failed to load WFH requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [user.email, user.role]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (
    id: string,
    action: "approve" | "reject",
    role: "teamlead" | "hr"
  ) => {
    if (user.role === "user") {
      toast.error("You are not authorized to perform this action.");
      return;
    }

    if (action === "reject") {
      setRejectModal({ visible: true, requestId: id });
      return;
    }

    // Approve
    await performAction(id, action, role);
  };

const performAction = async (
  id: string,
  action: "approve" | "reject",
  role: "teamlead" | "hr",
  reason?: string
) => {
  try {
    const payload: ActionPayload = { action, approver: user.email, role };
if (action === "reject") payload.reason = reason;


    const res = await fetch(`/api/user/profile/request/wfh/action/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(`Request ${action}d successfully`);
      fetchRequests();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("❌ Action error:", error);
    toast.error("Something went wrong while updating the request");
  }
};

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    if (rejectModal.requestId) {
      await performAction(
        rejectModal.requestId,
        "reject",
        user.role as "teamlead" | "hr",
        rejectReason
      );
      setRejectModal({ visible: false, requestId: null });
      setRejectReason("");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  if (!requests || requests.length === 0)
    return <p className="text-center text-gray-500 mt-10">No requests found</p>;

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiUsers /> Work From Home Requests
        </h2>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
        >
          <FiRefreshCcw /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Work Type</th>
              <th className="p-2 border-b">Reason</th>
              <th className="p-2 border-b text-center">Status</th>
              {(user.role === "teamlead" || user.role === "hr") && (
                <th className="p-2 border-b text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{req.name}</td>
                <td className="p-2 border-b">{req.email}</td>
                <td className="p-2 border-b flex items-center gap-2">
                  <FiCalendar /> {req.date}
                </td>
                <td className="p-2 border-b">{req.workType}</td>
                <td className="p-2 border-b">{req.reason}</td>

                <td className="p-2 border-b text-center flex flex-col items-center gap-1">
                  {req.status === "pending" && (
                    <span className="text-yellow-500 flex items-center gap-1">
                      <FiClock /> Pending
                    </span>
                  )}
                  {req.status === "approved" && (
                    <span className="text-green-600 flex items-center gap-1">
                      <FiCheckCircle /> Approved
                    </span>
                  )}
                  {req.status === "rejected" && (
                    <div className="text-red-600 flex flex-col items-center gap-1">
                      <span className="flex items-center gap-1">
                        <FiXCircle /> Rejected
                      </span>
                      {req.approvals.teamlead?.reason && (
                        <small>TeamLead: {req.approvals.teamlead.reason}</small>
                      )}
                      {req.approvals.hr?.reason && (
                        <small>HR: {req.approvals.hr.reason}</small>
                      )}
                    </div>
                  )}
                  {req.approvals.teamlead?.status && (
                    <small>TeamLead: {req.approvals.teamlead.status}</small>
                  )}
                  {req.approvals.hr?.status && (
                    <small>HR: {req.approvals.hr.status}</small>
                  )}
                </td>

                {(user.role === "teamlead" || user.role === "hr") && (
                  <td className="p-2 border-b text-center">
                    {req.status === "pending" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() =>
                            handleAction(
                              req._id,
                              "approve",
                              user.role as "teamlead" | "hr"
                            )
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleAction(
                              req._id,
                              "reject",
                              user.role as "teamlead" | "hr"
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No actions</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject modal */}
      {rejectModal.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-2">Rejection Reason</h2>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setRejectModal({ visible: false, requestId: null })
                }
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Submit Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
