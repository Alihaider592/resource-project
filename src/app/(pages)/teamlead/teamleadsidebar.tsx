"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import {
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiGrid,
  FiUser,
  FiClipboard,
  FiBarChart2,
  FiMenu,
} from "react-icons/fi";

interface Props {
  children: ReactNode;
}

export default function TeamLeadSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-teal-600 text-white shadow-md transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-teal-700">
          <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>
            Team Lead
          </span>
          <button onClick={toggleSidebar} className="text-gray-200">
            <FiMenu size={24} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col flex-1">
          <Link
            href="/teamlead"
            className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
          >
            <FiGrid size={20} />
            {isOpen && <span>Dashboard</span>}
          </Link>

          <Link
            href="/teamlead/profile"
            className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
          >
            <FiUser size={20} />
            {isOpen && <span>Profile</span>}
          </Link>

          <Link
            href="/teamlead/team-members"
            className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
          >
            <FiUsers size={20} />
            {isOpen && <span>Team Members</span>}
          </Link>

          <Link
            href="/teamlead/projects"
            className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
          >
            <FiClipboard size={20} />
            {isOpen && <span>Projects</span>}
          </Link>

          <Link
            href="/teamlead/tasks"
            className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
          >
            <FiClipboard size={20} />
            {isOpen && <span>Tasks</span>}
          </Link>

          <Link
            href="/teamlead/reports"
            className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
          >
            <FiBarChart2 size={20} />
            {isOpen && <span>Reports</span>}
          </Link>

          <Link
            href="/teamlead/settings"
            className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
          >
            <FiSettings size={20} />
            {isOpen && <span>Settings</span>}
          </Link>

          <Link
            href="/logout"
            className="flex items-center gap-3 p-3 mt-auto hover:bg-teal-500 transition-colors"
          >
            <FiLogOut size={20} />
            {isOpen && <span>Logout</span>}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
