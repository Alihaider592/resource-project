"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import { FiUsers, FiFileText, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";

interface Props {
  children: ReactNode;
}

export default function HRSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-green-700 text-white shadow-md transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>HR Panel</span>
          <button onClick={toggleSidebar} className="text-gray-300">
            <FiMenu size={24} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col">
          <Link
            href="/hr/manage"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiUsers size={20} />
            {isOpen && <span>Manage Employees</span>}
          </Link>

          <Link
            href="/hr/attendance"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiFileText size={20} />
            {isOpen && <span>Attendance</span>}
          </Link>

          <Link
            href="/hr/reports"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiFileText size={20} />
            {isOpen && <span>Reports</span>}
          </Link>

          <Link
            href="/hr/settings"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiSettings size={20} />
            {isOpen && <span>Settings</span>}
          </Link>

          <Link
            href="/logout"
            className="flex items-center gap-3 p-3 mt-auto hover:bg-gray-800 transition-colors"
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
