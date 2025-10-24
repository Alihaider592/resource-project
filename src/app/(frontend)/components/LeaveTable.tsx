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
  approvers: { teamLead?: string | null; hr?: string | null; };
  createdAt: string;
}

interface LeaveTableProps {
  leaves: Leave[];
  filter: string;
  onFilterChange: (filter: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export default function LeaveTable({ leaves, filter, onFilterChange, currentPage, totalPages, onPageChange, itemsPerPage, totalItems }: LeaveTableProps) {

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });

  const renderStatusTag = (status: Leave['status']) => {
    let colorClasses, icon;
    switch(status) {
      case "pending": colorClasses="bg-yellow-100 text-yellow-800 border-yellow-300"; icon=<FiClock className="w-3 h-3 mr-1" />; break;
      case "approved": colorClasses="bg-green-100 text-green-800 border-green-300"; icon=<FiCheckCircle className="w-3 h-3 mr-1" />; break;
      case "rejected": colorClasses="bg-red-100 text-red-800 border-red-300"; icon=<FiXCircle className="w-3 h-3 mr-1" />; break;
      default: colorClasses="bg-gray-100 text-gray-800 border-gray-300"; icon=null;
    }
    return <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${colorClasses}`}>{icon}{status.toUpperCase()}</span>
  };

  const renderLeaveRow = (leave: Leave) => (
    <tr key={leave._id} className="border-b border-gray-100 transition-colors hover:bg-indigo-50/50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{leave.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">{leave.email}</td>
      <td className="px-4 py-3 text-sm text-indigo-600 font-medium">{leave.leaveType}</td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap flex items-center"><FiCalendar className="w-4 h-4 mr-1 text-gray-500" />{formatDate(leave.startDate)} → {formatDate(leave.endDate)}</td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{leave.reason}</td>
      <td className="px-4 py-3 text-sm text-gray-600"><span className="font-medium">{leave.approvers.teamLead || "-"}</span>, {leave.approvers.hr || "-"}</td>
      <td className="px-4 py-3">{renderStatusTag(leave.status)}</td>
      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(leave.createdAt)}</td>
    </tr>
  );

  const getFilterButtonClass = (buttonFilter: string) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${filter === buttonFilter ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`;

  return (
    <section className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 mt-6">
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-xl font-bold text-gray-700">Leave History ({leaves.length})</h3>
        <div className="flex space-x-2">
          {(["all","pending","approved","rejected"] as const).map(btn=>(
            <button key={btn} onClick={()=>onFilterChange(btn)} className={getFilterButtonClass(btn)}>
              {btn.charAt(0).toUpperCase()+btn.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {leaves.length>0 ? (
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 text-gray-600 uppercase text-xs tracking-wider">
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Type</th>
                <th className="px-4 py-3 font-bold">Dates</th>
                <th className="px-4 py-3 font-bold">Reason</th>
                <th className="px-4 py-3 font-bold">Approvers</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Submitted On</th>
              </tr>
            </thead>
            <tbody>{leaves.map(renderLeaveRow)}</tbody>
          </table>
        ) : <div className="text-center py-10 text-gray-500">{filter==="all"?"No leave requests found.":`No ${filter} requests to display.`}</div>}
      </div>

      {totalPages>1 && (
        <div className="flex justify-between items-center px-4 py-3 sm:px-6 border-t border-gray-100">
          <div className="text-sm text-gray-600">Showing {Math.min(totalItems,(currentPage-1)*itemsPerPage+1)} to {Math.min(totalItems,currentPage*itemsPerPage)} of {totalItems} results</div>
          <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button onClick={()=>onPageChange(currentPage-1)} disabled={currentPage===1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Previous</button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(page=>(
              <button key={page} onClick={()=>onPageChange(page)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page===currentPage?'z-10 bg-indigo-600 border-indigo-500 text-white':'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
            ))}
            <button onClick={()=>onPageChange(currentPage+1)} disabled={currentPage===totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </section>
  );
}
