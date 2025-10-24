"use client";
import { useState } from "react";
import LeaveRequestPage from "@/app/(frontend)/components/leavesystem";
import LeaveApprovalDashboard from "@/app/(frontend)/components/LeavesApprovalsDashboard";
type ActiveTab = "employee" | "my";
export default function LeavesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("employee");
  const primaryColor = "indigo"; 
  const primaryColorHex = "5B6BFD"; 
  const tabClass = (tabName: ActiveTab) =>
    `px-6 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out border-b-2 ${
      activeTab === tabName
        ? `border-${primaryColor}-600 text-${primaryColor}-600 bg-${primaryColor}-50`
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" 
    }`;
  return (
    <div className="">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          Leave Management System
        </h1>
        <p className="mt-2 text-lg text-gray-500 max-w-2xl">
          Efficiently manage and monitor all employee leave requests and balances.
          Use the tabs below to switch between approval dashboard and personal
          leave requests.
        </p>
      </header>
      
      <div className="flex border-b border-gray-200 mb-6 sticky top-0 bg-gray-50 z-10">
        <button
          onClick={() => setActiveTab("employee")}
          className={tabClass("employee")}
        >
          <span className="hidden sm:inline">All Employee</span> Approvals
        </button>

        <button
          onClick={() => setActiveTab("my")}
          className={tabClass("my")}
        >
          My Leave Requests
        </button>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 min-h-[60vh]">
        {activeTab === "employee" ? (
          <LeaveApprovalDashboard userRole="hr" />
        ) : (
          <LeaveRequestPage userRole="hr" />
        )}
      </div>
    </div>
  );
}