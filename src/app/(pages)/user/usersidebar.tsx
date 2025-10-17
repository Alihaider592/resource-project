"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiGrid,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiFileText,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiLifeBuoy,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { handleLogout } from "@/utils/logout";
import RequestSubSidebar from "@/app/(pages)/user/Requestsidebar";

interface Props {
  children: ReactNode;
}

export default function UserSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Dashboard", icon: <FiGrid size={20} />, href: "/user" },
    { name: "Profile", icon: <FiUser size={20} />, href: "/user/profile" },
    { name: "Request", icon: <FiFileText size={20} />, href: "/user/request" },
    { name: "Attendance", icon: <FiCalendar size={20} />, href: "/user/attendance" },
    { name: "Timings", icon: <FiClock size={20} />, href: "/user/timings" },
    { name: "Payroll", icon: <FiDollarSign size={20} />, href: "/user/payroll" },
    { name: "Support", icon: <FiLifeBuoy size={20} />, href: "/user/support" },
    { name: "Settings", icon: <FiSettings size={20} />, href: "/user/preferences" },
  ];

  const showRequestSidebar = pathname.startsWith("/user/request");

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Primary Sidebar */}
      <div
        className={`bg-purple-900 text-white shadow-md flex flex-col transition-all duration-300 z-20 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-700">
          {isOpen && <span className="text-xl font-bold">Dashboard</span>}
          <button onClick={toggleSidebar} className="text-gray-300">
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
                className={`flex items-center gap-3 p-3 transition-colors hover:bg-purple-800 rounded-lg mx-2 my-1 ${
                  isActive ? "bg-purple-800" : ""
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

      {/* ✅ Smooth Animated Request Sidebar */}
      <AnimatePresence>
        {showRequestSidebar && (
          <motion.div
            key="request-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="bg-purple-800 h-full text-white shadow-md overflow-hidden z-10"
          >
            <RequestSubSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
