"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import {
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiGrid,
  FiUser,
  FiClipboard,
  FiBarChart2,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { handleLogout } from "@/utils/logout";
import TeamLeadRequestSubSidebar from "./Requessidebar";

interface Props {
  children: ReactNode;
}

export default function TeamLeadSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Dashboard", icon: <FiGrid size={20} />, href: "/teamlead" },
    { name: "Profile", icon: <FiUser size={20} />, href: "/teamlead/profile" },
    { name: "Team Members", icon: <FiUsers size={20} />, href: "/teamlead/team-members" },
    { name: "Projects", icon: <FiClipboard size={20} />, href: "/teamlead/projects" },
    { name: "Tasks", icon: <FiClipboard size={20} />, href: "/teamlead/tasks" },
    { name: "Reports", icon: <FiBarChart2 size={20} />, href: "/teamlead/reports" },
    { name: "Team Requests", icon: <FiFileText size={20} />, href: "/teamlead/teamrequests" },
    { name: "Settings", icon: <FiSettings size={20} />, href: "/teamlead/settings" },
  ];

  // Show sub-sidebar if user is on any team request page
  const showRequestSidebar =
    pathname.startsWith("/teamlead/teamrequests") ||
    pathname.startsWith("/teamlead/leaves") ||
    pathname.startsWith("/teamlead/employee-requests");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Primary Sidebar */}
      <div
        className={`bg-teal-700 text-white shadow-md flex flex-col transition-all duration-300 z-20 ${
          isOpen ? "w-60" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-teal-600">
          {isOpen && <span className="text-xl font-bold">Team Lead Panel</span>}
          <button onClick={toggleSidebar} className="text-gray-200">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-teal-600 shadow-lg" : "hover:bg-teal-600 hover:scale-105"
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
            className="flex items-center gap-3 p-3 mt-auto mx-2 mb-4 rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-200"
          >
            <FiLogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Sub-Sidebar */}
      <AnimatePresence>
        {showRequestSidebar && (
          <motion.div
            key="teamlead-request-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
            className="bg-teal-600 h-full text-white shadow-md overflow-y-auto z-10"
          >
            <TeamLeadRequestSubSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
