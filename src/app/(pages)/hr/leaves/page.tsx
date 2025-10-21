"use client";

import HRSidebarLayout from "../HRSidebarLayout";
import LeaveApprovalDashboard from "@/app/(forntend)/components/LeavesApprovalsDashboard";

export default function LeavesPage() {
  return (
      <div className="p-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
          Employee Leaves
        </h1>
        <p className="text-gray-600 mb-8">
          Overview of leave requests. Use the dashboard below to manage approvals and check status.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <LeaveApprovalDashboard userRole="hr" />
        </div>
      </div>
  );
}
