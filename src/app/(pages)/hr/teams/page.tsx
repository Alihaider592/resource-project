"use client"; 
import { TeamDashboard } from "@/app/(frontend)/components/teamlist"; 
import { IUser } from "@/app/(backend)/models/types";
const currentUser = { id: "admin1", role: "hr" }; 
const users: IUser[] = []; 
export default function TeamsPage() {
  return <TeamDashboard currentUser={currentUser} users={users} />;
}
