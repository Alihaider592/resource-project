"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { WorkFromHomeForm } from "@/app/(frontend)/components/form/WorkFromHomeForm";
import WorkFromHomeList from "@/app/(frontend)/components/dashboard/wfh/WorkFromHomeList";

interface DecodedUser {
  name: string;
  email: string;
  role: "user" | "teamlead" | "hr";
}

export default function WFHPage() {
  const [user, setUser] = useState<DecodedUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedUser>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-600">
        Please login to apply for Work From Home
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-10">
      <WorkFromHomeForm user={user} />
      <WorkFromHomeList user={user} />
    </div>
  );
}
