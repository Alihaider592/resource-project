// src/app/(pages)/teamlead/page.tsx
"use client";
import { useEffect, useState } from "react";
import TeamLeadDashboardContent from "./teamleaddashboardconent";

export default function TeamLeadDashboard() {
  const [teamLead, setTeamLead] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // Fetch from backend API (e.g., /api/teamlead/me)
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTeamLead(data.user);
      })
      .catch(() => setTeamLead({ name: "Team Lead" }));
  }, []);

  return (
    <div>
      <TeamLeadDashboardContent />
    </div>
  );
}
