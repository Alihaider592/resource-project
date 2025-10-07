"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, FileText, BarChart2 } from "lucide-react";

interface AdminPageContentProps {
  adminName?: string;
}

export default function AdminPageContent({ adminName }: AdminPageContentProps) {
  const [name, setName] = useState(adminName || "Admin");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);
  }, []);

  const cards = [
    {
      title: "Manage Users",
      icon: <Users className="w-12 h-12 text-purple-600 mb-4" />,
      description: "Add, edit, and remove users from the system.",
      link: "/admin/manageusers",
    },
    {
      title: "Reports",
      icon: <FileText className="w-12 h-12 text-indigo-600 mb-4" />,
      description: "Access system analytics and usage insights.",
      link: "/admin/reports",
    },
    {
      title: "Analytics",
      icon: <BarChart2 className="w-12 h-12 text-orange-600 mb-4" />,
      description: "View system usage and performance data.",
      link: "/admin/analytics",
    },
  ];

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16"
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-900">
          👋 Welcome back, <span className="text-purple-600">{name}</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-xl">
          You have full access to manage users, view reports, and control system settings.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 pb-20">
        {cards.map((card) => (
          <Link key={card.title} href={card.link}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg flex flex-col items-center text-center cursor-pointer transition"
            >
              {card.icon}
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
