"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiRefreshCcw } from "react-icons/fi";

interface WFHRequest {
  _id: string;
  name: string;
  email: string;
  date: string;
  workType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

interface Props {
  user: {
    name: string;
    email: string;
    role: "teamlead" | "hr";
  };
}

export default function MyWFHRequests({ user }: Props) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user.email || !user.role) {
      toast.error("User email or role is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/user/profile/request/wfh/get?email=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}`
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch requests");

      // Filter only the logged-in user's requests
      const myRequests = data.requests.filter(
        (req: WFHRequest) => req.email === user.email
      );

      setRequests(myRequests);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to load your WFH requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          My Work From Home Requests
        </h2>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
        >
          <FiRefreshCcw /> Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t applied for WFH yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Work Type</th>
                <th className="p-2 border-b">Reason</th>
                <th className="p-2 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="p-2 border-b flex items-center gap-2">
                    <FiCalendar /> {req.date}
                  </td>
                  <td className="p-2 border-b">{req.workType}</td>
                  <td className="p-2 border-b">{req.reason}</td>
                  <td className="p-2 border-b text-center">
                    {req.status === "pending" && (
                      <span className="text-yellow-600 flex justify-center items-center gap-1">
                        <FiClock /> Pending
                      </span>
                    )}
                    {req.status === "approved" && (
                      <span className="text-green-600 flex justify-center items-center gap-1">
                        <FiCheckCircle /> Approved
                      </span>
                    )}
                    {req.status === "rejected" && (
                      <span className="text-red-600 flex justify-center items-center gap-1">
                        <FiXCircle /> Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
