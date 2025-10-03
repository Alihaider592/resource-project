"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogOut, User, MessageCircle, Settings } from "lucide-react";

export default function UserPage() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Example: replace with JWT/localStorage fetch
    const storedName = localStorage.getItem("userName") || "User";
    setUserName(storedName);
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center text-center py-16"
      >
        <User className="w-16 h-16 text-purple-600 mb-4" />
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
          Welcome, <span className="text-purple-600">{userName}</span> 👋
        </h2>
        <p className="text-lg text-gray-600 max-w-lg">
          We’re glad to have you here. Explore your profile, connect with
          support, or manage your preferences.
        </p>
      </motion.div>

      {/* User Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 pb-20">
        <Link href={'/user/profile'}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
        >
          <User className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">My Profile</h3>
          <p className="text-gray-600 text-sm">
            View and update your account details.
          </p>
        </motion.div>

        </Link>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
        >
          <MessageCircle className="w-12 h-12 text-indigo-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <p className="text-gray-600 text-sm">
            Contact our team for help and guidance.
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
        >
          <Settings className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Preferences</h3>
          <p className="text-gray-600 text-sm">
            Customize notifications and privacy settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
