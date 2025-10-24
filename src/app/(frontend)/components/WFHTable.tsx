"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type UserRole = "user" | "teamlead" | "hr";
type ViewType = "my" | "all";

interface WFHRequest {
  _id: string;
  name: string;
  email: string;
  reason: string;
  workDetails: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

// ✅ Add userEmail here
interface WFHTableProps {
  userRole: UserRole;
  userEmail: string; // <-- required prop
  view: ViewType;
}

export default function WFHTable({ userRole, userEmail, view }: WFHTableProps) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [filter, setFilter] = useState<WFHRequest["status"] | "all">("all");

  const filters: Array<WFHRequest["status"] | "all"> = ["all", "pending", "approved", "rejected"];

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/user/profile/request/wfh");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error fetching WFH requests");

      if (userRole === "user") {
        setRequests(data.requests.filter((r: WFHRequest) => r.email === userEmail));
      } else {
        setRequests(data.requests);
      }
    } catch (err) {
      toast.error((err as Error).message || "Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userEmail, userRole]);

  const filtered = requests.filter((r) => (filter === "all" ? true : r.status === filter));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-600">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">Work Details</th>
              <th className="p-3 border">Start</th>
              <th className="p-3 border">End</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border">{r.name}</td>
                  <td className="p-3 border">{r.email}</td>
                  <td className="p-3 border">{r.reason}</td>
                  <td className="p-3 border">{r.workDetails}</td>
                  <td className="p-3 border">{r.startDate}</td>
                  <td className="p-3 border">{r.endDate}</td>
                  <td
                    className={`p-3 border font-medium ${
                      r.status === "approved"
                        ? "text-green-600"
                        : r.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {r.status.toUpperCase()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No WFH requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
