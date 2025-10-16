"use client";

import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, CheckCircle, XCircle } from "lucide-react";

interface HRDashboardProps {
  userName?: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
}

interface RecentLeave {
  id: string;
  employeeName: string;
  type: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
}

export default function HRDashboard({ userName }: HRDashboardProps) {
  const [hrName, setHRName] = useState(userName || "HR");
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentLeaves, setRecentLeaves] = useState<RecentLeave[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setHRName(storedName);

    // Dummy Stats (Replace with API calls)
    setStats([
      { title: "Total Employees", value: 124, icon: <Users className="w-8 h-8" />, color: "green" },
      { title: "Pending Leaves", value: 8, icon: <FileText className="w-8 h-8" />, color: "yellow" },
      { title: "Approved Leaves", value: 34, icon: <CheckCircle className="w-8 h-8" />, color: "blue" },
      { title: "Rejected Leaves", value: 3, icon: <XCircle className="w-8 h-8" />, color: "red" },
    ]);

    // Dummy recent leaves
    setRecentLeaves([
      { id: "1", employeeName: "Ali Khan", type: "Sick Leave", status: "Pending", date: "2025-10-12" },
      { id: "2", employeeName: "Sara Ahmed", type: "Casual Leave", status: "Approved", date: "2025-10-11" },
      { id: "3", employeeName: "John Doe", type: "Annual Leave", status: "Rejected", date: "2025-10-10" },
    ]);
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Pending":
        return "text-yellow-500";
      case "Rejected":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
          👋 Welcome back, <span className="text-green-500">{hrName}</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Here is your HR dashboard to manage employees and leave requests efficiently.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat)=> (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.05 }}
            className={`bg-white p-6 rounded-xl shadow-md flex items-center justify-between`}
          >
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-${stat.color}-100`}>{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Leaves Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Leave Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-gray-600">Employee</th>
                <th className="px-4 py-2 text-gray-600">Leave Type</th>
                <th className="px-4 py-2 text-gray-600">Status</th>
                <th className="px-4 py-2 text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaves.map((leave) => (
                <tr key={leave.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{leave.employeeName}</td>
                  <td className="px-4 py-2">{leave.type}</td>
                  <td className={`px-4 py-2 font-semibold ${statusColor(leave.status)}`}>{leave.status}</td>
                  <td className="px-4 py-2">{leave.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
