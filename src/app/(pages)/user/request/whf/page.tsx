"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { WorkFromHomeForm } from "@/app/(frontend)/components/form/WorkFromHomeForm";

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
        console.error("Invalid token", error);
      }
    }
  }, []);

  if (!user) return <p className="text-center mt-10">Please login to apply for WFH</p>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <WorkFromHomeForm user={user} />
    </div>
  );
}
