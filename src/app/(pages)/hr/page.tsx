"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HRDashboardContent from "./HRDashboardContent";
import HRSidebarLayout from "./HRSidebarLayout";

interface User {
  name: string;
  email: string;
  role: "admin" | "HR" | "Team Lead" | "simple user";
}

export default function HRDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
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
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== "HR") {
          router.push("/login");
        } else {
          localStorage.setItem("userName", data.user.name);
          setUser(data.user);
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <HRSidebarLayout>
<HRDashboardContent userName="HR" />
    </HRSidebarLayout>
  );
}
