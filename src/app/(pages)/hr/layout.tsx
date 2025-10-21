"use client";

import React, { ReactNode } from "react";
import HRSidebarLayout from "./HRSidebarLayout";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <HRSidebarLayout>
      <div className="flex-1 overflow-auto p-6 bg-gray-100">
        {children}
      </div>
    </HRSidebarLayout>
  );
};

export default UserLayout;
