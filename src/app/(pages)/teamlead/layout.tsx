// src/app/(pages)/teamlead/layout.tsx
import React from "react";
import TeamLeadSidebar from "./teamleadsidebar";

export default function TeamLeadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeamLeadSidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
