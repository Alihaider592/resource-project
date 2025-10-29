"use client";

import React from "react";
import { FiX, FiUsers, FiUser, FiCode, FiBriefcase } from "react-icons/fi";
import { IUser, Member, ITeam } from "@/app/(backend)/models/types";

interface Props {
  team: ITeam;
  users: IUser[];
  onClose: () => void;
}

// --- Type for populated user ---
interface PopulatedUser {
  _id: string;
}

// --- Type guard for populated user ---
const isPopulatedUser = (value: unknown): value is PopulatedUser =>
  typeof value === "object" &&
  value !== null &&
  "_id" in value &&
  typeof (value as { _id?: unknown })._id === "string";

// --- Utility to get member display string (name only) ---
const getMemberName = (member: Member, users: IUser[]): string => {
  const rawUserId = member.userId;
  const userIdString = isPopulatedUser(rawUserId)
    ? rawUserId._id
    : typeof rawUserId === "string"
    ? rawUserId
    : "";

  const user = users.find((u) => u.id === userIdString);
  return user ? user.name : "Unknown User";
};

// --- Structured Team Details Modal Component ---
export const TeamDetailsDrawer: React.FC<Props> = ({ team, users, onClose }) => {
  const leadMember = team.members.find((m) => m.role === "teamlead");
  const otherMembers = team.members.filter((m) => m.role !== "teamlead");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
      >
        
        {/* Header */}
        <div className="flex justify-between items-center bg-green-600 text-white px-6 py-4 border-b border-green-700">
          <div className="flex items-center gap-3">
            <FiBriefcase className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold">{team.name} Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-green-200 hover:bg-green-700 hover:text-white transition"
            aria-label="Close"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Team Lead */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-inner">
            <h3 className="flex items-center gap-2 text-base font-bold text-green-700 uppercase tracking-wider mb-2">
              <FiUser className="w-4 h-4" /> Team Lead
            </h3>
            {leadMember ? (
              <p className="text-lg font-semibold text-gray-800">
                {getMemberName(leadMember, users)}
              </p>
            ) : (
              <p className="text-gray-500 italic">No dedicated team lead assigned.</p>
            )}
          </div>

          {/* Members */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-700 uppercase tracking-wider mb-3">
              <FiUsers className="w-4 h-4" /> Team Members ({otherMembers.length})
            </h3>
            {otherMembers.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {otherMembers.map((m, i) => (
                  <span
                    key={`${team._id}-member-${i}`}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-white text-gray-700 rounded-full border border-gray-300 shadow-sm transition hover:shadow-md"
                  >
                    {getMemberName(m, users)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">This team has no additional members.</p>
            )}
          </div>

          {/* Projects */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-inner">
            <h3 className="flex items-center gap-2 text-base font-bold text-indigo-700 uppercase tracking-wider mb-3">
              <FiCode className="w-4 h-4" /> Active Projects ({team.projects.length})
            </h3>
            {team.projects.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {team.projects.map((p, i) => (
                  <span
                    key={`${team._id}-project-${i}`}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-white text-indigo-800 rounded-full border border-indigo-300 shadow-sm transition hover:shadow-md"
                  >
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No projects are currently associated with this team.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
