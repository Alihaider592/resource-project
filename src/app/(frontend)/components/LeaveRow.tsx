"use client";
import React from "react";
import { FiCheckCircle, FiClock, FiXCircle, FiCalendar } from "react-icons/fi";

export interface Leave {
  _id: string;
  name: string;
  email: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvers: { teamLead?: string | null; hr?: string | null };
  createdAt: string;
}

interface LeaveRowProps {
  leave: Leave;
  formatDate: (date: string) => string;
}

export const LeaveRow: React.FC<LeaveRowProps> = ({ leave, formatDate }) => {
  const renderStatusTag = (status: Leave["status"]) => {
    let colorClasses, icon;
    switch (status) {
      case "pending":
        colorClasses = "bg-yellow-100 text-yellow-800 border-yellow-300";
        icon = <FiClock className="w-3 h-3 mr-1" />;
        break;
      case "approved":
        colorClasses = "bg-green-100 text-green-800 border-green-300";
        icon = <FiCheckCircle className="w-3 h-3 mr-1" />;
        break;
      case "rejected":
        colorClasses = "bg-red-100 text-red-800 border-red-300";
        icon = <FiXCircle className="w-3 h-3 mr-1" />;
        break;
      default:
        colorClasses = "bg-gray-100 text-gray-800 border-gray-300";
        icon = null;
    }
    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${colorClasses}`}>
        {icon}
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-indigo-50/50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{leave.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">{leave.email}</td>
      <td className="px-4 py-3 text-sm text-indigo-600 font-medium">{leave.leaveType}</td>
      <td className="px-4 py-3 text-sm text-gray-700 flex items-center">
        <FiCalendar className="w-4 h-4 mr-1 text-gray-500" />
        {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{leave.reason}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{leave.approvers.teamLead || "-"}, {leave.approvers.hr || "-"}</td>
      <td className="px-4 py-3">{renderStatusTag(leave.status)}</td>
      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(leave.createdAt)}</td>
    </tr>
  );
};
