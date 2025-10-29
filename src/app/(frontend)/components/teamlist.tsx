"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiUsers,
  FiEdit,
  FiClock,
  FiTrash2,
  FiCode,
  FiX,
  FiCheckCircle,
  FiAlertTriangle,
  FiCheck,
  FiPlusCircle,
  FiBriefcase, // Used for the list header icon
} from "react-icons/fi";
// NOTE: The local import for TeamForm has been removed and replaced by an inline component definition below
import { ITeam, IUser, Member } from "@/app/(backend)/models/types"; 

// --- Constants ---
const TEAMS_PER_PAGE = 8;

// --- Icon Helpers ---
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2a3 3 0 00-5.356-1.857M9 20h2v-2a3 3 0 00-5.356-1.857M9 20v-2a3 3 0 00-5.356-1.857M1 18V6a2 2 0 012-2h18a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2zM6 10h.01M10 10h.01M14 10h.01"></path></svg>
);


// --- Type Definitions ---
interface IBackendUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

type PopulatedUser = { _id: string }; 
type MemberUserId = string | PopulatedUser;

const mapRole = (role: string): IUser["role"] => {
  switch (role.toLowerCase()) {
    case "user":
      return "user";
    case "teamlead":
    case "team leader":
      return "teamlead";
    case "hr":
    case "admin":
      return "admin";
    default:
      return "user";
  }
};

const getMemberDetails = (member: Member, users: IUser[]): string => {
  const rawUserId = member.userId as MemberUserId; 
  
  const userIdString = 
    typeof rawUserId === 'object' && rawUserId !== null && (rawUserId as PopulatedUser)._id
    ? (rawUserId as PopulatedUser)._id.toString()
    : rawUserId ? rawUserId.toString() : '';
    
  const user = users.find((u) => u.id === userIdString);
  if (!user) return "Unknown User";
  
  const roleDisplay = member.role === 'teamlead' ? 'Lead' : user.role.charAt(0).toUpperCase() + user.role.slice(1);
  return `${user.name} (${roleDisplay})`;
};

interface Props {
  currentUser: { id: string; role: string; name?: string; email?: string };
}

// ------------------------------------
// Mock TeamForm Component (Re-added to resolve the import error)
// ------------------------------------
interface TeamFormProps {
    currentUser: Props['currentUser'];
    users: IUser[];
    initialTeam?: ITeam;
    onSubmit: () => void; // Submitting triggers a refresh and close
    onCancel: () => void;
    isEditing: boolean;
}

const TeamForm: React.FC<TeamFormProps> = ({ initialTeam, onSubmit, onCancel, isEditing }) => {
    
    // In a real scenario, this would hold form state (name, members, projects)
    const title = isEditing 
        ? `Editing Team: ${initialTeam?.name}` 
        : "Create New Team";
        
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, API call would happen here.
        // On success:
        toast.success(isEditing ? "Team updated successfully (Mock)" : "Team created successfully (Mock)");
        onSubmit(); // Call the parent handler to refresh list and close drawer
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-700">{title}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Placeholder Input 1: Team Name */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                    <input 
                        type="text" 
                        defaultValue={initialTeam?.name || ''}
                        placeholder="e.g., Neptune Project Team"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                
                {/* Placeholder Input 2: Members/Projects */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Members & Projects</label>
                    <p className="text-sm text-gray-500 italic">
                        The full implementation of member/project selection would go here, utilizing the passed `users` list.
                    </p>
                    <div className="h-24 bg-white border border-dashed border-green-300 rounded-lg mt-3 flex items-center justify-center text-indigo-500 text-sm">
                        [Complex Form Controls Placeholder]
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition font-semibold"
                    >
                        <FiX className="w-4 h-4 mr-1 inline-block" /> Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md shadow-green-500/30 font-semibold flex items-center"
                    >
                        {isEditing ? <FiEdit className="w-4 h-4 mr-2" /> : <FiPlusCircle className="w-4 h-4 mr-2" />}
                        {isEditing ? "Save Changes" : "Create Team"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Team Dashboard Component ---

export const TeamDashboard: React.FC<Props> = ({ currentUser }) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Controls the drawer visibility
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // -------------------------
  // Data Fetching
  // -------------------------
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/addusers", { headers: { Authorization: `Bearer ${token}` } });
      const data: IBackendUser[] = await res.json();
      if (res.ok) {
        const mappedUsers: IUser[] = data.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: mapRole(u.role),
          avatar: u.avatar || "",
        }));
        setUsers(mappedUsers);
      } else toast.error("Failed to fetch users");
    } catch (error) { 
      console.error(error);
      toast.error("Network error while fetching users");
    }
  }, [token]);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams/list", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : []);
      setCurrentPage(1); // Reset to page 1 on new data fetch
    } catch (error) { 
      console.error(error);
      toast.error("Network error while fetching teams");
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, [fetchUsers, fetchTeams]);

  // -------------------------
  // CRUD Actions
  // -------------------------
  const deleteTeam = async (id: string) => {
    // Replaced confirm() with a custom modal logic placeholder due to requirements
    if (!window.confirm("Are you sure you want to permanently delete this team? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/teams/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchTeams();
      } else toast.error(data.error || "Failed to delete team");
    } catch (error) { 
      toast.error("Failed to delete team due to network error");
    }
  };

  const startEdit = (team: ITeam) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingTeam(null);
    setShowForm(true);
  };

  const stopForm = () => {
    setEditingTeam(null); // Clear editing state
    setShowForm(false);  // Close the drawer
  };

  const handleEditSubmit = async () => {
    await fetchTeams();
    stopForm();
  };

  const handleCreateSuccess = async () => {
    await fetchTeams();
    stopForm();
  };
  
  // -------------------------
  // Process and Paginate Teams
  // -------------------------
  const processedTeams = useMemo(() => {
    return teams.map(team => ({
      ...team,
      memberStrings: team.members?.map(m => getMemberDetails(m, users)) || [],
      projectStrings: team.projects?.filter(p => p.trim() !== '') || [],
    }));
  }, [teams, users]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(processedTeams.length / TEAMS_PER_PAGE);
  }, [processedTeams.length]);

  // Slice the array for the current page
  const paginatedTeams = useMemo(() => {
    const startIndex = (currentPage - 1) * TEAMS_PER_PAGE;
    const endIndex = startIndex + TEAMS_PER_PAGE;
    return processedTeams.slice(startIndex, endIndex);
  }, [processedTeams, currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
    }
  }, [totalPages]);

  // -------------------------
  // Pagination UI Renderer
  // -------------------------
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition shadow-sm"
            >
                Previous
            </button>
            <div className="hidden sm:flex space-x-1">
                {pageNumbers.map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 text-sm rounded-lg font-semibold transition ${
                            currentPage === page
                                ? "bg-green-600 text-white shadow-md shadow-green-500/30"
                                : "text-gray-700 hover:bg-green-100/50"
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <p className="text-sm text-gray-600 sm:hidden">
              Page {currentPage} of {totalPages}
            </p>
            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition shadow-sm"
            >
                Next
            </button>
        </div>
    );
  };
  
  // -------------------------
  // Access Control Check
  // -------------------------
  if (!["hr", "admin"].includes(currentUser.role))
    return (
      <div className="p-8 bg-white rounded-xl shadow-2xl border border-red-300 mt-12 max-w-lg mx-auto transform transition duration-500 hover:scale-[1.02]">
        <p className="text-2xl font-bold text-red-700 flex items-center justify-center gap-3">
          <FiAlertTriangle className="w-7 h-7" /> Access Denied
        </p>
        <p className="text-gray-600 text-center mt-4 border-t pt-4">
          Only **HR** or **Admin** roles have permission to manage teams.
        </p>
      </div>
    );

  // -------------------------
  // Render Dashboard
  // -------------------------
  return (
    // Applied max-w-7xl and centered layout
    <div className="max-w-7xl mx-auto p-4 sm:p-8 min-h-screen bg-gray-50 font-sans relative">
      <Toaster position="top-right" />
      <div className="space-y-8">

        {/* --- Main Header Section (Adopted WFH style) --- */}
        <div className="flex justify-between items-center pb-4 border-b border-green-200/50 mb-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <IconUsers className="w-7 h-7 sm:w-9 sm:h-9 text-green-600 stroke-2" /> Team Management Portal
                </h1>
                <p className="mt-2 text-lg text-gray-700">
                    Welcome, <span className="font-semibold text-gray-900">{currentUser.name || 'Manager'}</span>!{' '}
                    Your role:{" "}
                    <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg shadow-sm">
                        {currentUser.role.toUpperCase()}
                    </span>
                </p>
            </div>
            
            {/* Form Toggle Button (Adopted WFH style) */}
            <button
                onClick={startCreate}
                className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-semibold shadow-md shadow-green-500/30 whitespace-nowrap"
            >
                <FiPlusCircle className="w-5 h-5" /> Create New Team
            </button>
        </div>
        
        {/* --- Teams List Section (Elevated Card Style) --- */}
        <section className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FiBriefcase className="text-green-600 w-6 h-6" /> All Active Teams ({processedTeams.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">Showing teams {((currentPage - 1) * TEAMS_PER_PAGE) + 1} to {Math.min(currentPage * TEAMS_PER_PAGE, processedTeams.length)}</p>
          </div>

          {/* Loading/Empty State */}
          {loading ? (
            <div className="flex justify-center items-center h-24 text-green-500 p-6">
              <FiClock className="w-6 h-6 animate-spin mr-3" /> Fetching team data...
            </div>
          ) : processedTeams.length === 0 ? (
            <div className="p-10 text-center border-2 border-green-300 border-dashed rounded-b-xl bg-green-50/50">
              <FiCheckCircle className="w-8 h-8 mx-auto text-green-500 mb-3" />
              <p className="text-xl font-semibold text-gray-700">No Teams Configured</p>
              <p className="text-gray-500 text-sm mt-1">Click &apos;Create New Team&apos; above to get started.</p>
            </div>
          ) : (
            
            /* --- Teams Table --- */
            <>
              <div className="overflow-x-auto shadow-inner">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50/80 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Team Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider min-w-[250px]">Members (Role)</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider min-w-[180px]">Projects</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-indigo-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {/* Use paginatedTeams here */}
                    {paginatedTeams.map(team => ( 
                      <tr key={team._id} className="hover:bg-green-50/50 transition duration-150">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-extrabold text-gray-900">
                          {team.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-2">
                            {team.memberStrings.map((memberString, idx) => (
                              <span 
                                key={`${team._id}-${memberString}-${idx}`} 
                                className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200 shadow-sm"
                              >
                                <FiCheck className="w-3 h-3 mr-1 text-green-600" /> {memberString}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-2">
                            {team.projectStrings.map((project, idx) => (
                              <span 
                                key={`${team._id}-${project}-${idx}`} 
                                className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                              >
                                <FiCode className="w-3 h-3 mr-1 text-gray-500" /> {project}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <div className="flex flex-col items-end space-y-1">
                            <button 
                              onClick={() => startEdit(team)} 
                              className="text-indigo-600 hover:cursor-pointer hover:text-green-800 transition duration-150 p-1 flex items-center gap-1"
                            >
                              <FiEdit className="w-4 h-4" /> Edit
                            </button>
                            <button 
                              onClick={() => deleteTeam(team._id)} 
                              className="text-red-600 hover:text-red-800 transition duration-150 p-1 flex items-center gap-1"
                            >
                              <FiTrash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination()} 
            </>
          )}
        </section>

      </div>

      {/* --- Slide-in Team Form Drawer --- */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={stopForm}
          />

          {/* Drawer */}
          <div className="ml-auto w-full max-w-3xl h-full flex flex-col bg-white shadow-2xl animate-slideInRight z-50">
            
            {/* Header (Matching WFH Portal Style) */}
            <div className="flex justify-between items-center bg-green-600 text-white px-6 py-4 sticky top-0 z-10 shadow-lg">
                <div className="flex items-center gap-4">
                    <IconUsers className="w-8 h-8 stroke-white" />
                    <div>
                        <h2 className="text-2xl font-extrabold">
                            {editingTeam ? "Edit Team Configuration" : "New Team Application"}
                        </h2>
                        <p className="mt-1 text-sm text-green-200">
                            {editingTeam ? `Modifying: ${editingTeam.name}` : "Define team structure, roles, and projects."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={stopForm}
                    className="h-8 w-8 flex items-center justify-center text-green-200 hover:text-white transition-colors"
                >
                    <span className="sr-only">Close panel</span>
                    <FiX className="h-7 w-7 stroke-2" />
                </button>
            </div>
            
            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <TeamForm 
                    currentUser={currentUser}
                    users={users}
                    initialTeam={editingTeam || undefined}
                    onSubmit={editingTeam ? handleEditSubmit : handleCreateSuccess} 
                    onCancel={stopForm}
                    isEditing={!!editingTeam}
                />
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
};
