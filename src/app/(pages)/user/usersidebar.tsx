"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiFileText,
  FiCoffee,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiLifeBuoy
} from "react-icons/fi";
import { handleLogout } from "@/utils/logout";

interface Props {
  children: ReactNode;
}

export default function UserSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", icon: <FiHome size={20} />, href: "/user" },
    { name: "Profile", icon: <FiUser size={20} />, href: "/user/profile" },
    { name: "Leaves", icon: <FiFileText size={20} />, href: "/user/leaves" },
    { name: "Work From Home", icon: <FiCoffee size={20} />, href: "/user/wfh" },
    { name: "Attendance", icon: <FiCalendar size={20} />, href: "/user/attendance" },
    { name: "Timings", icon: <FiClock size={20} />, href: "/user/timings" },
    { name: "Payroll", icon: <FiDollarSign size={20} />, href: "/user/payroll" },
    { name: "Support", icon: <FiLifeBuoy size={20} />, href: "/user/support" },
    { name: "Settings", icon: <FiSettings size={20} />, href: "/user/preferences" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-purple-900 text-white shadow-md flex flex-col transition-all duration-300 ${
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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
