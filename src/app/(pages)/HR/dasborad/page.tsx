"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HRDashboardContent from "../HRDashboardContent";
import { getUserFromToken, UserPayload } from "@/utils/auth";

export default function HRDashboardPage() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decodedUser = getUserFromToken(token);
    if (!decodedUser) {
      router.push("/login");
      return;
    }

    setUser(decodedUser);
    setLoading(false);
  }, [router]);

  if (loading) return <div>Loading...</div>;

  if (user?.role !== "HR") {
    return <div>Access denied. You are not HR.</div>;
  }
  return <HRDashboardContent />;
}
