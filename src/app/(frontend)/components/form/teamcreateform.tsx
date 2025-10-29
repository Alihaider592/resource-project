"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types";
import { Types } from "mongoose";

interface TeamFormProps {
  currentUser: { id: string; role: string }; // must be MongoDB ObjectId string
  users: IUser[]; // IUser must include `id: string` field
  initialTeam?: ITeam;
  onSubmit?: (updatedTeam: ITeam) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  currentUser,
  users,
  initialTeam,
  onCancel,
  isEditing = false,
}) => {
  // -------------------------
  // State
  // -------------------------
  const [teamName, setTeamName] = useState(initialTeam?.name || "");
  const [projects, setProjects] = useState<string[]>(initialTeam?.projects || [""]);
  const [teamLead, setTeamLead] = useState<string>(
    initialTeam?.members.find((m) => m.role === "teamlead")?.userId.toString() || ""
  );
  const [members, setMembers] = useState<string[]>(
    initialTeam
      ? initialTeam.members
          .filter((m) => m.role === "member")
          .map((m) => m.userId.toString())
      : []
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(members);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Dropdown logic
  // -------------------------
  const toggleDropdown = () => {
    setTempSelected(members);
    setDropdownOpen((prev) => !prev);
  };

  const handleCheckboxToggle = (id: string) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (tempSelected.length === users.length) setTempSelected([]);
    else setTempSelected(users.map((u) => u.id.toString()));
  };

  const handleDone = () => {
    setMembers(tempSelected);
    setDropdownOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((i) => i !== id));
  };

  // -------------------------
  // Projects logic
  // -------------------------
  const handleAddProject = () => setProjects([...projects, ""]);
  const handleProjectChange = (index: number, value: string) => {
    const updated = [...projects];
    updated[index] = value;
    setProjects(updated);
  };
  const handleRemoveProject = (index: number) =>
    setProjects(projects.filter((_, i) => i !== index));

  // -------------------------
  // Submit handler
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) return toast.error("Team name is required.");
    if (!teamLead) return toast.error("Team Lead is required.");

    // Build Member objects
const memberObjects: Member[] = [
  { userId: teamLead, role: "teamlead" as const },  
  ...members.map((m) => ({ userId: m, role: "member" as const })),
];


const teamData = {
  name: teamName.trim(),
  members: memberObjects,
  projects: projects.filter((p) => p.trim() !== ""),
  createdBy: currentUser.id,
};


    try {
      setLoading(true);

      const res = await fetch("/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...teamData,
          userRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create team");

      toast.success(isEditing ? "✅ Team updated!" : "✅ Team created!");
      setTeamName("");
      setProjects([""]);
      setTeamLead("");
      setMembers([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(`❌ ${msg}`);
      console.error("Error creating team:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team Name */}
      <div>
        <label className="font-medium text-gray-700">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Team Lead */}
      <div>
        <label className="font-medium text-gray-700">Team Lead</label>
        <select
          value={teamLead}
          onChange={(e) => setTeamLead(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="" disabled>
            Select Team Lead
          </option>
          {users.map((u) => (
            <option key={u.id.toString()} value={u.id.toString()}>
              {u.name} ({u.email}) — {u.role}
            </option>
          ))}
        </select>
      </div>

      {/* Members */}
      <div>
        <label className="font-medium text-gray-700">Members</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {members.length === 0 ? (
            <p className="text-gray-500 text-sm">No members selected</p>
          ) : (
            members.map((id) => {
              const user = users.find((u) => u.id.toString() === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-full text-sm"
                >
                  {user ? (
                    <>
                      {user.name} ({user.email}) — {user.role}
                      <FiX
                        onClick={() => handleRemoveMember(id)}
                        className="ml-2 cursor-pointer text-gray-600 hover:text-red-500"
                      />
                    </>
                  ) : (
                    id
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Dropdown */}
        <div
          className="border p-2 rounded cursor-pointer bg-white"
          onClick={toggleDropdown}
        >
          Click to {dropdownOpen ? "close" : "select members"}
        </div>

        {dropdownOpen && (
          <div className="border mt-2 p-2 max-h-60 overflow-y-auto rounded bg-white space-y-1 shadow-md">
            <div className="flex items-center gap-2 border-b pb-2 mb-2">
              <input
                type="checkbox"
                checked={tempSelected.length === users.length}
                onChange={handleSelectAll}
                id="select-all"
              />
              <label htmlFor="select-all" className="cursor-pointer font-semibold">
                Select All
              </label>
            </div>

            {users.map((u) => (
              <div key={u.id.toString()} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempSelected.includes(u.id.toString())}
                  onChange={() => handleCheckboxToggle(u.id.toString())}
                  id={`member-${u.id.toString()}`}
                />
                <label htmlFor={`member-${u.id.toString()}`} className="cursor-pointer">
                  {u.name} ({u.email}) — {u.role}
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={handleDone}
              className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        <label className="font-medium text-gray-700">Projects</label>
        {projects.map((p, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              type="text"
              value={p}
              onChange={(e) => handleProjectChange(i, e.target.value)}
              placeholder="Project Name"
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleRemoveProject(i)}
              className="text-red-500 p-2"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddProject}
          className="mt-2 text-indigo-600 flex items-center gap-1"
        >
          <FiPlus /> Add Project
        </button>
      </div>

      {/* Submit */}
      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : isEditing ? "Save Changes" : "Create Team"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
