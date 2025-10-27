"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import WorkFromHomeDashboard from "@/app/(frontend)/components/dashboard/wfh/WorkFromHomeDashboard";
import { WorkFromHomeForm } from "@/app/(frontend)/components/form/WorkFromHomeForm";
import MyWFHRequests from "@/app/(frontend)/components/dashboard/wfh/MyWFHRequests";

interface DecodedUser {
  name: string;
  email: string;
  role?: string;
}

export default function HRWFHPage() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: "hr" | "teamlead";
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"manage" | "myleaves">("myleaves");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedUser>(token);
        const role = decoded.role?.toLowerCase();
        if (role === "hr" || role === "teamlead") {
          setUser({
            name: decoded.name,
            email: decoded.email,
            role: role as "hr" | "teamlead",
          });
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-600">
        Only HR or TeamLead can view this page.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Work From Home — {user.role.toUpperCase()}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("myleaves")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "myleaves"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Leaves
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "manage"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Manage Requests
          </button>
        </div>
      </div>

      {activeTab === "myleaves" ? (
        <div className="space-y-8">
          <WorkFromHomeForm user={user} />
          <MyWFHRequests user={user} />
        </div>
      ) : (
        <WorkFromHomeDashboard user={user} />
      )}
    </div>
  );
}
