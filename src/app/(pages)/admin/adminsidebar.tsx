"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiHome,
  FiUser,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/logout";

interface Props {
  children: ReactNode;
}

export default function AdminDashboardLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleViewProfile = () => {
    const userId = localStorage.getItem("userId"); // 👈 store on login
    if (userId) {
      router.push(`/profile/${userId}`); // navigate to own profile
    } else {
      alert("User ID not found. Please login again.");
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-purple-900 text-white shadow-md transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-xl font-bold ${!isSidebarOpen && "hidden"}`}>
            Admin Panel
          </span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-300 cursor-pointer"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-col h-full">
          <Link
            href="/admin"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiHome size={20} />
            {isSidebarOpen && <span>Home</span>}
          </Link>

          {/* ✅ Updated Dynamic Profile Button */}
          <Link
          href="/admin/profile"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors text-left w-full"
          >
            <FiUser size={20} />
            {isSidebarOpen && <span>Profile</span>}
          </Link>

          <Link
            href="/admin/manageusers"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiUsers size={20} />
            {isSidebarOpen && <span>Manage Users</span>}
          </Link>

          <Link
            href="/admin/addusers"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiPlus size={20} />
            {isSidebarOpen && <span>Add Users</span>}
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiBarChart2 size={20} />
            {isSidebarOpen && <span>Analytics</span>}
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiFileText size={20} />
            {isSidebarOpen && <span>Reports</span>}
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
          >
            <FiSettings size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </Link>

          {/* Logout */}
          <button
            onClick={() => handleLogout(router)}
            className="flex items-center gap-3 p-3 mt-auto hover:bg-red-700 transition-colors text-left w-full"
          >
            <FiLogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
