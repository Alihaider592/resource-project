"use client";

import React, { ReactNode } from "react";
// import UserSidebarLayout from "./usersidebar";
import HRSidebarLayout from "./HRSidebarLayout";

interface userLayoutProps {
  children: ReactNode;
}

const userLayout = ({ children }: userLayoutProps) => {
  return <HRSidebarLayout>{children}</HRSidebarLayout>;
};

export default userLayout;
