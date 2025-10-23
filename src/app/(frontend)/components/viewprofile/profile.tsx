"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  teamId?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
}

interface UserProfileProps {
  userType: "admin" | "hr" | "simple user";
}

const UserProfile: React.FC<UserProfileProps> = ({ userType }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id?: string }>();

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized. Please login again.");
          return;
        }

        if (!params?.id) {
          toast.error("❌ User ID is required.");
          return;
        }

        const endpoint =
          userType === "admin"
            ? `/api/admin/getusers/${params.id}`
            : userType === "hr"
            ? `/api/hr/getusers/${params.id}`
            : `/api/user/getusers/${params.id}`;

        const res = await axios.get<ApiResponse>(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        } else {
          toast.error(res.data.message || "Failed to fetch profile.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to fetch user data.");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [params?.id, userType]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-gray-600">No user found.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <h1 className="text-xl font-semibold mb-6 text-center text-purple-600">
        {userType.toUpperCase()} Profile
      </h1>
      <div className="space-y-3 text-gray-700">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        {user.teamId && (
          <p>
            <strong>Team ID:</strong> {user.teamId}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
