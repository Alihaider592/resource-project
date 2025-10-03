"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UserCog, Users, BarChart3, LogOut } from "lucide-react";

export default function AdminPage() {
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    // Example: replace with JWT/localStorage fetch
    const storedName = localStorage.getItem("adminName") || "Admin";
    setAdminName(storedName);
  }, []);

  return (
    <div className="min-h-screen flex flex-col  text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center text-center py-16"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-900">
          👋 Welcome back,{" "}
          <span className="text-purple-600">{adminName}</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-xl">
          You have full access to manage users, view reports, and control system
          settings.
        </p>
      </motion.div>

      {/* Dashboard Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 pb-20">
        <Link href={'/admin/manageusers'}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
        >
          <Users className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
          <p className="text-gray-600 text-sm">
            Add, edit, and remove users from the system.
          </p>
        </motion.div>
          </Link>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
        >
          <BarChart3 className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">View Reports</h3>
          <p className="text-gray-600 text-sm">
            Access system analytics and usage insights.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
        >
          <UserCog className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">System Settings</h3>
          <p className="text-gray-600 text-sm">
            Configure application preferences and security.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
