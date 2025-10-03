"use client";

import React, { useState } from "react";
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`bg-teal-500-900 text-white shadow-md transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className={`text-xl font-bold ${!isOpen && "hidden"}`}>
            Dashboard
          </span>
          <button onClick={toggleSidebar} className="text-white cursor-pointer">
            <FiMenu size={24} />
          </button>
        </div>
        <nav className="mt-4 flex flex-col">
          <a
            href="#"
            className="flex items-center gap-3 p-3 hover:bg-gray-600 transition-colors"
          >
            <FiHome size={20} />
            {isOpen && <span>Home</span>}
          </a>
          <a
            href="#"
            className="flex  items-center gap-3 p-3 hover:bg-gray-600 transition-colors"
          >
            <FiUser size={20} />
            {isOpen && <span>Profile</span>}
          </a>
          <a
            href="#"
            className="flex items-center gap-3  p-3 hover:bg-gray-600 transition-colors"
          >
            <FiSettings size={20} />
            {isOpen && <span>Settings</span>}
          </a>
          <a
            href="#"
            className="flex items-center gap-3  p-3 mt-auto hover:bg-gray-600 transition-colors"
          >
            <FiLogOut size={20} />
            {isOpen && <span>Logout</span>}
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
};

export default SidebarLayout;
