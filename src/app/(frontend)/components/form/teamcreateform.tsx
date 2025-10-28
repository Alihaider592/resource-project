// TeamForm.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { ITeam, IUser, Member } from "@/app/(backend)/models/types";

interface TeamFormProps {
  currentUser: { id: string; role: string };
  users: IUser[];
  initialTeam?: ITeam;
  onSubmit: (team: ITeam) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  currentUser,
  users,
  initialTeam,
  onSubmit,
  onCancel,
  isEditing
}) => {
  const [teamName, setTeamName] = useState(initialTeam?.name || "");
  const [projects, setProjects] = useState<string[]>(initialTeam?.projects || [""]);
  const [teamLead, setTeamLead] = useState<string>(
    initialTeam?.members.find(m => m.role === "teamlead")?.userId || ""
  );

  // Members
  const [members, setMembers] = useState<string[]>(
    initialTeam
      ? initialTeam.members.filter(m => m.role === "member").map(m => m.userId)
      : []
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(members);

  const toggleDropdown = () => {
    setTempSelected(members);
    setDropdownOpen(prev => !prev);
  };

  const handleCheckboxToggle = (userId: string) => {
    setTempSelected(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // Select all / deselect all
  const handleSelectAll = () => {
    if (tempSelected.length === users.length) {
      setTempSelected([]);
    } else {
      setTempSelected(users.map(u => u.id));
    }
  };

  const handleDone = () => {
    setMembers(tempSelected);
    setDropdownOpen(false);
  };

  const handleRemoveMember = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  // Project handlers
  const handleAddProject = () => setProjects([...projects, ""]);
  const handleProjectChange = (index: number, value: string) => {
    const updated = [...projects];
    updated[index] = value;
    setProjects(updated);
  };
  const handleRemoveProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return toast.error("Team name is required.");
    if (!teamLead) return toast.error("Team Lead is required.");
    if (members.some(m => !m)) return toast.error("All member slots must have a user selected.");

    const TEAMLEAD_ROLE = "teamlead" as const;
    const MEMBER_ROLE = "member" as const;

    const memberObjects: Member[] = [
      { userId: teamLead, role: TEAMLEAD_ROLE },
      ...members.map(m => ({ userId: m, role: MEMBER_ROLE }))
    ];

    const teamData: ITeam = {
      _id: initialTeam?._id || crypto.randomUUID(),
      name: teamName.trim(),
      members: memberObjects,
      projects: projects.filter(p => p.trim() !== ""),
      createdBy: initialTeam?.createdBy || currentUser.id,
      createdAt: initialTeam?.createdAt || new Date(),
    };

    await onSubmit(teamData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Team Name */}
      <div>
        <label className="font-medium text-gray-700">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
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
          onChange={e => setTeamLead(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="" disabled>Select Team Lead</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email || u.id})
            </option>
          ))}
        </select>
      </div>

      {/* Members selection field */}
      <div>
        <label className="font-medium text-gray-700">Members</label>
        <div
          className="border p-2 rounded cursor-pointer bg-white"
          onClick={toggleDropdown}
        >
          {members.length === 0
            ? "Click to select members"
            : members.map(id => users.find(u => u.id === id)?.name).join(", ")}
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="border mt-2 p-2 max-h-60 overflow-y-auto rounded bg-white space-y-1 shadow-md">
            {/* Select All */}
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

            {users.map(u => (
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

      {/* Auto-generated readonly member fields */}
      {members.length > 0 && (
        <div className="mt-2 space-y-2">
          {members.map((m, i) => {
            const user = users.find(u => u.id === m);
            return (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="border p-2 rounded flex-1 bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMember(i)}
                  className="text-red-500 p-2"
                >
                  <FiTrash2 />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Projects */}
      <div>
        <label className="font-medium text-gray-700">Projects</label>
        {projects.map((p, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <input
              type="text"
              value={p}
              onChange={e => handleProjectChange(i, e.target.value)}
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
