"use client";

import React, { ReactNode, useEffect, useState } from "react";
import TeamLeadSidebarLayout from "./teamleadsidebar";
import { useRouter } from "next/navigation";

interface TeamLeadLayoutProps {
  children: ReactNode;
}

interface UserType {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

export default function TeamLeadLayout({ children }: TeamLeadLayoutProps) {
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
          router.push("/login"); // Redirect non-teamlead
        } else {
          setUser(data.user);
          localStorage.setItem("teamLeadName", data.user.name);
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return <TeamLeadSidebarLayout>{children}</TeamLeadSidebarLayout>;
}
