"use client";
import LeaveApprovalDashboard from "@/app/(forntend)/components/LeavesApprovalsDashboard";

export default function TeamLeadLeavesPage() {
  return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Team Leave Requests</h1>
        <p className="mb-8 text-gray-600">Manage and approve leave requests from your team members.</p>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <LeaveApprovalDashboard userRole="teamlead" />
        </div>
      </div>
  );
}
