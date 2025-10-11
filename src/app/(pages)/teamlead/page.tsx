// src/app/(pages)/teamlead/page.tsx
"use client";

import TeamLeadLayout from "./layout";
import TeamLeadDashboardContent from "./teamleaddashboardconent";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function TeamLeadDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/protected/teamlead", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === "teamlead") {
          setUser(data.user);
        } else {
          console.warn("Unauthorized or invalid user:", data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
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
    <TeamLeadLayout>
      <TeamLeadDashboardContent user={user} />
    </TeamLeadLayout>
  );
}
