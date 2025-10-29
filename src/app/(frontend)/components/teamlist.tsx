"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Menu } from "@headlessui/react";
import { FiMoreVertical,} from "react-icons/fi";
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
  FiBriefcase,
} from "react-icons/fi";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types";
import { TeamForm } from "./form/teamcreateform";
import { TeamDetailsDrawer } from "./teams/TeamDetailsDrawer";

const TEAMS_PER_PAGE = 8;

// --- Icon Helper ---
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2a3 3 0 00-5.356-1.857M9 20h2v-2a3 3 0 00-5.356-1.857M9 20v-2a3 3 0 00-5.356-1.857M1 18V6a2 2 0 012-2h18a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2zM6 10h.01M10 10h.01M14 10h.01"></path>
  </svg>
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
    case "user": return "user";
    case "teamlead":
    case "team leader": return "teamlead";
    case "hr":
    case "admin": return "admin";
    default: return "user";
  }
};

const getMemberDetails = (member: Member, users: IUser[]): string => {
  const rawUserId = member.userId as MemberUserId;
  const userIdString =
    typeof rawUserId === "object" && rawUserId?._id
      ? rawUserId._id.toString()
      : rawUserId?.toString() || "";
  const user = users.find((u) => u.id === userIdString);
  if (!user) return "Unknown User";
  return user.name; // only show name, no role
};

interface Props {
  currentUser: { id: string; role: string; name?: string; email?: string };
}

export const TeamDashboard: React.FC<Props> = ({ currentUser }) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  const [viewingTeam, setViewingTeam] = useState<ITeam | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/addusers", { headers: { Authorization: `Bearer ${token}` } });
      const data: IBackendUser[] = await res.json();
      if (res.ok) {
        setUsers(data.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: mapRole(u.role),
          avatar: u.avatar || ""
        })));
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
      setCurrentPage(1);
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

  const deleteTeam = async (id: string) => {
  if (!window.confirm("Are you sure you want to permanently delete this team?")) return;
  try {
    const res = await fetch(`/api/teams/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      fetchTeams();
    } else {
      toast.error(data.error || "Failed to delete team");
    }
  } catch (err) {
    toast.error("Network error while deleting team");
    console.error(err);
  }
};


  const startEdit = (team: ITeam) => { setEditingTeam(team); setShowForm(true); };
  const startCreate = () => { setEditingTeam(null); setShowForm(true); };
  const stopForm = () => { setEditingTeam(null); setShowForm(false); };
  const handleEditSubmit = async () => { await fetchTeams(); stopForm(); };
  const handleCreateSuccess = async () => { await fetchTeams(); stopForm(); };

  // Process teams: extract only lead
  const processedTeams = useMemo(() => teams.map(team => {
    const lead = team.members.find(m => m.role === "teamlead");
    const leadName = lead ? getMemberDetails(lead, users) : null;
    return {
      ...team,
      leadName,
      projectStrings: team.projects?.filter(p => p.trim() !== "") || [],
    };
  }), [teams, users]);

  const totalPages = useMemo(() => Math.ceil(processedTeams.length / TEAMS_PER_PAGE), [processedTeams.length]);
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * TEAMS_PER_PAGE;
    return processedTeams.slice(start, start + TEAMS_PER_PAGE);
  }, [processedTeams, currentPage]);

  const goToPage = useCallback((page: number) => { if (page > 0 && page <= totalPages) setCurrentPage(page); }, [totalPages]);

  if (!["hr", "admin"].includes(currentUser.role))
    return (
      <div className="p-8 bg-white rounded-xl shadow-2xl border border-red-300 mt-12 max-w-lg mx-auto transform transition duration-500 hover:scale-[1.02]">
        <p className="text-2xl font-bold text-red-700 flex items-center justify-center gap-3"><FiAlertTriangle className="w-7 h-7" /> Access Denied</p>
        <p className="text-gray-600 text-center mt-4 border-t pt-4">Only **HR** or **Admin** roles have permission to manage teams.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto min-h-screen font-sans relative">
      <Toaster position="top-right" />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-green-200/50 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
              <IconUsers className="w-7 h-7 sm:w-9 sm:h-9 text-green-600 stroke-2" /> Team Management Portal
            </h1>
            <p className="mt-2 text-lg text-gray-700">Welcome, <span className="font-semibold text-gray-900">{currentUser.name || "Manager"}</span>! Role: <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg shadow-sm">{currentUser.role.toUpperCase()}</span></p>
          </div>
          <button onClick={startCreate} className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-semibold shadow-md shadow-green-500/30 whitespace-nowrap">
            <FiPlusCircle className="w-5 h-5" /> Create New Team
          </button>
        </div>

        {/* Teams Table */}
        <section className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><FiBriefcase className="text-green-600 w-6 h-6" /> All Active Teams ({processedTeams.length})</h2>
            <p className="text-sm text-gray-500 mt-1">Showing teams {Math.min((currentPage - 1) * TEAMS_PER_PAGE + 1, processedTeams.length)} to {Math.min(currentPage * TEAMS_PER_PAGE, processedTeams.length)}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-24 text-green-500 p-6"><FiClock className="w-6 h-6 animate-spin mr-3" /> Fetching team data...</div>
          ) : processedTeams.length === 0 ? (
            <div className="p-10 text-center border-2 border-green-300 border-dashed rounded-b-xl bg-green-50/50">
              <FiCheckCircle className="w-8 h-8 mx-auto text-green-500 mb-3" />
              <p className="text-xl font-semibold text-gray-700">No Teams Configured</p>
              <p className="text-gray-500 text-sm mt-1">Click &apos;Create New Team&apos; above to get started.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto shadow-inner">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50/80 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Team Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider min-w-[250px]">Team Lead</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider min-w-[180px]">Projects</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-indigo-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedTeams.map((team) => (
                      <tr key={team._id} className="hover:bg-green-50/50 transition duration-150">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-extrabold text-gray-900">{team.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {team.leadName ? (
                            <span className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm font-medium border border-green-300">
                              {team.leadName}
                            </span>
                          ) : <span className="text-gray-400 italic">No Lead Assigned</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-2">{team.projectStrings.map((p, idx) => (
                            <span key={`${team._id}-${p}-${idx}`} className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                              <FiCode className="w-3 h-3 mr-1 text-gray-500" /> {p}
                            </span>
                          ))}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
  <Menu as="div" className="relative inline-block text-left">
    <Menu.Button className="p-2 rounded-full hover:bg-gray-200">
      <FiMoreVertical className="w-5 h-5" />
    </Menu.Button>

    <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
      <div className="p-1">
        <Menu.Item>
          {({ active }: { active: boolean }) => (
            <button
              onClick={() => startEdit(team)}
              className={`group flex w-full items-center px-2 py-2 text-sm rounded-md ${
                active ? "bg-green-100 text-green-900" : "text-gray-700"
              }`}
            >
              <FiEdit className="w-4 h-4 mr-2" /> Edit
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
  {({ active }: { active: boolean }) => (
    <button
      type="button" // make sure it's explicitly a button
      onClick={() => deleteTeam(team._id)} // team._id is a string
      className={`group flex w-full items-center px-2 py-2 text-sm rounded-md ${
        active ? "bg-red-100 text-red-900" : "text-gray-700"
      }`}
    >
      <FiTrash2 className="w-4 h-4 mr-2" /> Delete
    </button>
  )}
</Menu.Item>

        <Menu.Item>
          {({ active }: { active: boolean }) => (
            <button
              onClick={() => setViewingTeam(team)}
              className={`group flex w-full items-center px-2 py-2 text-sm rounded-md ${
                active ? "bg-blue-100 text-blue-900" : "text-gray-700"
              }`}
            >
              <FiUsers className="w-4 h-4 mr-2" /> View
            </button>
          )}
        </Menu.Item>
      </div>
    </Menu.Items>
  </Menu>
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition shadow-sm">Previous</button>
                  <div className="hidden sm:flex space-x-1">{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => goToPage(page)} className={`px-3 py-1 text-sm rounded-lg font-semibold transition ${currentPage === page ? "bg-green-600 text-white shadow-md shadow-green-500/30" : "text-gray-700 hover:bg-green-100/50"}`}>{page}</button>
                  ))}</div>
                  <p className="text-sm text-gray-600 sm:hidden">Page {currentPage} of {totalPages}</p>
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition shadow-sm">Next</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* --- Team Form Drawer --- */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={stopForm} />
          <div className="ml-auto w-full max-w-3xl h-full flex flex-col bg-white shadow-2xl animate-slideInRight z-50">
            <div className="flex justify-between items-center bg-purple-600 text-white px-6 py-4 sticky top-0 z-10 shadow-lg">
              <div className="flex items-center gap-4">
                <IconUsers className="w-8 h-8 stroke-white" />
                <div>
                  <h2 className="text-2xl font-extrabold">{editingTeam ? "Edit Team Configuration" : "New Team Application"}</h2>
                  <p className="mt-1 font-bold text-sm text-green-200">{editingTeam ? `Modifying: ${editingTeam.name}` : "Define team structure, roles, and projects."}</p>
                </div>
              </div>
              <button onClick={stopForm} className="h-8 w-8 flex items-center justify-center text-green-200 hover:text-white transition-colors"><span className="sr-only">Close panel</span><FiX className="h-7 w-7 stroke-2" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TeamForm currentUser={currentUser} users={users} initialTeam={editingTeam || undefined} onSubmit={editingTeam ? handleEditSubmit : handleCreateSuccess} onCancel={stopForm} isEditing={!!editingTeam} />
            </div>
          </div>
        </div>
      )}

      {/* --- Team Details Drawer --- */}
      {viewingTeam && (
        <TeamDetailsDrawer team={viewingTeam} users={users} onClose={() => setViewingTeam(null)} />
      )}

      <style jsx>{`
        .animate-slideInRight { transform: translateX(100%); opacity: 0; animation: slideInRight 0.4s forwards cubic-bezier(0.4,0,0.2,1); }
        @keyframes slideInRight { to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};
