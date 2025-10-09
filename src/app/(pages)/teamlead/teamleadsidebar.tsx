"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import { FiUsers, FiFileText, FiSettings, FiLogOut, FiHome, FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/logout";

interface Props {
  children: ReactNode;
}

export default function TeamLeadSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-teal-600 text-white shadow-md transition-all duration-300 flex flex-col ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-teal-500">
          <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>Team Lead</span>
          <button onClick={toggleSidebar} className="text-gray-200">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 mt-4">
          <div className="flex flex-col">
            <Link
              href="/teamlead/dashboard"
              className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
            >
              <FiHome size={20} />
              {isOpen && <span>Dashboard</span>}
            </Link>

            <Link
              href="/teamlead/team"
              className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
            >
              <FiUsers size={20} />
              {isOpen && <span>Team Members</span>}
            </Link>

            <Link
              href="/teamlead/reports"
              className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
            >
              <FiFileText size={20} />
              {isOpen && <span>Reports</span>}
            </Link>

            <Link
              href="/teamlead/settings"
              className="flex items-center gap-3 p-3 hover:bg-teal-500 transition-colors"
            >
              <FiSettings size={20} />
              {isOpen && <span>Settings</span>}
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={() => handleLogout(router)}
            className="flex items-center gap-3 p-3 mt-auto hover:bg-red-600 transition-colors text-left w-full"
          >
            <FiLogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
