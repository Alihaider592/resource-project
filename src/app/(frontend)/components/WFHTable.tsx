"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface WFHRequest {
  _id: string;
  name: string;
  email: string;
  reason: string;
  workDetails: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  approvers: { teamLead?: string | null; hr?: string | null };
}

interface Props {
  userRole: "user" | "teamlead" | "hr";
  userEmail: string;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

export default function WFHTable({ userRole, userEmail }: Props) {
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("/api/user/profile/request/wfh", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        if (userRole === "user") {
          setRequests(data.requests.filter((r: WFHRequest) => r.email === userEmail));
        } else {
          setRequests(data.requests);
        }
      } else {
        toast.error(data.message || "Error fetching WFH requests");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const comment = prompt(`Add a comment for ${action}?`) || "";
    const approverName = localStorage.getItem("userName") || userRole;
    const token = localStorage.getItem("userToken");

    try {
      const res = await fetch("/api/user/profile/request/wfh", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ wfhId: id, action, comment, approverName, role: userRole }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Request ${action}d`);
        fetchRequests();
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  const filtered = requests.filter((r) => (filter === "all" ? true : r.status === filter));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as FilterType[]).map((f) => (
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
        <span className="text-gray-500 text-sm">
          Page {page} of {totalPages || 1}
        </span>
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
              {userRole !== "user" && <th className="p-3 border">Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map((r) => (
              <tr key={r._id} className="border-t hover:bg-gray-50">
                <td className="p-3 border">{r.name}</td>
                <td className="p-3 border">{r.email}</td>
                <td className="p-3 border">{r.reason}</td>
                <td className="p-3 border text-gray-600">{r.workDetails}</td>
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
                {userRole !== "user" && (
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => handleAction(r._id, "approve")}
                      disabled={r.status !== "pending"}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(r._id, "reject")}
                      disabled={r.status !== "pending"}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  No WFH requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
