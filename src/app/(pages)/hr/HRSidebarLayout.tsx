"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import { FiUsers, FiFileText, FiSettings, FiLogOut, FiMenu, FiGrid, FiUser, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { handleLogout } from "@/utils/logout";
import { useRouter, usePathname } from "next/navigation";
import RequestSubSidebar from "./RequestSubSidebar";

interface Props {
  children: ReactNode;
}

export default function HRSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <FiGrid size={20} />, href: "/hr" },
    { name: "Profile", icon: <FiUser size={20} />, href: "/hr/profile" },
    { name: "Add Employee", icon: <FiPlus size={20} />, href: "/hr/addemployee" },
    { name: "Manage Employees", icon: <FiUsers size={20} />, href: "/hr/manage" },
    { name: "Attendance", icon: <FiFileText size={20} />, href: "/hr/attendance" },
    { name: "Reports", icon: <FiFileText size={20} />, href: "/hr/reports" },
    { name: "Employee Requests", icon: <FiFileText size={20} />, href: "/hr/employee-requests" },
    { name: "Settings", icon: <FiSettings size={20} />, href: "/hr/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Primary Sidebar */}
      <div className={`bg-green-700 text-white shadow-md flex flex-col transition-all duration-300 z-20 ${isOpen ? "w-60" : "w-20"}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-600">
          {isOpen && <span className="text-xl font-bold">HR Panel</span>}
          <button onClick={toggleSidebar} className="text-gray-200">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg mx-2 my-1 hover:bg-green-600 transition-colors ${
                  isActive ? "bg-green-600" : ""
                }`}
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={() => handleLogout(router)}
            className="flex items-center gap-3 p-3 mt-auto hover:bg-red-600 transition-colors text-left w-full rounded-lg mx-2 mb-4"
          >
            <FiLogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Sub Sidebar */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 220, opacity: 1 }}
        transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}
        className="bg-green-600 h-full text-white shadow-md overflow-hidden z-10"
      >
        <RequestSubSidebar />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
