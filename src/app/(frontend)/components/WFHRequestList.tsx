"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Request { _id: string; name: string; email: string; startDate: string; endDate: string; reason: string; status: "pending" | "approved" | "rejected"; }

export default function WFHRequestList() {
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/wfh/requests");
      const data = await res.json();
      setRequests(data);
    } catch { toast.error("Failed to fetch requests"); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/wfh/update/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const data = await res.json();
      if (res.ok) { toast.success(`Request ${status}`); fetchRequests(); } 
      else toast.error(data.error || "Failed to update");
    } catch { toast.error("Server error"); }
  };

  return (
    <div className="space-y-4">
      {requests.map(r => (
        <div key={r._id} className="p-4 border rounded shadow-sm flex justify-between items-center">
          <div>
            <p><strong>{r.name}</strong> ({r.email})</p>
            <p>{r.startDate} → {r.endDate}</p>
            <p>{r.reason}</p>
            <p>Status: <span className={`font-bold ${r.status === 'approved' ? 'text-green-600' : r.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{r.status.toUpperCase()}</span></p>
          </div>
          {r.status === "pending" && (
            <div className="space-x-2">
              <button onClick={() => updateStatus(r._id, "approved")} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
              <button onClick={() => updateStatus(r._id, "rejected")} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
