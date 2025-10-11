"use client";

import React, { useEffect, useState, ReactNode } from "react";
import TeamLeadSidebar from "./teamleadsidebar";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamLeadLayout({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        // Updated API path according to your folder structure
        const res = await fetch("/api/admin/protectedRoute", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();

        // Ensure the user exists and has the 'teamlead' role (case-insensitive)
        if (!data.user || data.user.role.toLowerCase() !== "teamlead") {
          router.replace("/login");
          return;
        }

        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error verifying teamlead:", err);
        router.replace("/login");
      }
    };

    fetchUser();
  }, [router]);

  // Show a loading state while verifying the user
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Pass the user info to the sidebar */}
      <TeamLeadSidebar user={user} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
