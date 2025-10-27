"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  ClipboardList, 
  ListTodo, 
  Briefcase 
} from "lucide-react"; 

import HRLeaveTable from "./HRLeaveTable"; 
import { LeaveRequest, StatCard, Task, Project } from "../teamlead/types"; 

// 🚨 WORKAROUND: Extend the external StatCard interface locally 
// This allows TypeScript to recognize 'colorKey' in this file. 
// The best solution is still to edit the external types file.
interface ExtendedStatCard extends StatCard {
    colorKey: 'total' | 'pending' | 'approved' | 'rejected';
}


// --- Custom Styles & Data Mapping ---

const STAT_COLORS: { [key: string]: { border: string; bg: string; text: string } } = {
  total: { border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
  pending: { border: "border-amber-500", bg: "bg-amber-50", text: "text-amber-600" }, 
  approved: { border: "border-green-500", bg: "bg-green-50", text: "text-green-600" },
  rejected: { border: "border-red-500", bg: "bg-red-50", text: "text-red-600" },
};

const TASK_STATUS_STYLES: { [key: string]: { bg: string; text: string } } = {
  "Completed": { bg: "bg-green-100", text: "text-green-800" },
  "In Progress": { bg: "bg-sky-100", text: "text-sky-800" }, 
  "Pending": { bg: "bg-gray-200", text: "text-gray-800" }, 
};

interface HRDashboardProps {
  userName?: string;
}

// --- Helper Components ---

// Stat Card Component - Uses the locally extended type
const ProfessionalStatCard = ({ title, value, icon, colorKey }: ExtendedStatCard) => {
  const styles = STAT_COLORS[colorKey]; 
  return (
    <motion.div 
      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} 
      transition={{ duration: 0.2 }} 
      className={`bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300 ${styles.border} border-l-4`}
    >
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${styles.bg} ${styles.text} transition-colors duration-300`}>
        {icon}
      </div>
    </motion.div>
  );
};


// --- Main Dashboard Component ---

export default function HRDashboard({ userName }: HRDashboardProps) {
  const [hrName, setHRName] = useState(userName || "HR Manager");
  // Change state type to ExtendedStatCard[] to match the new object structure
  const [stats, setStats] = useState<ExtendedStatCard[]>([]); 
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setHRName(storedName);

    const fetchLeaves = async () => {
      console.log("Fetching HR data..."); 
      const mockLeaves: LeaveRequest[] = []; 

      let hrLeaves = mockLeaves;
      try {
        const res = await fetch("/api/user/profile/request/leave");
        const data = await res.json();
        if (res.ok && Array.isArray(data.leaves)) {
          hrLeaves = data.leaves.filter((l: LeaveRequest) => l.approvers?.hr !== undefined);
        }
      } catch (error) {
        console.error("Failed to fetch leaves (using mock data):", error);
      }
      setLeaves(hrLeaves);

      const pending = hrLeaves.filter((l: LeaveRequest) => l.status === "pending").length;
      const approved = hrLeaves.filter((l: LeaveRequest) => l.status === "approved").length;
      const rejected = hrLeaves.filter((l: LeaveRequest) => l.status === "rejected").length;
      const totalEmployees = new Set(hrLeaves.map((l: LeaveRequest) => l.email)).size + 50; 

      // Data is created as ExtendedStatCard objects
      setStats([
        { title: "Total Employees", value: totalEmployees, icon: <Users className="w-8 h-8" />, colorKey: "total" },
        { title: "Pending Leaves", value: pending, icon: <FileText className="w-8 h-8" />, colorKey: "pending" },
        { title: "Approved Leaves", value: approved, icon: <CheckCircle className="w-8 h-8" />, colorKey: "approved" },
        { title: "Rejected Leaves", value: rejected, icon: <XCircle className="w-8 h-8" />, colorKey: "rejected" },
      ] as ExtendedStatCard[]); // Assert the array type
    };

    setTasks([
      { title: "Prepare Q3 Performance Review documents", status: "In Progress" },
      { title: "Onboarding session for new hires (Batch 3)", status: "Pending" },
      { title: "Review and update WFH policy guidelines", status: "Completed" },
    ]);

    setProjects([
      { name: "Annual Employee Engagement Survey", progress: 78 },
      { name: "Talent Acquisition Strategy 2026", progress: 42 },
    ]);

    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 lg:p-12">
      {/* Header */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2"
      >
        HR Operations Dashboard
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }} 
        className="text-xl text-gray-500 mb-10"
      >
        Welcome back, <span className="font-semibold text-sky-600">{hrName}</span>.
      </motion.p>

      {/* --- Key Metrics / Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          // stat is now of type ExtendedStatCard
          <ProfessionalStatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Main Section: Leave Requests (2/3 width on large screens) --- */}
        <div className="lg:col-span-2">
          {leaves.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }} 
              className="bg-white rounded-xl shadow-lg p-6 mb-6 h-full"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-sky-600" /> Pending Leave Requests
              </h2>
              <HRLeaveTable leaves={leaves} />
            </motion.div>
          )}
        </div>

        {/* --- Secondary Section: Tasks & Projects (1/3 width on large screens) --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tasks */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }} 
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ListTodo className="w-6 h-6 text-green-600" /> My Priority Tasks
            </h2>
            <ul className="space-y-3">
              {tasks.map((task, idx) => {
                const style = TASK_STATUS_STYLES[task.status] || TASK_STATUS_STYLES["Pending"];
                return (
                  <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-800 truncate">{task.title}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${style.bg} ${style.text}`}>
                      {task.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Projects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }} 
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" /> Strategic Initiatives
            </h2>
            <div className="space-y-4">
              {projects.map((project, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">{project.name}</span>
                    <span className="text-sm font-semibold text-indigo-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-indigo-500 transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}