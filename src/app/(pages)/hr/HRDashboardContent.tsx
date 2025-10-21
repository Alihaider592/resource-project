"use client";

import { useEffect, useState, ReactElement } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  ClipboardList,
} from "lucide-react";
import LeaveApprovalDashboard from "@/app/(forntend)/components/LeavesApprovalsDashboard";

// ✅ Interfaces
interface HRDashboardProps {
  userName?: string;
}

interface LeaveRequest {
  _id: string;
  userId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface StatCard {
  title: string;
  value: number;
  icon: ReactElement;
  color: string;
}

export default function HRDashboard({ userName }: HRDashboardProps) {
  const [hrName, setHRName] = useState(userName || "HR");
  const [stats, setStats] = useState<StatCard[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setHRName(storedName);

    const fetchEmployeeCount = async () => {
      try {
        const res = await fetch("/api/employees/count");
        const data = await res.json();

        if (res.ok && typeof data.count === "number") {
          setTotalEmployees(data.count);
        } else {
          console.warn("Failed to fetch employee count:", data);
          setTotalEmployees(0);
        }
      } catch (error) {
        console.error("Error fetching employee count:", error);
        setTotalEmployees(0);
      }
    };

    const fetchLeaves = async () => {
      try {
        const res = await fetch("/api/user/profile/request/leave");
        const data = await res.json();

        if (res.ok && Array.isArray(data.leaves)) {
          const leavesData = data.leaves as LeaveRequest[];

          const pending = leavesData.filter((l) => l.status === "pending").length;
          const approved = leavesData.filter((l) => l.status === "approved").length;
          const rejected = leavesData.filter((l) => l.status === "rejected").length;

          setStats([
            { title: "Total Employees", value: totalEmployees, icon: <Users className="w-8 h-8" />, color: "green" },
            { title: "Pending Leaves", value: pending, icon: <FileText className="w-8 h-8" />, color: "yellow" },
            { title: "Approved Leaves", value: approved, icon: <CheckCircle className="w-8 h-8" />, color: "blue" },
            { title: "Rejected Leaves", value: rejected, icon: <XCircle className="w-8 h-8" />, color: "red" },
          ]);

          setLeaves(leavesData);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    Promise.all([fetchEmployeeCount(), fetchLeaves()]);
  }, [totalEmployees]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ✅ Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
          👋 Welcome back, <span className="text-green-600">{hrName}</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Manage your employees and handle leave requests efficiently.
        </p>
      </motion.div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className={`bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-l-4 border-${stat.color}-500`}
          >
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ Leave Requests Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Employee Leave Requests
          <span className="ml-2 text-sm text-gray-500">({leaves.length} total)</span>
        </h2>

        <LeaveApprovalDashboard userRole="hr" />
      </motion.div>
    </div>
  );
}
