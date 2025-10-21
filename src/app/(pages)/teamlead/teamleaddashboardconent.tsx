"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, ListTodo, Briefcase, ClipboardList } from "lucide-react";
import TeamLeadLeaveTable from "./TeamLeadLeaveTable";
import { LeaveRequest, StatCard, Task, Project } from "./types";

export default function TeamLeadDashboardPage() {
  const [leadName, setLeadName] = useState("Team Lead");
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setLeadName(storedName);

    // Fetch leaves
    const fetchLeaves = async () => {
      try {
        const res = await fetch("/api/user/profile/request/leave");
        const data = await res.json();

        if (res.ok && Array.isArray(data.leaves)) {
          const teamLeadLeaves = data.leaves.filter(
            (l: LeaveRequest) => l.approvers?.teamLead !== undefined
          );

          setLeaves(teamLeadLeaves);

          // Compute stats
          const pending = teamLeadLeaves.filter((l: LeaveRequest) => l.status === "pending").length;
          const approved = teamLeadLeaves.filter((l: LeaveRequest) => l.status === "approved").length;
          const rejected = teamLeadLeaves.filter((l: LeaveRequest) => l.status === "rejected").length;
          const total = teamLeadLeaves.length;

          setStats([
            { title: "Pending Requests", value: pending, icon: <Clock className="w-8 h-8" />, color: "yellow" },
            { title: "Approved Requests", value: approved, icon: <CheckCircle className="w-8 h-8" />, color: "green" },
            { title: "Rejected Requests", value: rejected, icon: <XCircle className="w-8 h-8" />, color: "red" },
            { title: "Total Requests", value: total, icon: <ClipboardList className="w-8 h-8" />, color: "blue" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    fetchLeaves();

    // Dummy tasks
    setTasks([
      { title: "Review project Alpha", status: "In Progress" },
      { title: "Weekly report meeting", status: "Pending" },
      { title: "Submit feedback", status: "Completed" },
    ]);

    // Dummy projects
    setProjects([
      { name: "Project Alpha", progress: 90 },
      { name: "Project Beta", progress: 55 },
    ]);
  }, []);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
          👋 Hello, <span className="text-blue-600">{leadName}</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          Manage your team’s leave requests, tasks, and projects efficiently.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className={`bg-white p-6 rounded-xl shadow-md flex items-center justify-between border-l-4 border-${stat.color}-500`}
          >
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Leave Table */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" /> Team Leave Requests
        </h2>
        <TeamLeadLeaveTable leaves={leaves} />
      </motion.div>

      {/* Tasks */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-green-600" /> Team Tasks
        </h2>
        <ul className="space-y-3">
          {tasks.map((task, idx) => (
            <li key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span className="font-medium text-gray-800">{task.title}</span>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
                task.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}>
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
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="h-3 rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
