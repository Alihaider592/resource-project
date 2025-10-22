"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  MessageCircle,
  Settings,
  CreditCard,
  Calendar,
  Clock,
  Home,
  FileText
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  employeeId?: string;
}

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode; // <-- Changed from JSX.Element
  href?: string;
  color: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const colorMap: Record<string, string> = {
    purple: "border-purple-500 text-purple-500",
    blue: "border-blue-500 text-blue-500",
    teal: "border-teal-500 text-teal-500",
    indigo: "border-indigo-500 text-indigo-500",
    green: "border-green-500 text-green-500",
    pink: "border-pink-500 text-pink-500",
    orange: "border-orange-500 text-orange-500",
    gray: "border-gray-500 text-gray-500",
  };

  const cards: DashboardCard[] = [
    { title: "My Profile", description: "View and update your account details.", icon: <User className="w-12 h-12 mb-3" />, href: "/user/profile", color: "purple" },
    { title: "Leaves", description: "Apply and track your leaves.", icon: <FileText className="w-12 h-12 mb-3" />, href: "/user/request/leaves", color: "blue" },
    { title: "Work From Home", description: "Request work from home days.", icon: <Home className="w-12 h-12 mb-3" />, href: "/user/request/whf", color: "teal" },
    { title: "Payroll", description: "View your salary and payments.", icon: <CreditCard className="w-12 h-12 mb-3" />, href: "/user/payroll", color: "green" },
    { title: "Attendance", description: "Check attendance and working hours.", icon: <Calendar className="w-12 h-12 mb-3" />, href: "/user/attendance", color: "indigo" },
    { title: "Timings", description: "View shift schedules.", icon: <Clock className="w-12 h-12 mb-3" />, href: "/user/timings", color: "pink" },
    { title: "Support", description: "Contact our support team.", icon: <MessageCircle className="w-12 h-12 mb-3" />, href: "/user/support", color: "orange" },
    { title: "Preferences", description: "Manage notifications and settings.", icon: <Settings className="w-12 h-12 mb-3" />, href: "/user/preferences", color: "gray" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (!data.user || data.user.role?.toLowerCase() !== "simple user") {
          localStorage.removeItem("token");
          toast.error("Unauthorized access.");
          router.push("/login");
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-md rounded-b-3xl p-8 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700">
              {user?.firstName?.[0] ?? "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h1>
              <p className="text-gray-600 capitalize">{user?.role}</p>
              <p className="text-gray-500 text-sm">{user?.department ?? "Department N/A"}</p>
              <p className="text-gray-500 text-sm">Employee ID: {user?.employeeId ?? "N/A"}</p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 pt-10 pb-16">
          {cards.map((card) => {
            const classes = colorMap[card.color] || colorMap.gray;
            return card.href ? (
              <Link href={card.href} key={card.title}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition border-t-4 ${classes}`}
                >
                  <div>{card.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-gray-500 text-sm">{card.description}</p>
                </motion.div>
              </Link>
            ) : (
              <motion.div
                key={card.title}
                whileHover={{ scale: 1.05 }}
                className={`bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center cursor-pointer transition border-t-4 ${classes}`}
              >
                <div>{card.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
