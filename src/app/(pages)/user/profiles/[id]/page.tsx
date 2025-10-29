"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser } from "@/app/(backend)/models/types";

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/user/profile/${id}`)
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
      <p className="mb-1"><strong>Email:</strong> {user.email}</p>
      <p className="mb-1"><strong>Role:</strong> {user.role}</p>
      {/* <p className="mb-1"><strong>Phone:</strong> {user.phone || "N/A"}</p> */}
      {/* Add any other fields you need */}
    </div>
  );
}
