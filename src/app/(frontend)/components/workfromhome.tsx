"use client";

import React, { useState, useEffect } from "react";
import WFHForm from "./form/wfhform";
import WFHTable from "./WFHTable";

type UserRole = "user" | "teamlead" | "hr";
type ViewType = "my" | "all";

export default function WorkFromHomePage() {
  const [view, setView] = useState<ViewType>("my");
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole;
    const storedEmail = localStorage.getItem("userEmail") || "";

    if (storedRole === "user" || storedRole === "teamlead" || storedRole === "hr") {
      setUserRole(storedRole);
    }
    setUserEmail(storedEmail);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
        Work From Home Requests
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            view === "all" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Requests
        </button>
        <button
          onClick={() => setView("my")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            view === "my" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          My Requests
        </button>
      </div>

      {view === "my" && (
        <div className="mb-6">
          <WFHForm
            userRole={userRole}
            onRequestSubmitted={() => window.location.reload()}
          />
        </div>
      )}

      <WFHTable userRole={userRole} userEmail={userEmail} view={view} />
    </div>
  );
}
