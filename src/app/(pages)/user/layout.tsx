"use client";

import React, { ReactNode } from "react";
import UserSidebarLayout from "./usersidebar";

interface userLayoutProps {
  children: ReactNode;
}

const userLayout = ({ children }: userLayoutProps) => {
  return <UserSidebarLayout>{children}</UserSidebarLayout>;
};

export default userLayout;
