"use client";

import React, { ReactNode } from "react";
import AdminSidebar from "./adminsidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return <AdminSidebar>{children}</AdminSidebar>;
};

export default AdminLayout;
