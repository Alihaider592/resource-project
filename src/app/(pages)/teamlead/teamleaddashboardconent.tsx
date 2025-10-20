"use client";

import { useEffect, useState } from "react";
import TeamLeadCard from "./teamleadcard";
import { FiClipboard, FiUsers, FiCheckSquare, FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstname: string;
  name: string;
  email: string;
  role: string;
}

interface Leave {
  _id: string;
  userId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvers: {
    teamLead?: string;
    hr?: string;
  };
  approverStatus: { [key: string]: "approve" | "reject" };
}

interface MeResponse {
  user?: User;
  message?: string;
}

export default function TeamLeadDashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingLeaves, setPendingLeaves] = useState<Leave[]>([]);
  const router = useRouter();

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: MeResponse = await res.json();

        if (!res.ok || !data.user) {
          router.replace("/login");
          return;
        }

        const roleNormalized = data.user.role.replace(/\s+/g, "").toLowerCase();
        if (roleNormalized !== "teamlead") {
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Fetch pending leaves for this team lead
  useEffect(() => {
    const fetchLeaves = async () => {
      if (!user) return;

      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/user/profile/request/leave", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPendingLeaves(
            data.leaves.filter(
              (leave: Leave) =>
                leave.status === "pending" &&
                leave.approvers.teamLead === user.email
            )
          );
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
    };

    fetchLeaves();
  }, [user]);

  const handleLeaveAction = async (leaveId: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/user/profile/request/leave", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leaveId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Leave ${action}d successfully`);
        // Refresh pending leaves
        setPendingLeaves((prev) =>
          prev.filter((leave) => leave._id !== leaveId)
        );
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading Team Lead Dashboard...
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { title: "My Projects", value: 5, icon: <FiClipboard size={24} />, color: "bg-teal-500" },
    { title: "Active Team Members", value: 12, icon: <FiUsers size={24} />, color: "bg-indigo-500" },
    { title: "Pending Tasks", value: 8, icon: <FiCheckSquare size={24} />, color: "bg-orange-500" },
    { title: "Upcoming Deadlines", value: 3, icon: <FiClock size={24} />, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Here’s a quick overview of your projects, team activities, and leave requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <TeamLeadCard key={i} title={s.title} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      {/* Pending Leaves */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Leave Requests</h2>
        {pendingLeaves.length === 0 && <p>No pending leaves</p>}
        <div className="space-y-4">
          {pendingLeaves.map((leave) => (
            <div key={leave._id} className="p-4 border rounded shadow-sm">
              <p><strong>Type:</strong> {leave.leaveType}</p>
              <p><strong>From:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> {leave.reason}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleLeaveAction(leave._id, "approve")}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleLeaveAction(leave._id, "reject")}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
