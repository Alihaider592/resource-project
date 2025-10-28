"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types";
// Assuming this path is correct for the Canvas component
import { TeamForm } from "@/app/(frontend)/components/form/teamcreateform"; 

interface Props {
  currentUser: { id: string; role: string }; // HR or Admin
  users: IUser[];
}

export const TeamDashboard: React.FC<Props> = ({ currentUser, users }) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);
  
  // Safely get the token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      // Added Authorization header
      const res = await fetch("/api/teams", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTeams(Array.isArray(data.teams) ? data.teams : data); // Handle potential array in 'teams' or just the data root
      } else {
        toast.error(data.error || "Failed to fetch teams.");
      }
    } catch (error) {
      toast.error("Network error while fetching teams.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [token]);

  // Delete a team
  // NOTE: confirm() is deprecated in complex UIs, consider replacing with a custom modal.
  const deleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      // Added Authorization header
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
      toast.error("Failed to delete team.");
    }
  };

  // Start editing a team
  const startEdit = (team: ITeam) => setEditingTeam(team);
  const stopEdit = () => setEditingTeam(null);

  // Handle update team submit
  const handleEditSubmit = async (updatedTeam: ITeam) => {
    try {
      // Added Authorization header
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
      toast.error("Failed to update team.");
    }
  };

  // Role-based access
  if (!["hr", "admin"].includes(currentUser.role)) {
    return <p className="text-red-500 font-semibold p-8">You do not have permission to manage teams.</p>;
  }

  // Helper to map member ID to name and role for display
  const getMemberDisplay = (members: Member[]) => {
    return members
      .map(
        (m: Member) =>
          users.find((u) => u.id === m.userId)?.name + ` (${m.role})`
      )
      .join(", ");
  };

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      
      {/* Team Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingTeam ? "Edit Team" : "Create New Team"}
        </h2>
        
        {/* --- FIXES APPLIED HERE ---
          1. onSubmit is now required and passes fetchTeams for the create case.
          2. onCancel is added (required by TeamFormProps).
          3. isEditing is added (required by TeamFormProps).
        */}
        <TeamForm
          currentUser={currentUser}
          users={users}
          initialTeam={editingTeam || undefined}
          onSubmit={editingTeam ? handleEditSubmit : fetchTeams} 
          onCancel={stopEdit} // Required prop
          isEditing={!!editingTeam} // Required prop
        />

        {editingTeam && (
          // The cancel button is integrated into TeamForm's style now, but keeping this for explicit cancellation visibility
          <button
            onClick={stopEdit}
            className="mt-4 text-gray-600 hover:text-gray-900 transition font-medium"
          >
            Cancel Editing
          </button>
        )}
      </div>

      {/* Team List */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">All Teams</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-medium text-gray-700 border-b">Team Name</th>
                <th className="p-3 font-medium text-gray-700 border-b">Members</th>
                <th className="p-3 font-medium text-gray-700 border-b">Projects</th>
                <th className="p-3 font-medium text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="p-3 border-b">{team.name}</td>
                  <td className="p-3 border-b">
                    {getMemberDisplay(team.members)}
                  </td>
                  <td className="p-3 border-b">{team.projects.join(", ")}</td>
                  <td className="p-3 border-b flex gap-3">
                    <button
                      onClick={() => startEdit(team)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTeam(team._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No teams created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
