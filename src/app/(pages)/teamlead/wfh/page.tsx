"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FiCalendar, FiBriefcase, FiUser, FiHome, FiPlus, FiX } from "react-icons/fi";
// Assume these components are correctly implemented and available
import WorkFromHomeDashboard from "@/app/(frontend)/components/dashboard/wfh/WorkFromHomeDashboard";
import { WorkFromHomeForm } from "@/app/(frontend)/components/form/WorkFromHomeForm";
import MyWFHRequests from "@/app/(frontend)/components/dashboard/wfh/MyWFHRequests";

// Custom Icon for the header
const IconHome = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
);

interface DecodedUser {
  name: string;
  email: string;
  role?: string;
}

interface UserState {
  name: string;
  email: string;
  role: "hr" | "teamlead";
}

export default function TeamLeadWFHPage() {
  const [user, setUser] = useState<UserState | null>(null);
  const [activeTab, setActiveTab] = useState<"manage" | "myleaves">("myleaves");
  const [showForm, setShowForm] = useState(false); // Controls the form drawer visibility

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white border border-red-200 rounded-xl shadow-lg">
          <FiUser className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-xl font-semibold text-gray-700">Access Restricted</p>
          <p className="text-md text-gray-500 mt-1">Only HR or TeamLead can view this page.</p>
        </div>
      </div>
    );
    
  // Helper for stylish tab buttons
  const TabButton = ({ name, icon, tabKey }: { name: string; icon: React.ReactNode; tabKey: "manage" | "myleaves" }) => {
      const isActive = activeTab === tabKey;
      
      return (
        <button
          onClick={() => setActiveTab(tabKey)}
          className={`
            flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 text-base rounded-t-lg
            ${
              isActive
                ? "bg-white text-purple-600 shadow-md border-t border-x border-gray-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-b border-gray-300"
            }
          `}
        >
          {icon}
          {name}
        </button>
      );
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 md:px-8 relative">
      
      {/* --- Main Header Section --- */}
      <div className="flex justify-between items-center pb-4 border-b border-purple-200/50 mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <FiHome className="w-7 h-7 text-purple-600" /> WFH Management Portal
            </h1>
            <p className="mt-2 text-lg text-gray-700">
  Welcome, <span className="font-semibold text-gray-900">{user.name}</span>!{' '}
  Your role:{" "}
  <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg shadow-sm">
    {user.role.toUpperCase()}
  </span>
</p>

        </div>
        
        {/* Form Toggle Button (Opens Drawer) */}
        <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-semibold shadow-md shadow-purple-500/30"
        >
            <FiPlus className="w-5 h-5" /> Request New WFH
        </button>
      </div>

      {/* --- Tabs Navigation --- */}
      <div className="flex gap-1 border-b border-gray-300 mb-6">
        <TabButton
          name="My Applications"
          icon={<FiCalendar />}
          tabKey="myleaves"
        />
        <TabButton
          name="Manage Requests"
          icon={<FiBriefcase />}
          tabKey="manage"
        />
      </div>

      {/* --- Content Area --- */}
      {/* My Applications Tab Content */}
      {activeTab === "myleaves" && (
        <section className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Requests List Card Header */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FiCalendar className="text-purple-500"/> My Submitted WFH Applications
            </h3>
          </div>
          {/* Requests List Content */}
          <div className="p-6">
            <MyWFHRequests user={user} />
          </div>
        </section>
      )}

      {/* Manage Requests Tab Content */}
      {activeTab === "manage" && (
        <section className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Requests Management Card Header */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiBriefcase className="text-purple-500"/> Requests Awaiting Your Action
                </h3>
            </div>
            {/* Requests Management Content */}
            <div className="p-6">
                <WorkFromHomeDashboard user={user} />
            </div>
        </section>
      )}

      {/* Slide-in WFH Form Drawer (Modal Overlay) */}
      {showForm && user && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />

          {/* Drawer Panel */}
          <div className="ml-auto w-full max-w-xl h-full flex flex-col bg-white shadow-2xl animate-slideInRight z-50">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center bg-purple-600 text-white px-6 py-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-4">
                  <IconHome className="w-8 h-8 stroke-white" />
                  <div>
                      <h2 className="text-xl font-extrabold">New WFH Application</h2>
                      <p className="mt-1 text-sm text-purple-200">
                          Request a day to work remotely.
                      </p>
                  </div>
                </div>
                <button
                    onClick={() => setShowForm(false)}
                    className="h-8 w-8 flex items-center justify-center text-purple-200 hover:text-white transition-colors"
                >
                    <span className="sr-only">Close panel</span>
                    <FiX className="h-7 w-7 stroke-2" />
                </button>
            </div>
            
            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto p-0">
                <WorkFromHomeForm user={user} />
            </div>
          </div>
        </div>
      )}

      {/* Slide-in animation CSS */}
      <style jsx>{`
        .animate-slideInRight {
          transform: translateX(100%);
          opacity: 0;
          animation: slideInRight 0.4s forwards cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideInRight {
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
