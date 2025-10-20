"use client";

import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, CheckCircle, XCircle } from "lucide-react";
import LeaveApprovalDashboard from "@/app/(forntend)/components/LeavesApprovalsDashboard";

// ✅ Interfaces
interface HRDashboardProps {
  userName?: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
}

export default function HRDashboard({ userName }: HRDashboardProps) {
  const [hrName, setHRName] = useState(userName || "HR");
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setHRName(storedName);

    // Dummy Stats (Replace with API calls later)
    setStats([
      { title: "Total Employees", value: 124, icon: <Users className="w-8 h-8" />, color: "green" },
      { title: "Pending Leaves", value: 8, icon: <FileText className="w-8 h-8" />, color: "yellow" },
      { title: "Approved Leaves", value: 34, icon: <CheckCircle className="w-8 h-8" />, color: "blue" },
      { title: "Rejected Leaves", value: 3, icon: <XCircle className="w-8 h-8" />, color: "red" },
    ]);
  }, []);

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
        {stats.map((stat) => (
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

      {/* ✅ Live Leave Approval Dashboard */}
      <LeaveApprovalDashboard />
    </div>
  );
}
