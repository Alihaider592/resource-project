"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiX, FiUsers, FiClipboard, FiZap } from "react-icons/fi";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types"; 

// --- Interface and Helper Definitions ---

interface TeamFormProps {
  currentUser: { id: string; role: string };
  users: IUser[];
  initialTeam?: ITeam; 
  onSubmit?: (updatedTeam: ITeam) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const getUserDisplay = (user: IUser) => `${user.name} (${user.email}) - ${user.role}`;

const getValidUserId = (currentUser: TeamFormProps['currentUser'], users: IUser[]) => {
  if (currentUser.id && /^[a-fA-F0-9]{24}$/i.test(currentUser.id)) {
    return currentUser.id;
  }
  const firstUser = users[0];
  if (firstUser && /^[a-fA-F0-9]{24}$/i.test(firstUser.id)) {
    return firstUser.id;
  }
  return [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
};


export const TeamForm: React.FC<TeamFormProps> = ({
  currentUser,
  users,
  initialTeam,
  onCancel,
  onSubmit,
  isEditing = false,
}) => {
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

  // --- Member Selection Logic ---
  const toggleDropdown = () => {
    if (!dropdownOpen) {
      setTempSelected(members);
    }
    setDropdownOpen((prev) => !prev);
  };

  const handleCheckboxToggle = (id: string) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const availableUsers = users.map((u) => u.id.toString()).filter(id => id !== teamLead);
    const selectedAvailable = tempSelected.filter(id => availableUsers.includes(id));

    if (selectedAvailable.length === availableUsers.length) {
      setTempSelected([]);
    } else {
      setTempSelected(availableUsers);
    }
  };

  const handleDone = () => {
    setMembers(tempSelected.filter((id) => id !== teamLead));
    setDropdownOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((i) => i !== id));
  };

  // --- Projects Logic ---
  const handleAddProject = () => setProjects([...projects, ""]);
  const handleProjectChange = (index: number, value: string) => {
    const updated = [...projects];
    updated[index] = value;
    setProjects(updated);
  };
  const handleRemoveProject = (index: number) =>
    setProjects(projects.filter((_, i) => i !== index));

  // --- Submission Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = getValidUserId(currentUser, users);

    if (!teamName.trim()) return toast.error("Team name is required.");
    if (!teamLead) return toast.error("Team Lead is required.");

    const memberObjects: Member[] = [
        { userId: teamLead.toString(), role: "teamlead" as const }, 
        ...members.map((m) => ({ 
            userId: m.toString(), 
            role: "member" as const 
        })),
    ].filter((m, index, self) => 
        index === self.findIndex((t) => (
            t.userId === m.userId
        ))
    );

    const teamData = {
      name: teamName.trim(),
      members: memberObjects,
      projects: projects.filter((p) => p.trim() !== ""),
      createdBy: userId,
    };

    try {
      setLoading(true);

      const teamId = (initialTeam as ITeam & { _id?: string })?._id || (initialTeam as ITeam & { id?: string })?.id;
      const apiEndpoint = isEditing 
        ? `/api/teams/update/${teamId}` 
        : "/api/teams/create";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} team`);

      toast.success(isEditing ? "✅ Team updated successfully!" : "🚀 Team created successfully!");

      if (onSubmit) await onSubmit(teamData as ITeam);

      // --- FORM RESET LOGIC ---
      if (!isEditing) {
        setTeamName("");
        setProjects([""]);
        setTeamLead("");
        setMembers([]);
        setTempSelected([]);
      } else {
        // If editing, typically you close the form/modal
        if (onCancel) onCancel();
      }
      // --- END FORM RESET LOGIC ---

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(`❌ ${msg}`);
      console.error("Error submitting team:", err);
    } finally {
      setLoading(false);
    }
  };

  const availableMembers = users.filter(u => u.id.toString() !== teamLead);
  const selectedMembers = members.map(id => users.find(u => u.id.toString() === id)).filter(Boolean) as IUser[];
  const isAllSelected = tempSelected.length === availableMembers.length && availableMembers.length > 0;
  const isTeamLeadSelectedAsMember = members.includes(teamLead);

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? "⚙️ Edit Team" : ""}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* --- Team Details Section --- */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
            <FiZap className="text-indigo-500" /> Basic Details
          </h3>

          {/* Team Name */}
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Alpha Squad"
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
              required
            />
          </div>

          {/* Team Lead */}
          <div>
            <label htmlFor="teamLead" className="block text-sm font-medium text-gray-700 mb-1">
              Team Lead
            </label>
            <select
              id="teamLead"
              value={teamLead}
              onChange={(e) => {
                setTeamLead(e.target.value);
                setMembers(prev => prev.filter(id => id !== e.target.value));
              }}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 bg-white focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
              required
            >
              <option value="" disabled>
                Select the Team Lead
              </option>
              {users.map((u) => (
                <option key={u.id.toString()} value={u.id.toString()}>
                  {getUserDisplay(u)}
                </option>
              ))}
            </select>
            {teamLead && isTeamLeadSelectedAsMember && (
                <p className="mt-2 text-sm text-red-500">
                    <FiX className="inline mr-1" /> Note: The selected Team Lead has been removed from the general members list.
                </p>
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* --- Members Section --- */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
            <FiUsers className="text-indigo-500" /> Team Members
          </h3>

          <div className="flex flex-wrap gap-2 min-h-10"> 
            {selectedMembers.length === 0 ? (
              <p className="text-gray-500 text-sm italic py-2">No members selected (excluding Team Lead).</p>
            ) : (
              selectedMembers.map((user) => (
                <div
                  key={user.id.toString()}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200 transition duration-150 hover:bg-indigo-100"
                >
                  <span className="truncate max-w-xs">{user.name}</span>
                  <FiX
                    onClick={() => handleRemoveMember(user.id.toString())}
                    className="cursor-pointer text-indigo-500 hover:text-red-500 w-4 h-4"
                  />
                </div>
              ))
            )}
          </div>

          {/* Dropdown Toggle Button */}
          <button
            type="button"
            onClick={toggleDropdown}
            className={`w-full flex justify-between items-center px-4 py-3 border rounded-lg transition duration-150 ${
              dropdownOpen
                ? "bg-indigo-50 text-indigo-700 border-indigo-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } shadow-sm`}
          >
            <span>{dropdownOpen ? "Hide Selection Menu" : `Select ${availableMembers.length} Available Members`}</span>
            {dropdownOpen ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
          </button>

          {/* Dropdown Content */}
          {dropdownOpen && (
            <div className="border border-indigo-300 mt-2 p-4 max-h-72 overflow-y-auto rounded-lg bg-indigo-50 shadow-lg space-y-2">
              <div className="flex items-center gap-3 pb-2 mb-2 border-b border-indigo-200">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  id="select-all"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="select-all" className="cursor-pointer font-semibold text-indigo-700">
                  Select All Available ({availableMembers.length})
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                  <span className="font-bold">Note:</span> The selected Team Lead is excluded from this list.
              </p>

              {availableMembers.map((u) => {
                const isChecked = tempSelected.includes(u.id.toString());
                return (
                  <div
                    key={u.id.toString()}
                    className={`flex items-center gap-3 p-2 rounded-md transition duration-100 ${
                      isChecked ? 'bg-indigo-100' : 'hover:bg-indigo-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxToggle(u.id.toString())}
                      id={`member-${u.id.toString()}`}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={`member-${u.id.toString()}`} className="cursor-pointer text-gray-800 flex-1">
                      {getUserDisplay(u)}
                    </label>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleDone}
                className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-150 shadow-md"
              >
                Apply Selection
              </button>
            </div>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* --- Projects Section --- */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
            <FiClipboard className="text-indigo-500" /> Associated Projects
          </h3>
          <div className="space-y-3">
            {projects.map((p, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={p}
                  onChange={(e) => handleProjectChange(i, e.target.value)}
                  placeholder={`Project ${i + 1} Name (Optional)`}
                  className="border border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveProject(i)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg transition duration-150"
                  aria-label={`Remove Project ${i + 1}`}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddProject}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium mt-2 transition duration-150"
          >
            <FiPlus className="w-5 h-5" /> Add Project Field
          </button>
        </div>

        {/* --- Action Buttons --- */}
        <div className="pt-6 flex justify-end gap-3 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 shadow-sm"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-purple-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isEditing ? "Save Changes" : "Create Team"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};