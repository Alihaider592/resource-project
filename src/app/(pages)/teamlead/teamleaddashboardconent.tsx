"use client";

import TeamLeadCard from "./teamleadcard";
import { FiClipboard, FiUsers, FiCheckSquare, FiClock } from "react-icons/fi";

export default function TeamLeadDashboardContent() {
  const stats = [
    {
      title: "My Projects",
      value: 5,
      icon: <FiClipboard size={24} />,
      color: "bg-teal-500",
    },
    {
      title: "Active Team Members",
      value: 12,
      icon: <FiUsers size={24} />,
      color: "bg-indigo-500",
    },
    {
      title: "Pending Tasks",
      value: 8,
      icon: <FiCheckSquare size={24} />,
      color: "bg-orange-500",
    },
    {
      title: "Upcoming Deadlines",
      value: 3,
      icon: <FiClock size={24} />,
      color: "bg-red-500",
    },
  ];

  const recentTasks = [
    { task: "Design Landing Page", assigned: "Ali", status: "Pending" },
    { task: "Fix Backend Bug", assigned: "Sara", status: "In Progress" },
    { task: "Team Meeting", assigned: "Team", status: "Completed" },
  ];

  return (
    <div className=" space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Team Lead</h1>
        <p className="text-gray-600 mt-1">
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

      {/* Recent Tasks Table */}
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
              <tr
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-4">{task.task}</td>
                <td className="py-2 px-4">{task.assigned}</td>
                <td className="py-2 px-4">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Team Members Overview */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="font-medium text-gray-800">Ali</p>
              <p className="text-gray-500 text-sm">Frontend Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <p className="font-medium text-gray-800">Sara</p>
              <p className="text-gray-500 text-sm">Backend Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              R
            </div>
            <div>
              <p className="font-medium text-gray-800">Rizwan</p>
              <p className="text-gray-500 text-sm">QA Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
