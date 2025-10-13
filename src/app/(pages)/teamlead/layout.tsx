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

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch user:", res.status);
          router.replace("/login");
          return;
        }

        const data = await res.json();

        if (!data.user || data.user.role.toLowerCase() !== "teamlead") {
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Error verifying teamlead:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeamLeadSidebar user={user} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
