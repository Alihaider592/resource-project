// src/app/(frontend)/components/teamlist.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  FiUsers, FiEdit, FiClock, FiTrash2, FiCode, FiX, FiCheckCircle, FiCheck 
} from "react-icons/fi";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types";
import { TeamForm } from "./form/teamcreateform";

// Backend user type
interface IBackendUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Map backend role to frontend allowed roles
const mapRole = (role: string): IUser["role"] => {
  switch (role.toLowerCase()) {
    case "user": return "user";
    case "teamlead": return "teamlead";
    case "hr": return "hr";
    case "admin": return "admin";
    default: return "user";
  }
};

interface Props {
  currentUser: { id: string; role: string };
}

// Show member name and role using actual user role
const getMemberDetails = (member: Member, users: IUser[]): string => {
  const user = users.find(u => u.id === member.userId);
  if (!user) return "Unknown User";
  const role = user.role.charAt(0).toUpperCase() + user.role.slice(1); 
  return `${user.name} (${role})`; 
};

export const TeamDashboard: React.FC<Props> = ({ currentUser }) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch users
  const fetchUsers = async () => {
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
    } catch (err) {
      console.error(err);
      toast.error("Network error while fetching users");
    }
  };

  // Fetch teams
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teams/create", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTeams(Array.isArray(data.teams) ? data.teams : []);
    } catch (err) {
      console.error(err);
      toast.error("Network error while fetching teams");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, [token]);

  const deleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
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
    } catch (err) {
      toast.error("Failed to delete team due to network error");
    }
  };

  const startEdit = (team: ITeam) => setEditingTeam(team);
  const stopEdit = () => setEditingTeam(null);

  const handleEditSubmit = async (updatedTeam: ITeam) => {
    try {
      const res = await fetch(`/api/teams/update/${updatedTeam._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedTeam),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        stopEdit();
        fetchTeams();
      } else toast.error(data.error || "Failed to update team");
    } catch (err) {
      toast.error("Failed to update team due to network error");
    }
  };

  const processedTeams = useMemo(() => {
    return teams.map(team => ({
      ...team,
      memberStrings: team.members.map(m => getMemberDetails(m, users)),
      projectStrings: team.projects,
    }));
  }, [teams, users]);

  if (!["hr", "admin"].includes(currentUser.role))
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg border border-red-200 mt-8 max-w-6xl mx-auto">
        <p className="text-xl font-semibold text-red-600 flex items-center gap-2">
          <FiX className="w-6 h-6" /> Access Denied
        </p>
        <p className="text-gray-600 mt-2">
          You do not have permissions (HR or Admin) to manage teams.
        </p>
      </div>
    );

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Team Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${editingTeam ? 'text-indigo-600' : 'text-gray-800'}`}>
            {editingTeam ? <FiEdit /> : <FiUsers />} {editingTeam ? `Edit Team: ${editingTeam.name}` : "Create New Team"}
          </h2>
          <TeamForm
            currentUser={currentUser}
            users={users}
            initialTeam={editingTeam || undefined}
            onSubmit={editingTeam ? handleEditSubmit : fetchTeams}
            onCancel={stopEdit}
            isEditing={!!editingTeam}
          />
        </div>

        {/* Teams List */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            All Teams ({processedTeams.length})
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-20 text-gray-500">
              <FiClock className="w-6 h-6 animate-spin mr-2" /> Loading teams...
            </div>
          ) : processedTeams.length === 0 ? (
            <div className="p-10 text-center border-dashed border-2 border-gray-300 rounded-lg">
              <FiCheckCircle className="w-8 h-8 mx-auto text-indigo-400 mb-3" />
              <p className="text-lg font-semibold text-gray-700">No Teams Found</p>
              <p className="text-gray-500 text-sm">Create a new team above to see it listed here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100/70">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Team Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Members (Role)</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Projects</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {processedTeams.map(team => (
                    <tr key={team._id} className="hover:bg-indigo-50/50 transition duration-150">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{team.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs overflow-hidden overflow-ellipsis">
                        <div className="flex flex-wrap gap-2">
                          {team.memberStrings.map((memberString, idx) => (
                            <span 
                              key={team.members[idx].userId} 
                              className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                            >
                              <FiCheck className="w-3 h-3 mr-1 text-green-600" /> {memberString}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                        <div className="flex flex-wrap gap-2">
                          {team.projectStrings.map(project => (
                            <span key={project} className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              <FiCode className="w-3 h-3 mr-1" /> {project}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button onClick={() => startEdit(team)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                          <FiEdit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => deleteTeam(team._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1 mt-1">
                          <FiTrash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
