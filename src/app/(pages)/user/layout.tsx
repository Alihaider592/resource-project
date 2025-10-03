"use client";

import React, { ReactNode } from "react";
// import AdminSidebar from "./AdminSidebar";
// import AdminSidebar from "./adminsidebar";
import SidebarLayout from "./userdashboard";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default AdminLayout;
