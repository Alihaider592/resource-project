import { ITeam, Member } from "@/app/(backend)/models/types";

export interface UpdateTeamInput {
  teamId: string;
  name: string;
  members: Member[];
  projects?: string[];
}

/**
 * Update a team via API
 * @param input UpdateTeamInput
 * @returns Updated team object
 */
export const updateTeam = async ({ teamId, name, members, projects = [] }: UpdateTeamInput): Promise<ITeam> => {
  const res = await fetch(`/api/teams/update/${teamId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, members, projects }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update team");
  }

  return data as ITeam;
};
