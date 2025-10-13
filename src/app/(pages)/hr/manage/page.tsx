// src/app/hr/manage-users/page.tsx
"use client";

// import ManageUsersPage from "@/components/ManageUsersPage";
// import HRLayout from "@/components/HRLayout";
import ManageUsersPage from "../../admin/manageusers/page";
import HRSidebarLayout from "../HRSidebarLayout";

export default function ManageUsersWrapper() {
  return (
    <HRSidebarLayout>
      <ManageUsersPage />
    </HRSidebarLayout>
  );
}
