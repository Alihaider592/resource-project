// src/models/types.ts
export interface IUser {
  id: string;
  name: string;
  email?: string;
  role: "user" | "teamlead" | "hr" | "admin";
}

export interface Member {
  userId: string;
  role: "teamlead" | "member";
}

export interface ITeam {
  _id: string;
  name: string;
  members: Member[];
  projects: string[];
  createdBy: string;
  createdAt?: Date;
}
