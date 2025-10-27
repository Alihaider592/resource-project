"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FiCalendar, FiBriefcase, FiAperture, FiUser, FiHome, FiPlus, FiX } from "react-icons/fi";
import WorkFromHomeDashboard from "@/app/(frontend)/components/dashboard/wfh/WorkFromHomeDashboard";
import { WorkFromHomeForm } from "@/app/(frontend)/components/form/WorkFromHomeForm";
import MyWFHRequests from "@/app/(frontend)/components/dashboard/wfh/MyWFHRequests";

interface DecodedUser {
  name: string;
  email: string;
  role?: string;
}

// 🎯 Type Definition: Keeping the state narrow as this specific page requires HR/TL access
type ManagerRole = "hr" | "teamlead"; 

interface UserState {
  name: string;
  email: string;
  role: ManagerRole;
}

export default function HRWFHPage() {
  const [user, setUser] = useState<UserState | null>(null);
  const [activeTab, setActiveTab] = useState<"manage" | "myleaves">("myleaves");
  const [showForm, setShowForm] = useState(false); // toggle form visibility

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedUser>(token);
        const role = decoded.role?.toLowerCase();
        
        // Only set the user state if they are an HR or TeamLead
        if (role === "hr" || role === "teamlead") {
          setUser({
            name: decoded.name,
            email: decoded.email,
            role: role as ManagerRole,
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
          <p className="text-md text-gray-500 mt-1">Only HR or TeamLead can access this management portal.</p>
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
            flex items-center gap-2 px-6 py-2.5 rounded-t-xl font-semibold transition-all duration-200 text-base
            ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-t border-x border-indigo-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-b-2 border-transparent"
            }
          `}
        >
          {icon}
          {name}
        </button>
      );
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 md:px-8">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b-2 border-gray-200">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <FiHome className="w-8 h-8 text-indigo-600" /> WFH Management Portal
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Welcome, **{user.name}**! Your role: <span className="font-bold text-indigo-700">{user.role.toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* --- Tabs Navigation --- */}
      <div className="flex gap-1 border-b border-gray-300 mb-8">
        <TabButton
          name="My Leaves"
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
      {/* My Leaves Tab Content */}
      {activeTab === "myleaves" && (
        <div className="space-y-8">
          
          {/* Form Toggle Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 text-white shadow-lg
              ${showForm ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30"}
            `}
          >
            {showForm ? <FiX /> : <FiPlus />}
            {showForm ? "Hide WFH Application Form" : "Create New WFH Application"}
          </button>

          {/* Form Card (with animation) */}
          {showForm && (
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-indigo-100 transition-all duration-500 ease-in-out transform scale-100 opacity-100">
              <WorkFromHomeForm user={user} />
            </div>
          )}

          {/* Requests List Card */}
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <FiCalendar className="text-indigo-500"/> Submitted Applications
            </h3>
            <MyWFHRequests user={user} />
          </div>
        </div>
      )}

      {/* Manage Requests Tab Content */}
      {activeTab === "manage" && (
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-red-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <FiBriefcase className="text-red-500"/> Requests Awaiting Your Action
            </h3>
            {/* 🎯 Note: user must be cast/asserted here if WorkFromHomeDashboard's props 
               are strictly defined as 'hr' | 'teamlead' (ManagerRole). */}
            <WorkFromHomeDashboard user={user} />
        </div>
      )}
    </div>
  );
}