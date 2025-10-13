"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeamLeadDashboardContent from "./teamleaddashboardconent";
export default function TeamLeadDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "teamlead") {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      {/* <h1 className="text-3xl font-bold">Teamlead Dashboard</h1>
      <p>Welcome, Teamlead! You can now manage your team here.</p> */}
      <TeamLeadDashboardContent/>
    </div>
  );
}
