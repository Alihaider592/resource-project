"use client";

import { useEffect, useState } from "react";
import TeamLeadCard from "./teamleadcard";
import { FiClipboard, FiUsers, FiCheckSquare, FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstname:string
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

        // Safely parse JSON
        let data: MeResponse = {};
        try {
          data = (await res.json()) as MeResponse;
        } catch (err) {
          console.error("Failed to parse JSON from /api/auth/me", err);
          router.replace("/login");
          return;
        }

        // Check for valid user
        if (!res.ok || !data.user) {
          console.warn("Unauthorized or invalid response:", data);
          router.replace("/login");
          return;
        }

        // Normalize role for consistency
        const roleNormalized = data.user.role.replace(/\s+/g, "").toLowerCase();
        if (roleNormalized !== "teamlead") {
          console.warn("User is not a Team Lead:", data.user.role);
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Error fetching team lead data:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

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

  const recentTasks = [
    { task: "Design Landing Page", assigned: "Ali", status: "Pending" },
    { task: "Fix Backend Bug", assigned: "Sara", status: "In Progress" },
    { task: "Team Meeting", assigned: "Team", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, { ` ${user?.name ?? "Team Lead"}` }</h1>        <p className="text-gray-600 mt-1">
          Here’s a quick overview of your projects and team activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <TeamLeadCard
            key={i}
            title={s.title}
            value={s.value}
            icon={s.icon}
            color={s.color}
          />
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Tasks</h2>
        <table className="w-full text-left">
          <thead className="text-gray-600 border-b border-gray-200">
            <tr>
              <th className="py-2 px-4">Task</th>
              <th className="py-2 px-4">Assigned To</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2 px-4">{task.task}</td>
                <td className="py-2 px-4">{task.assigned}</td>
                <td className="py-2 px-4">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Team Members */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Ali", "Sara", "Rizwan"].map((member, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  i === 0 ? "bg-teal-500" : i === 1 ? "bg-indigo-500" : "bg-orange-500"
                }`}
              >
                {member[0]}
              </div>
              <div>
                <p className="font-medium text-gray-800">{member}</p>
                <p className="text-gray-500 text-sm">
                  {i === 0 ? "Frontend Developer" : i === 1 ? "Backend Developer" : "QA Engineer"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
