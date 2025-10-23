"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
// Replaced date-fns with native JS for robustness
// import { format } from "date-fns"; 
// Updated icon imports to use correct names (LuCheck, LuX, LuLoader)
import { LuCalendarPlus, LuCheck, LuX, LuLoader } from "react-icons/lu";

// --- Type Definitions ---
interface DecodedUser {
  id: string;
  role: string;
  email: string;
  name: string;
  teamId?: string; 
}

interface WFHRequest {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  startDate: string;
  endDate: string;
  reason: string;
  workDescription: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

// --- Component Definition ---

// Removed 'user' from destructuring as it was unused (Linter fix)
const WFHRequestForm = ({ onSuccess }: { user: DecodedUser, onSuccess: () => void }) => { 
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    workDescription: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to get today's date in yyyy-MM-dd format (Replaces date-fns usage)
  const getTodayDate = () => new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // API call to the unified backend route
      await axios.post("/api/user/profile/request/wfh", formData); // Removed unused assignment
      toast.success("WFH request submitted successfully!");
      setFormData({ startDate: "", endDate: "", reason: "", workDescription: "" });
      onSuccess(); // Trigger a data refresh on success
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message || "Failed to submit request" : "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-700">
        <LuCalendarPlus className="mr-2" /> Submit New WFH Request
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dates */}
        <div className="flex gap-4">
          <label className="flex-1">
            <span className="text-gray-600">Start Date</span>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={getTodayDate()}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
          <label className="flex-1">
            <span className="text-gray-600">End Date</span>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || getTodayDate()}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
        </div>
        
        {/* Reason */}
        <label className="block">
          <span className="text-gray-600">Short Reason (e.g., Personal, Focus Work)</span>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>

        {/* Work Description */}
        <label className="block">
          <span className="text-gray-600">Detailed Work Plan/Description</span>
          <textarea
            name="workDescription"
            value={formData.workDescription}
            onChange={handleChange}
            required
            rows={4}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </label>

        <motion.button 
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={submitting}
          className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center transition ${submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-md"}`}
        >
          {submitting ? (
            <><LuLoader className="mr-2 animate-spin" /> Submitting...</>
          ) : (
            "Submit Request"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};


// --- Request Table Component (Used by all views) ---

const RequestTable = ({ title, requests, role, fetchRequests, isManagementView = false }: {
  title: string;
  requests: WFHRequest[];
  role: string;
  // fetchRequests signature simplified since we just need to trigger a refresh
  fetchRequests: () => void; 
  isManagementView?: boolean;
}) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // This is a placeholder for the actual approval/rejection endpoint, 
  // which you would need to implement separately (e.g., a PUT handler at /api/user/profile/request/wfh/[id])
  const handleAction = async (id: string, action: "approve" | "reject") => {
    if (action === "reject" && (!rejectReason.trim() || id !== rejectingId)) {
      toast.error("Please provide a rejection reason for the selected request.");
      return;
    }

    // NOTE: This PUT endpoint handler is not defined in the backend code provided, 
    // but the frontend is prepared to call it.
    // Example PUT endpoint: /api/user/profile/request/wfh/[id]
    
    setSubmitting(true);
    try {
      // Placeholder API call to update status
      await axios.put(`/api/user/profile/request/wfh/${id}`, { // Removed unused assignment
        action, 
        rejectionReason: rejectReason, 
        role 
      });
      
      toast.success(`Request ${action}d successfully!`);
      setRejectingId(null);
      setRejectReason("");
      fetchRequests(); // Refresh data in the current view
    } catch (err) {
      console.error(err);
      const message = axios.isAxiosError(err) ? err.response?.data?.message || "Something went wrong" : "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClasses = (status: WFHRequest['status']) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests found for this view.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isManagementView && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Email</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {isManagementView && <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  {isManagementView && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {req.name} <div className="text-xs text-gray-500">{req.email}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {/* Using native JS date formatting */}
                    {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} → {new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {req.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(req.status)}`}>
                      {req.status.toUpperCase()}
                    </span>
                    {req.status === 'rejected' && req.rejectionReason && (
                       <div className="text-xs text-red-500 mt-1 italic">Rejection: {req.rejectionReason}</div>
                    )}
                  </td>
                  {isManagementView && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {req.status === "pending" ? (
                        <div className="flex gap-2 justify-center">
                          <motion.button
                            onClick={() => handleAction(req._id, "approve")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={submitting}
                            className="text-green-600 hover:text-green-900 transition disabled:opacity-50"
                          >
                            <LuCheck size={20} />
                          </motion.button>
                          <motion.button
                            onClick={() => setRejectingId(req._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={submitting}
                            className="text-red-600 hover:text-red-900 transition disabled:opacity-50"
                          >
                            <LuX size={20} />
                          </motion.button>
                        </div>
                      ) : (
                        <span className="text-gray-400">Completed</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800">Reject Request (ID: {rejectingId.slice(-4)})</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection (required)..."
              className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-red-500 focus:border-red-500"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              {/* Corrected: Changed opening tag to motion.button */}
              <motion.button
                onClick={() => { setRejectingId(null); setRejectReason(""); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </motion.button>
              {/* Corrected: Changed opening tag to motion.button */}
              <motion.button
                onClick={() => handleAction(rejectingId, "reject")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={submitting || !rejectReason.trim()}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition ${submitting || !rejectReason.trim() ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
              >
                {submitting ? "Submitting..." : "Confirm Rejection"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};


// --- Main Dashboard Component ---

export default function WorkFromHomeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // State for all requests, regardless of view (My, Team, All)
  const [myRequests, setMyRequests] = useState<WFHRequest[]>([]);
  const [teamRequests, setTeamRequests] = useState<WFHRequest[]>([]);
  const [allRequests, setAllRequests] = useState<WFHRequest[]>([]);
  
  const userRole = user?.role.toLowerCase().replace(/\s+/g, "") || 'user';

  // --- Auth Check on Load ---
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Assume you have an endpoint to get the current authenticated user details
        const res = await axios.get("/api/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        // If 401 Unauthorized, redirect to login to get a fresh token
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          // router.push("/login"); // Uncomment if using Next.js router
        } else {
          toast.error("Failed to load user session.");
        }
      } finally {
        setLoadingUser(false);
      }
    };
    fetchCurrentUser();
  }, [router]);


  // --- Data Fetching Logic (Called by useEffect and on submission/action) ---
  // Using useCallback to create a stable function reference for dependencies
  const fetchRequests = useCallback(async (view: 'my' | 'team' | 'all') => {
    if (!user) return;

    // Determine the state setter based on the view being requested
    const setterMap = {
      'my': setMyRequests,
      'team': setTeamRequests,
      'all': setAllRequests
    };
    const setter = setterMap[view] || setMyRequests;

    try {
      // API call to the unified backend route with view and role filters
      const res = await axios.get(`/api/user/profile/request/wfh?view=${view}&role=${user.role}`);
      setter(res.data.requests || []);
    } catch (error) {
      console.error(`Failed to fetch ${view} requests:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Session expired while fetching data. Please relog.");
        // router.push("/login");
      }
      setter([]); // Clear state on error
    }
  }, [user]); // fetchRequests depends only on the user object

  // Helper function to consolidate the refresh logic
  // Using useCallback to create a stable function reference for dependencies
  const refreshAllRelevantViews = useCallback(() => {
    fetchRequests('my');
    if (userRole === 'teamlead' || userRole === 'team lead') fetchRequests('team');
    if (userRole === 'hr' || userRole === 'admin') fetchRequests('all');
  }, [fetchRequests, userRole]); // refreshAllRelevantViews depends on stable fetchRequests and userRole
  
  // --- Initial Data Fetch & Periodic Refresh ---
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    refreshAllRelevantViews();

    // Set up a periodic refresh (e.g., every 30 seconds)
    const interval = setInterval(refreshAllRelevantViews, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [user, refreshAllRelevantViews]); // Added refreshAllRelevantViews to dependencies


  // --- Loading State ---
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LuLoader className="animate-spin text-indigo-600 text-6xl" />
      </div>
    );
  }

  // --- Render based on Role ---
  
  const isManager = userRole === 'hr' || userRole === 'admin' || userRole === 'teamlead' || userRole === 'team lead';

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-gray-900 mb-2"
      >
        Work From Home Dashboard
      </motion.h1>
      <div className="text-gray-600 mb-8">
        Welcome, **{user?.name || "User"}** (Role: **{user?.role}**).
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className={isManager ? "lg:col-span-1" : "lg:col-span-3"}>
          {/* Form is always available to submit a request */}
          {user && <WFHRequestForm user={user} onSuccess={refreshAllRelevantViews} />}
        </div>
        
        {/* Management View Tables (HR/Admin/TeamLead only) */}
        {isManager && (
          <div className="lg:col-span-2 space-y-8">
            {/* HR/Admin Management View: All Requests */}
            {(userRole === 'hr' || userRole === 'admin') && (
              <RequestTable
                title="ALL Pending & Reviewed Requests (HR/Admin View)"
                requests={allRequests}
                role={userRole}
                fetchRequests={() => fetchRequests('all')}
                isManagementView={true}
              />
            )}

            {/* Team Lead Management View: Team Requests */}
            {(userRole === 'teamlead' || userRole === 'team lead') && (
              <RequestTable
                title={`Team Requests (${user?.teamId || 'No Team'})`}
                requests={teamRequests}
                role={userRole}
                fetchRequests={() => fetchRequests('team')}
                isManagementView={true}
              />
            )}
          </div>
        )}
      </div>

      {/* User's Own Requests (For ALL Roles) */}
      <div className="mt-10">
        <RequestTable
          title="My WFH Requests (Status History)"
          requests={myRequests}
          role={userRole}
          fetchRequests={() => fetchRequests('my')} // Only refresh 'my' view from here
          isManagementView={false}
        />
      </div>
    </div>
  );
}

