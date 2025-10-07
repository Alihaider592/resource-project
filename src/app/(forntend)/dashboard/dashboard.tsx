"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./SidebarLayout";
import AdminPageContent from "./AdminPageContent";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== "admin") {
          router.push("/login"); 
        } else {
          setUserName(data.user.name); 
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <AdminSidebar>
<AdminPageContent adminName="Admin" />
    </AdminSidebar>
  );
}
