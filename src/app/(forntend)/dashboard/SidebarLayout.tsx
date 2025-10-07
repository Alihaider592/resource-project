"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiPlus,
} from "react-icons/fi";

interface Props {
  children: ReactNode;
}

export default function SidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-purple-900 text-white shadow-md transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>
            Admin Panel
          </span>
          <button onClick={toggleSidebar} className="text-gray-300">
            <FiMenu size={24} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col">
          <Link
            href="/admin/manageusers"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiUsers size={20} />
            {isOpen && <span>Manage Users</span>}
          </Link>

          <Link
            href="/admin/addusers"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiPlus size={20} />
            {isOpen && <span>Add Users</span>}
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiBarChart2 size={20} />
            {isOpen && <span>Analytics</span>}
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiFileText size={20} />
            {isOpen && <span>Reports</span>}
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiSettings size={20} />
            {isOpen && <span>Settings</span>}
          </Link>

          <Link
            href="/admin/logout"
            className="flex items-center gap-3 p-3 mt-auto hover:bg-gray-800 transition-colors"
          >
            <FiLogOut size={20} />
            {isOpen && <span>Logout</span>}
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
