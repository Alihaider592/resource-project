// "use client";

// import React, { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   FiClock,
//   FiCheckCircle,
//   FiXCircle,
//   FiSend,
//   FiChevronDown,
//   FiChevronUp,
//   FiFilter,
// } from "react-icons/fi";

// interface Leave {
//   _id: string;
//   name: string;
//   email: string;
//   leaveType: string;
//   startDate: string;
//   endDate: string;
//   reason: string;
//   status: "pending" | "approved" | "rejected";
//   approvers: {
//     teamLead?: string | null;
//     hr?: string | null;
//   };
//   approverStatus?: { [key: string]: "approve" | "reject" };
//   approverComments?: {
//     approver: string;
//     action: "approve" | "reject";
//     comment?: string;
//     date: string;
//   }[];
// }

// interface Props {
//   userRole: "teamlead" | "hr" | "user";
// }

// const LeaveApprovalDashboard: React.FC<Props> = ({ userRole }) => {
//   const [leaves, setLeaves] = useState<Leave[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<string | null>(null);
//   const [comment, setComment] = useState<{ [key: string]: string }>({});
//   const [expandedLeaveId, setExpandedLeaveId] = useState<string | null>(null);

//   // 🆕 Filter state
//   const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

//   // -------------------- UI Helpers --------------------
//   const getStatusClasses = (status: Leave["status"]) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-300";
//       case "approved":
//         return "bg-green-100 text-green-800 border-green-300";
//       case "rejected":
//         return "bg-red-100 text-red-800 border-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-300";
//     }
//   };

//   const getStatusIcon = (status: Leave["status"]) => {
//     switch (status) {
//       case "pending":
//         return <FiClock className="w-4 h-4 mr-1" />;
//       case "approved":
//         return <FiCheckCircle className="w-4 h-4 mr-1" />;
//       case "rejected":
//         return <FiXCircle className="w-4 h-4 mr-1" />;
//       default:
//         return null;
//     }
//   };

//   const handleToggleExpand = (leaveId: string) => {
//     setExpandedLeaveId((prev) => (prev === leaveId ? null : leaveId));
//   };

//   // -------------------- Fetch leaves (only own requests) --------------------
//   useEffect(() => {
//     const fetchLeaves = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please log in again.");
//           setLoading(false);
//           return;
//         }

//         const res = await fetch("/api/user/profile/request/leave", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error(`Failed to fetch leaves (${res.status})`);

//         const data = await res.json();
//         setLeaves(Array.isArray(data.leaves) ? data.leaves : []);
//       } catch (error) {
//         console.error("Error fetching leaves:", error);
//         toast.error("Could not load your leave requests.");
//         setLeaves([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLeaves();
//   }, []);

//   // -------------------- Handle approve/reject --------------------
//   const handleAction = async (leaveId: string, action: "approve" | "reject") => {
//     if (action === "reject" && (!comment[leaveId] || comment[leaveId].trim() === "")) {
//       toast.error("Please provide a comment before rejecting.");
//       return;
//     }

//     try {
//       setActionLoading(leaveId);
//       const token = localStorage.getItem("token");

//       const res = await fetch("/api/user/profile/request/leave", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           leaveId,
//           action,
//           role: userRole,
//           comment: comment[leaveId] || "",
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setLeaves((prev) =>
//           prev.map((l) => (l._id === leaveId ? data.leave : l))
//         );
//         setComment({ ...comment, [leaveId]: "" });
//         setExpandedLeaveId(null);
//         toast.success(`Leave request ${action}d successfully!`);
//       } else {
//         toast.error(data.message || "Failed to update leave.");
//       }
//     } catch (err) {
//       console.error("Error updating leave:", err);
//       toast.error("An unexpected error occurred.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // -------------------- Filtered leaves --------------------
//   const filteredLeaves =
//     filter === "all"
//       ? leaves
//       : leaves.filter((leave) => leave.status === filter);

//   // -------------------- Loading / Empty States --------------------
//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-40">
//         <FiClock className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
//         <p className="text-gray-600 font-medium">Loading leave requests...</p>
//       </div>
//     );

//   if (!filteredLeaves.length)
//     return (
//       <div className="text-center p-10 mt-10 border border-dashed border-gray-300 rounded-xl bg-white shadow-lg max-w-5xl mx-auto">
//         <FiSend className="w-10 h-10 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-700">No Leaves Found</h3>
//         <p className="text-gray-500">No leave requests match this filter.</p>
//       </div>
//     );

//   // -------------------- Main UI --------------------
//   return (
//     <>
//       <Toaster position="top-center" />
//       <div className="p-4 sm:p-8 min-h-screen font-sans">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-teal-500 pl-4">
//             Leave Approval Dashboard
//           </h1>

//           {/* 🆕 Filter Dropdown */}
//           <div className="mt-4 sm:mt-0 flex items-center space-x-2">
//             <FiFilter className="text-gray-600" />
//             <select
//               value={filter}
//               onChange={(e) =>
//                 setFilter(e.target.value as "all" | "pending" | "approved" | "rejected")
//               }
//               className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
//             >
//               <option value="all">All Requests</option>
//               <option value="pending">Pending</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         <div className="max-w-5xl mx-auto overflow-x-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                   Dates
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {filteredLeaves.map((leave, index) => {
//                 const isExpanded = expandedLeaveId === leave._id;
//                 const approverDecision = leave.approverStatus?.[userRole];
//                 const hasActed = !!approverDecision;

//                 return (
//                   <React.Fragment key={leave._id}>
//                     <tr
//                       className={`transition-all duration-200 cursor-pointer ${
//                         isExpanded
//                           ? "bg-indigo-50/70"
//                           : index % 2 === 0
//                           ? "bg-white hover:bg-gray-50"
//                           : "bg-gray-50 hover:bg-gray-100"
//                       }`}
//                       onClick={() => handleToggleExpand(leave._id)}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-semibold text-gray-900">
//                           {leave.name}
//                         </div>
//                         <div className="text-xs text-gray-500">{leave.email}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
//                         {leave.leaveType}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {new Date(leave.startDate).toLocaleDateString()} -{" "}
//                         {new Date(leave.endDate).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusClasses(
//                             leave.status
//                           )}`}
//                         >
//                           {getStatusIcon(leave.status)}
//                           {leave.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button className="flex items-center justify-end text-indigo-600 hover:text-indigo-800 transition-colors w-full">
//                           {isExpanded ? "Collapse" : "View Details"}
//                           {isExpanded ? (
//                             <FiChevronUp className="w-5 h-5 ml-1" />
//                           ) : (
//                             <FiChevronDown className="w-5 h-5 ml-1" />
//                           )}
//                         </button>
//                       </td>
//                     </tr>

//                     {isExpanded && (
//                       <tr className="bg-white border-t border-indigo-200/50 shadow-inner">
//                         <td colSpan={5} className="p-6">
//                           {/* Existing details (Reason, Approvers, Comments, Action buttons) */}
//                           {/* --- keep same content as before --- */}
//                           {/* For brevity, you can keep your original expanded row content here */}
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LeaveApprovalDashboard;
