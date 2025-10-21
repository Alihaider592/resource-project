
export interface LeaveRequest {
  _id: string;
  name?: string;          
  email?: string;         
  leaveType: string;
  startDate: string;      
  endDate: string;        
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvers?: {
    teamLead?: string | null;
    hr?: string | null;
  };
}

export interface StatCard {
  title: string;
  value: number;
  icon: React.ReactElement;
  color: "green" | "yellow" | "red" | "blue"; 
}

export interface Task {
  title: string;
  status: "Pending" | "In Progress" | "Completed"; }

export interface Project {
  name: string;
  progress: number;          
}
