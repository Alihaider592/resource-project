"use client";

import React, { ReactNode } from "react";
import SidebarLayout from "./userdashboard";

interface userLayoutProps {
  children: ReactNode;
}

const userLayout = ({ children }: userLayoutProps) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default userLayout;
