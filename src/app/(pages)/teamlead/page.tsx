"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeamLeadSidebarLayout from "./teamleadsidebar";
import { motion } from "framer-motion";
import { User, Users, FileText, Settings } from "lucide-react";

interface UserType {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

export default function TeamLeadDashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== "teamlead") {
          router.push("/login");
        } else {
          setUser(data.user);
          localStorage.setItem("teamLeadName", data.user.name);
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Loading...</div>;

  const teamLeadName = user?.name || localStorage.getItem("teamLeadName") || "Team Lead";

  return (
    <TeamLeadSidebarLayout>
      <div className="min-h-screen flex flex-col text-gray-900">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center py-16"
        >
          <User className="w-16 h-16 text-teal-600 mb-4" />
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
            Welcome, <span className="text-teal-600">{teamLeadName}</span> 👋
          </h2>
          <p className="text-lg text-gray-600 max-w-lg">
            You can manage your team, review reports, and oversee projects from here.
          </p>
        </motion.div>

        {/* Team Lead Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 pb-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
          >
            <Users className="w-12 h-12 text-teal-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Manage Team</h3>
            <p className="text-gray-600 text-sm">
              View and assign tasks to your team members.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
          >
            <FileText className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <p className="text-gray-600 text-sm">
              Check team performance and project status reports.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
          >
            <Settings className="w-12 h-12 text-teal-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preferences</h3>
            <p className="text-gray-600 text-sm">
              Update your profile, notification, and dashboard settings.
            </p>
          </motion.div>
        </div>
      </div>
    </TeamLeadSidebarLayout>
  );
}
