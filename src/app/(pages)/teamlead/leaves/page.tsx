"use client";

import { useState } from "react";
import LeaveApprovalDashboard from "@/app/(frontend)/components/LeavesApprovalsDashboard";
import LeaveRequestPage from "@/app/(frontend)/components/leavesystem";

type ActiveTab = "approvals" | "my";

export default function TeamLeadLeavesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("approvals");

  const primaryColor = "indigo";
  
  const tabClass = (tabName: ActiveTab) =>
    `px-6 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out border-b-2 ${
      activeTab === tabName
        ? `border-${primaryColor}-600 text-${primaryColor}-600 bg-${primaryColor}-50` 
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center">
          <svg
            className={`w-8 h-8 mr-3 text-${primaryColor}-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-5.356m0 0a3 3 0 01-4.821-2.143l-0.816-.816a3 3 0 01-1.422-3.82l-0.428-1.284a3 3 0 011.026-3.82L5 8.143M17 20l-1.644-4.932M17 20h-5.356m0 0a3 3 0 01-4.821-2.143l-0.816-.816a3 3 0 01-1.422-3.82l-0.428-1.284a3 3 0 011.026-3.82L5 8.143M17 20h-5.356m0 0a3 3 0 01-4.821-2.143l-0.816-.816a3 3 0 01-1.422-3.82l-0.428-1.284a3 3 0 011.026-3.82L5 8.143"
            ></path>
          </svg>
          Team Lead Leave Management
        </h1>
        <p className="mt-2 text-lg text-gray-500 max-w-2xl">
          As a Team Lead, **manage and approve leave requests** for your direct reports, or **submit your own requests**.
        </p>
      </header>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6  top-0 bg-gray-50 z-10">
        <button
          onClick={() => setActiveTab("approvals")}
          className={tabClass("approvals")}
        >
          <span className="hidden sm:inline">Team Leave</span> Approvals
        </button>

        <button
          onClick={() => setActiveTab("my")}
          className={tabClass("my")}
        >
          My Leave Requests
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 min-h-[60vh]">
        {activeTab === "approvals" ? (
          <LeaveApprovalDashboard userRole="teamlead" />
        ) : (
          <LeaveRequestPage userRole="teamlead" />
        )}
      </div>
    </div>
  );
}
