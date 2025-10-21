"use client";

import { useEffect, useState, ReactElement } from "react";
import { motion } from "framer-motion";
import { Users, FileText, CheckCircle, XCircle, ClipboardList, ListTodo, Briefcase } from "lucide-react";
import HRLeaveTable from "./HRLeaveTable"; // Create this component like TeamLeadLeaveTable
import { LeaveRequest, StatCard, Task, Project } from "../teamlead/types";

interface HRDashboardProps {
  userName?: string;
}

export default function HRDashboard({ userName }: HRDashboardProps) {
  const [hrName, setHRName] = useState(userName || "HR");
  const [stats, setStats] = useState<StatCard[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setHRName(storedName);

    const fetchLeaves = async () => {
      try {
        const res = await fetch("/api/user/profile/request/leave");
        const data = await res.json();
        if (res.ok && Array.isArray(data.leaves)) {
          // Filter only leaves that are for HR approval
          const hrLeaves = data.leaves.filter((l: LeaveRequest) => l.approvers?.hr !== undefined);
          setLeaves(hrLeaves);

          const pending = hrLeaves.filter((l: LeaveRequest) => l.status === "pending").length;
          const approved = hrLeaves.filter((l: LeaveRequest) => l.status === "approved").length;
          const rejected = hrLeaves.filter((l: LeaveRequest) => l.status === "rejected").length;
          const totalEmployees = new Set(hrLeaves.map((l: LeaveRequest) => l.email)).size;

          setStats([
            { title: "Total Employees", value: totalEmployees, icon: <Users className="w-8 h-8" />, color: "green" },
            { title: "Pending Leaves", value: pending, icon: <FileText className="w-8 h-8" />, color: "yellow" },
            { title: "Approved Leaves", value: approved, icon: <CheckCircle className="w-8 h-8" />, color: "blue" },
            { title: "Rejected Leaves", value: rejected, icon: <XCircle className="w-8 h-8" />, color: "red" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
      }
    };

    setTasks([
      { title: "Prepare HR monthly report", status: "Pending" },
      { title: "Review leave policies", status: "In Progress" },
      { title: "Organize team meeting", status: "Completed" },
    ]);

    setProjects([
      { name: "HR System Upgrade", progress: 70 },
      { name: "Recruitment Drive", progress: 40 },
    ]);

    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10">
        👋 Welcome back, <span className="text-green-600">{hrName}</span>
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} className={`bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-l-4 border-${stat.color}-500`}>
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

      {leaves.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" /> Leave Requests
          </h2>
          <HRLeaveTable leaves={leaves} />
        </motion.div>
      )}

      {/* Tasks */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-green-600" /> Tasks
        </h2>
        <ul className="space-y-3">
          {tasks.map((task, idx) => (
            <li key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="font-medium text-gray-800">{task.title}</span>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${task.status === "Completed" ? "bg-green-100 text-green-700" : task.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-green-200 text-gray-700"}`}>
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Projects */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-purple-600" /> Projects Overview
        </h2>
        <div className="space-y-4">
          {projects.map((project, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{project.name}</span>
                <span className="text-sm text-gray-500">{project.progress}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div className="h-3 rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
