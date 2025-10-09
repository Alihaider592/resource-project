"use client";
import TeamLeadSidebarLayout from "./teamleadsidebar";
import React,{ReactNode} from "react";
export default function DashboardPage() {
    interface TeamLeadLayoutProps {
      children: ReactNode;
    }
const TeamLeadLayout = ({ children }: TeamLeadLayoutProps) => {
  return <TeamLeadSidebarLayout>{children}</TeamLeadSidebarLayout>;
};
}
