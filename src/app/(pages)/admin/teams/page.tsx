"use client"; 
import { TeamDashboard } from "@/app/(frontend)/components/teamlist"; 

const currentUser = { id: "admin1", role: "admin" }; 

export default function TeamsPage() {
  return <TeamDashboard currentUser={currentUser} />;
}
