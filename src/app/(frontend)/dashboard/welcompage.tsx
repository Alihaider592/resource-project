"use client";

import { useEffect, useState } from "react";
import { Users, BarChart3, UserCog, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UserType {
  name: string;
  email: string;
  role: "admin" | "HR" | "simple user" | string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, reports: 0, settings: 0 });
  const [latestUsers, setLatestUsers] = useState<UserData[]>([]);
  const [teamLeads, setTeamLeads] = useState<UserData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== "admin") router.push("/login");
        else setUser(data.user);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));

    // Dummy stats
    setStats({ users: 128, reports: 42, settings: 5 });

    // Dummy latest users
    setLatestUsers([
      { id: "1", name: "Ali Khan", email: "ali@test.com", role: "simple user" },
      { id: "2", name: "Sara Ahmed", email: "sara@test.com", role: "HR" },
      { id: "3", name: "Ahmed Malik", email: "ahmed@test.com", role: "simple user" },
    ]);

    // Dummy team leads
    setTeamLeads([
      { id: "1", name: "Kamran Ali", email: "kamran@test.com", role: "teamlead" },
      { id: "2", name: "Zara Khan", email: "zara@test.com", role: "teamlead" },
    ]);
  }, [router]);

  if (loading)
    return <div className="flex justify-center items-center min-h-screen text-gray-600">Loading...</div>;

  // Bar chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Users",
        data: [12, 19, 7, 15, 10, 20],
        backgroundColor: "rgba(128, 90, 213, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "New Users This Year" },
    },
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">
            Welcome, <span className="text-indigo-600">{user?.name}</span>
          </h1>
          <p className="text-gray-600">Here’s what’s happening in your admin panel today.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-purple-50 rounded-xl p-6 shadow flex flex-col items-center">
          <Users className="w-10 h-10 text-purple-700 mb-2" />
          <p className="text-gray-600">Total Users</p>
          <h2 className="text-2xl font-bold text-purple-800">{stats.users}</h2>
        </div>
        <div className="bg-indigo-50 rounded-xl p-6 shadow flex flex-col items-center">
          <BarChart3 className="w-10 h-10 text-indigo-700 mb-2" />
          <p className="text-gray-600">Reports Generated</p>
          <h2 className="text-2xl font-bold text-indigo-800">{stats.reports}</h2>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 shadow flex flex-col items-center">
          <UserCog className="w-10 h-10 text-orange-700 mb-2" />
          <p className="text-gray-600">System Settings</p>
          <h2 className="text-2xl font-bold text-orange-800">{stats.settings}</h2>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Latest Users Table */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-gray-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Leads Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Leads</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-gray-700">Role</th>
              </tr>
            </thead>
            <tbody>
              {teamLeads.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2">{t.email}</td>
                  <td className="px-4 py-2 capitalize">{t.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
