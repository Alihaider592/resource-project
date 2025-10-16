"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiMail, FiUser, FiBriefcase, FiCalendar, FiArrowLeft } from "react-icons/fi";
import axios from "axios";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  department?: string;
  designation?: string;
  avatar?: string;
  picture?: string;
  joiningDate?: string;
}

// API response can be either a user or an error message
interface ApiResponse {
  user?: UserProfile;
  message?: string;
}

const AdminUserProfile = () => {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getImageUrl = (img?: string) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `https://res.cloudinary.com/dk9i3x5la/image/upload/${img.replace(/^uploads\//, "")}`;
  };

  useEffect(() => {
    if (!params.id) return;

    const fetchUser = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        // ✅ Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMsg("Unauthorized: No token found. Please log in.");
          router.push("/login");
          return;
        }

        // ✅ Fetch user with Authorization header
        const res = await axios.get<ApiResponse>(`/api/admin/getusers/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 && res.data.user) {
          setUser(res.data.user);
        } else {
          setErrorMsg(res.data.message || "User not found.");
        }
      } catch (error) {
        console.error("❌ Fetch user failed:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setErrorMsg("Unauthorized: Please log in again.");
            localStorage.removeItem("token");
            router.push("/login");
          } else {
            setErrorMsg(error.response?.data?.message || error.message);
          }
        } else if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg("Failed to fetch user.");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [params.id, router]);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">Loading profile...</div>;

  if (errorMsg)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 font-medium">
        ❌ {errorMsg}
        <button onClick={() => router.back()} className="mt-4 text-purple-600 underline font-medium">
          ← Go Back
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500">
        ❌ No profile found
        <button onClick={() => router.back()} className="mt-4 text-purple-600 underline font-medium">
          ← Go Back
        </button>
      </div>
    );

  const imageUrl = getImageUrl(user.picture || user.avatar);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-10 px-6 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-36 h-36 rounded-full border-4 border-purple-300 shadow-md object-cover"
              onError={(e) => ((e.target as HTMLImageElement).src = "/fallback-avatar.png")}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-700 border-4 border-purple-200 shadow">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 text-sm capitalize">{user.role || "Simple User"}</p>
        </div>

        <div className="space-y-5 text-gray-700 text-base">
          <div className="flex items-center gap-3">
            <FiMail className="text-purple-600" />
            <span>{user.email}</span>
          </div>
          {user.department && (
            <div className="flex items-center gap-3">
              <FiBriefcase className="text-purple-600" />
              <span>{user.department}</span>
            </div>
          )}
          {user.designation && (
            <div className="flex items-center gap-3">
              <FiUser className="text-purple-600" />
              <span>{user.designation}</span>
            </div>
          )}
          {user.joiningDate && (
            <div className="flex items-center gap-3">
              <FiCalendar className="text-purple-600" />
              <span>Joined on {new Date(user.joiningDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition shadow-md">
            <FiArrowLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;
