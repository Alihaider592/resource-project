"use client";

import React, { useEffect, useState, ReactNode } from "react";
import TeamLeadSidebarLayout from "./teamleadsidebar";
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

interface MeResponse {
  user?: User;
  message?: string;
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

        let data: MeResponse = {};
        try {
          data = (await res.json()) as MeResponse;
        } catch (jsonError) {
          console.error("Failed to parse JSON from /api/auth/me", jsonError);
          router.replace("/login");
          return;
        }

        if (!res.ok || !data.user) {
          router.replace("/login");
          return;
        }

        const roleNormalized = data.user.role.replace(/\s+/g, "").toLowerCase();
        if (roleNormalized !== "teamlead") {
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Unexpected error verifying teamlead:", err);
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Unauthorized access</p>
      </div>
    );
  }

  return (
    <TeamLeadSidebarLayout>
      {children}
    </TeamLeadSidebarLayout>
  );
}
