"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/utils/logout";

interface Props {
  children: ReactNode;
}

export default function UserSidebarLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-purple-900 text-white shadow-md transition-all duration-300 flex flex-col ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>Dashboard</span>
          <button onClick={toggleSidebar} className="text-gray-300">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 mt-4">
          <div className="flex flex-col">
            <Link
              href="/user/userdashboard"
              className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
            >
              <FiHome size={20} />
              {isOpen && <span>Home</span>}
            </Link>

            <Link
              href="/user/profile"
              className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
            >
              <FiUser size={20} />
              {isOpen && <span>Profile</span>}
            </Link>

            <Link
              href="/user/settings"
              className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
            >
              <FiSettings size={20} />
              {isOpen && <span>Settings</span>}
            </Link>
          </div>

          {/* Logout Button at bottom */}
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
