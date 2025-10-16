"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/logout";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: User | null; 
}

export default function TeamLeadSidebar({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
      className={`bg-teal-600 text-white shadow-md transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-teal-700">
        <button onClick={toggleSidebar} className="cursor-pointer text-gray-200">
          <FiMenu size={24} />
        </button>
      </div>

      {/* Navigation */}
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

        {/* Logout button */}
        <button
          onClick={() => handleLogout(router)}
          className="flex items-center gap-3 p-3 mt-auto hover:bg-red-600 transition-colors text-left w-full"
        >
          <FiLogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
}
