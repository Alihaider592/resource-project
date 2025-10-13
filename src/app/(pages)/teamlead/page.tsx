"use client";

import TeamLeadLayout from "./layout";
import TeamLeadDashboardContent from "./teamleaddashboardconent";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamLeadDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Handle non-OK responses
        if (!res.ok) {
          let errData;
          try {
            errData = await res.json();
          } catch {
            errData = { message: await res.text() };
          }
          console.error("Failed to fetch user:", errData);
          router.replace("/login");
          return;
        }

        // Parse JSON safely
        let data;
        try {
          data = await res.json();
        } catch {
          console.error("Invalid JSON from server");
          router.replace("/login");
          return;
        }

        // Check user role
        if (!data.user || data.user.role.toLowerCase() !== "teamlead") {
          router.replace("/login");
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error("Network or server error:", err);
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
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Unauthorized access</p>
      </div>
    );
  }

  return (
    <TeamLeadLayout>
      <TeamLeadDashboardContent />
    </TeamLeadLayout>
  );
}
