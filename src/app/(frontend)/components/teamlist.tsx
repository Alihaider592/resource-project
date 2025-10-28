"use client";
import React, { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  FiUsers, 
  FiEdit, 
  FiClock, 
  FiTrash2, 
  FiUser, 
  FiCode, 
  FiX, 
  FiCheckCircle 
} from "react-icons/fi";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types";
import { TeamForm } from "./form/teamcreateform";

interface Props {
  currentUser: { id: string; role: string };
  users: IUser[]; // List of all users to map IDs to names
}

// 📌 Optimized Helper: Memoized lookup function
const getMemberDetails = (member: Member, users: IUser[]): string => {
    const user = users.find((u) => u.id === member.userId);
    const name = user?.name || "Unknown User";
    const role = member.role.charAt(0).toUpperCase() + member.role.slice(1);
    return `${name} (${role})`;
};

export const TeamDashboard: React.FC<Props> = ({ currentUser, users }) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Safely get the token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTeams = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/teams", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            // Ensure data.teams is an array before setting state
            setTeams(Array.isArray(data.teams) ? data.teams : []);
        } else {
            toast.error(data.error || "Failed to fetch teams.");
        }
    } catch (error) {
        console.error("Fetch teams error:", error);
        toast.error("Network error while fetching teams.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [token]); // Dependency added for safety

  const deleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) return;
    try {
        const res = await fetch(`/api/teams/delete/${id}`, { 
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            toast.success(data.message);
            fetchTeams();
        } else toast.error(data.error || "Failed to delete team.");
    } catch (error) {
        toast.error("Failed to delete team due to a network error.");
    }
  };

  const startEdit = (team: ITeam) => setEditingTeam(team);
  const stopEdit = () => setEditingTeam(null);

  const handleEditSubmit = async (updatedTeam: ITeam) => {
    try {
        const res = await fetch(`/api/teams/update/${updatedTeam._id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(updatedTeam),
        });
        const data = await res.json();
        if (res.ok) {
            toast.success(data.message);
            stopEdit();
            fetchTeams();
        } else toast.error(data.error || "Failed to update team.");
    } catch (error) {
        toast.error("Failed to update team due to a network error.");
    }
  };

  // 💡 Memoize the processed team data for stable rendering in the table
  const processedTeams = useMemo(() => {
    return teams.map(team => ({
        ...team,
        // Pre-calculate the display string for members/projects to avoid re-calculating on every render
        memberStrings: team.members.map(m => getMemberDetails(m, users)),
        projectStrings: team.projects,
    }));
  }, [teams, users]);


  // Permission Check
  if (!["hr", "admin"].includes(currentUser.role))
    return (
        <div className="p-8 bg-white rounded-xl shadow-lg border border-red-200 mt-8 max-w-6xl mx-auto">
            <p className="text-xl font-semibold text-red-600 flex items-center gap-2">
                <FiX className="w-6 h-6"/> Access Denied
            </p>
            <p className="text-gray-600 mt-2">
                You do not have the required permissions (**HR** or **Admin**) to manage teams.
            </p>
        </div>
    );

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" />
      
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 border-l-4 border-indigo-500 pl-4 flex items-center gap-2">
            <FiUsers className="w-7 h-7 text-indigo-600" /> Team Management Dashboard
        </h1>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- Team Creation/Editing Panel --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${editingTeam ? 'text-indigo-600' : 'text-gray-800'}`}>
                {editingTeam ? <FiEdit /> : <FiUsers />} {editingTeam ? "Edit Team: " + editingTeam.name : "Create New Team"}
            </h2>

            {/* Form Component */}
            <TeamForm
              currentUser={currentUser}
              users={users}
              initialTeam={editingTeam || undefined}
              onSubmit={editingTeam ? handleEditSubmit : fetchTeams}
              onCancel={stopEdit} // The missing prop that was added
              isEditing={!!editingTeam}
            />

            {/* Cancel Button for Editing */}
            {editingTeam && (
                <button 
                    onClick={stopEdit} 
                    className="mt-4 text-gray-600 hover:text-gray-800 font-medium transition flex items-center gap-1"
                >
                    <FiX /> Cancel Editing
                </button>
            )}
        </div>

        {/* --- Team List --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                All Teams ({processedTeams.length})
            </h2>
            
            {loading ? (
                <div className="flex justify-center items-center h-20 text-gray-500">
                    <FiClock className="w-6 h-6 animate-spin mr-2" />
                    Loading teams...
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
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Members</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Projects</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {processedTeams.map((team) => (
                                <tr key={team._id} className="hover:bg-indigo-50/50 transition duration-150">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{team.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs overflow-hidden overflow-ellipsis">
                                        <div className="flex flex-wrap gap-2">
                                            {/* Using pre-calculated string for rendering */}
                                            {team.memberStrings.map((memberString, index) => (
                                                <span 
                                                    key={team.members[index].userId}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                                                >
                                                    <FiUser className="w-3 h-3 mr-1" />
                                                    {memberString}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                                        <div className="flex flex-wrap gap-2">
                                            {/* Using pre-calculated array for rendering */}
                                            {team.projectStrings.map((project) => (
                                                <span 
                                                    key={project}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                                >
                                                    <FiCode className="w-3 h-3 mr-1" />
                                                    {project}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button 
                                            onClick={() => startEdit(team)} 
                                            className="text-indigo-600 hover:text-indigo-800 transition font-medium flex items-center justify-end gap-1"
                                        >
                                            <FiEdit className="w-4 h-4" /> Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteTeam(team._id)} 
                                            className="text-red-600 hover:text-red-800 transition font-medium flex items-center justify-end gap-1 mt-1"
                                        >
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