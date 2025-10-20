"use client";

import { useEffect, useState } from "react";
import TeamLeadCard from "./teamleadcard";
import { FiClipboard, FiUsers, FiCheckSquare, FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";
import LeaveApprovalDashboard from "@/app/(forntend)/components/LeavesApprovalsDashboard";

interface User {
  _id: string;
  firstname: string;
  name: string;
  email: string;
  role: string;
}

interface MeResponse {
  user?: User;
  message?: string;
}

export default function TeamLeadDashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch logged-in Team Lead
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.replace("/login");

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: MeResponse = await res.json();
        if (!res.ok || !data.user) return router.replace("/login");

        if (data.user.role.toLowerCase() !== "teamlead") return router.replace("/login");

        setUser(data.user);
      } catch (err) {
        console.error(err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p>Loading Team Lead Dashboard...</p>;
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
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
        <p className="text-gray-600 mt-1">
          Overview of projects, team activities, and leave requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <TeamLeadCard key={i} title={s.title} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      {/* Show LeaveApprovalDashboard for Team Lead */}
      <LeaveApprovalDashboard />
    </div>
  );
}
