"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiMail,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiArrowLeft,
} from "react-icons/fi";

interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  designation?: string;
  picture?: string;
  avatar?: string;
  joiningDate?: string;
}

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ Helper to build correct image URL (Cloudinary safe fallback)
  const getImageUrl = (img?: string) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    // Replace 'dk9i3x5la' with your real Cloudinary cloud name
    return `https://res.cloudinary.com/dk9i3x5la/image/upload/${img.replace(
      /^uploads\//,
      ""
    )}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchUser = async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          setErrorMsg("Unauthorized: No token found. Please log in again.");
          router.push("/login");
          return;
        }

        const res = await fetch(`/api/admin/getuser/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          console.error("❌ Invalid server response:", await res.text());
          throw new Error("Server returned invalid response format.");
        }

        const data = await res.json();
        if (res.ok && data?.user) {
          setUser(data.user);
        } else {
          setErrorMsg(data?.message || "User not found.");
        }
      } catch (error) {
        console.error("❌ Fetch user failed:", error);
        setErrorMsg(
          error instanceof Error ? error.message : "Error fetching user data."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [id, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading profile...
      </div>
    );

  if (errorMsg)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 font-medium">
        ❌ {errorMsg}
        <button
          onClick={() => router.back()}
          className="mt-4 text-purple-600 underline font-medium"
        >
          ← Go Back
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500">
        ❌ No profile found
        <button
          onClick={() => router.back()}
          className="mt-4 text-purple-600 underline font-medium"
        >
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
              alt={user.name}
              className="w-36 h-36 rounded-full border-4 border-purple-300 shadow-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-avatar.png";
              }}
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-700 border-4 border-purple-200 shadow">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-800 mt-4">{user.name}</h1>
          <p className="text-gray-500 text-sm capitalize">
            {user.role || "Simple User"}
          </p>
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
              <span>
                Joined on {new Date(user.joiningDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            <FiArrowLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
}
