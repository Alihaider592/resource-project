"use client";

import { useEffect, useState, ReactElement } from "react";
import { motion } from "framer-motion";
import { Users, FileText, CheckCircle, XCircle } from "lucide-react";

// ✅ Props
interface HRDashboardProps {
  userName?: string;
}

// ✅ Stat card interface
interface StatCard {
  title: string;
  value: number;
  icon: ReactElement;
  color: string;
}

// ✅ Leave request interface
interface LeaveRequest {
  _id: string;
  userId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export default function HRDashboard({ userName }: HRDashboardProps) {
  const [hrName, setHRName] = useState(userName || "HR");
  const [stats, setStats] = useState<StatCard[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [pendingLeaves, setPendingLeaves] = useState<number>(0);
  const [approvedLeaves, setApprovedLeaves] = useState<number>(0);
  const [rejectedLeaves, setRejectedLeaves] = useState<number>(0);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setHRName(storedName);

    // ✅ Fetch employees count
    const fetchEmployeeCount = async () => {
      try {
        const res = await fetch("/api/employees");
        const data = await res.json();
        const count = Array.isArray(data) ? data.length : data.count ?? 0;
        setTotalEmployees(count);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    // ✅ Fetch leave stats
    const fetchLeaveStats = async () => {
      try {
        const res = await fetch("/api/user/profile/request/leave");
        const data = await res.json();
        if (res.ok && Array.isArray(data.leaves)) {
          const leavesData: LeaveRequest[] = data.leaves;

          setPendingLeaves(leavesData.filter((l: LeaveRequest) => l.status === "pending").length);
          setApprovedLeaves(leavesData.filter((l: LeaveRequest) => l.status === "approved").length);
          setRejectedLeaves(leavesData.filter((l: LeaveRequest) => l.status === "rejected").length);
        }
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
      }
    };

    fetchEmployeeCount();
    fetchLeaveStats();
  }, []);

  // ✅ Update stats when counts change
  useEffect(() => {
    setStats([
      { title: "Total Employees", value: totalEmployees, icon: <Users className="w-8 h-8" />, color: "green" },
      { title: "Pending Leaves", value: pendingLeaves, icon: <FileText className="w-8 h-8" />, color: "yellow" },
      { title: "Approved Leaves", value: approvedLeaves, icon: <CheckCircle className="w-8 h-8" />, color: "blue" },
      { title: "Rejected Leaves", value: rejectedLeaves, icon: <XCircle className="w-8 h-8" />, color: "red" },
    ]);
  }, [totalEmployees, pendingLeaves, approvedLeaves, rejectedLeaves]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10"
      >
        👋 Welcome back, <span className="text-green-600">{hrName}</span>
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
