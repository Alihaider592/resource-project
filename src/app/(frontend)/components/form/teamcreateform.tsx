"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types";

// Helper to generate a valid MongoDB ObjectId (24-character hex)
const generateObjectId = (): string => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
      .toLowerCase()
  );
};

interface TeamFormProps {
  currentUser: { id: string; role: string };
  users: IUser[];
  initialTeam?: ITeam;
  onCancel: () => void;
  isEditing: boolean;
  onSubmit: (team: ITeam) => Promise<void>;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  currentUser,
  users,
  initialTeam,
  onCancel,
  isEditing,
  onSubmit,
}) => {
  const [teamName, setTeamName] = useState(initialTeam?.name || "");
  const [projects, setProjects] = useState<string[]>(
    initialTeam?.projects || [""]
  );
  const [teamLead, setTeamLead] = useState<string>(
    initialTeam?.members.find((m) => m.role === "teamlead")?.userId || ""
  );
  const [members, setMembers] = useState<string[]>(
    initialTeam
      ? initialTeam.members
          .filter((m) => m.role === "member")
          .map((m) => m.userId)
      : []
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(members);

  const toggleDropdown = () => {
    setTempSelected(members);
    setDropdownOpen((prev) => !prev);
  };

  const handleCheckboxToggle = (userId: string) => {
    setTempSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (tempSelected.length === users.length) setTempSelected([]);
    else setTempSelected(users.map((u) => u.id));
  };

  const handleDone = () => {
    setMembers(tempSelected);
    setDropdownOpen(false);
  };

  const handleAddProject = () => setProjects([...projects, ""]);
  const handleProjectChange = (index: number, value: string) => {
    const updated = [...projects];
    updated[index] = value;
    setProjects(updated);
  };
  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) return toast.error("Team name is required.");
    if (!teamLead) return toast.error("Team Lead is required.");
    if (members.some((m) => !m))
      return toast.error("All member slots must have a user selected.");

    // Cast roles explicitly to match Member type
    const memberObjects: Member[] = [
      { userId: teamLead, role: "teamlead" as const },
      ...members.map((m) => ({ userId: m, role: "member" as const })),
    ];

    const teamData: ITeam = {
      _id: initialTeam?._id || generateObjectId(),
      name: teamName.trim(),
      members: memberObjects,
      projects: projects.filter((p) => p.trim() !== ""),
      createdBy:
        currentUser.id.length === 24 ? currentUser.id : generateObjectId(),
      createdAt: initialTeam?.createdAt || new Date(),
    };

    try {
      await onSubmit(teamData);
      toast.success(
        isEditing ? "Team updated successfully" : "Team created successfully"
      );
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Something went wrong");
      console.error("Error submitting team:", err);
    }
  };

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
            <option key={u.id} value={u.id}>
              {u.name} ({u.email || u.id})
            </option>
          ))}
        </select>
      </div>

      {/* Members */}
      <div>
        <label className="font-medium text-gray-700">Members</label>
        <div
          className="border p-2 rounded cursor-pointer bg-white"
          onClick={toggleDropdown}
        >
          {members.length === 0
            ? "Click to select members"
            : members
                .map((id) => users.find((u) => u.id === id)?.name)
                .join(", ")}
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
              <label
                htmlFor="select-all"
                className="cursor-pointer font-semibold"
              >
                Select All
              </label>
            </div>
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tempSelected.includes(u.id)}
                  onChange={() => handleCheckboxToggle(u.id)}
                  id={`member-${u.id}`}
                />
                <label htmlFor={`member-${u.id}`} className="cursor-pointer">
                  {u.name} ({u.email || u.id})
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
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {isEditing ? "Save Changes" : "Create Team"}
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
