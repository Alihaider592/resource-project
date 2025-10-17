"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiBriefcase, FiEdit3, FiSave } from "react-icons/fi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // ✅ import toast

interface ApiResponse {
  user?: Record<string, unknown>;
  message?: string;
}

interface UserProfileProps {
  userType?: "admin" | "hr"; // default is admin
}

const UserProfile: React.FC<UserProfileProps> = ({ userType = "admin" }) => {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const getImageUrl = (img?: string) => {
    if (!img || typeof img !== "string") return null;
    if (img.startsWith("http")) return img;
    return `https://res.cloudinary.com/dk9i3x5la/image/upload/${img.replace(/^uploads\//, "")}`;
  };

  useEffect(() => {
    if (!params.id) return;

    const fetchUser = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMsg("Unauthorized. Please log in.");
          router.push("/login");
          return;
        }

        const endpoint =
          userType === "hr"
            ? `/api/hr/getusers/${params.id}`
            : `/api/admin/getusers/${params.id}`;

        const res = await axios.get<ApiResponse>(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 && res.data.user) {
          setUser(res.data.user);
          setFormData(res.data.user);
        } else {
          setErrorMsg(res.data.message || "User not found.");
        }
      } catch (error: unknown) {
        console.error("Fetch user failed:", error);
        if (axios.isAxiosError(error)) {
          setErrorMsg(error.response?.data?.message || error.message);
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
  }, [params.id, router, userType]);

  const hiddenFields = ["avatar", "picture", "_id", "createdAt", "updatedAt", "joiningDate", "leaving", "leavingDate", "password"];

  const getFieldIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "email":
        return <FiMail className="text-purple-600" />;
      case "phone":
        return <FiPhone className="text-purple-600" />;
      case "department":
      case "designation":
        return <FiBriefcase className="text-purple-600" />;
      case "address":
      case "city":
      case "state":
      case "zip":
        return <FiMapPin className="text-purple-600" />;
      default:
        return null;
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?.["_id"]) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Unauthorized. Please login.");
        return;
      }

      const endpoint =
        userType === "hr"
          ? `/api/hr/updateuser/${user["_id"]}`
          : `/api/admin/updateuser/${user["_id"]}`;

      const res = await axios.put(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.user) {
        setUser(res.data.user);
        setFormData(res.data.user);
        setEditing(false);
        toast.success("Profile updated successfully!"); // ✅ toast instead of alert
      } else {
        setErrorMsg(res.data.message || "Failed to update user.");
      }
    } catch (error: unknown) {
      console.error("Update user failed:", error);
      setErrorMsg("Failed to update user.");
    }
  };

  if (loading)
    return <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">Loading profile...</div>;

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

  const imageUrl = getImageUrl((user.picture as string) || (user.avatar as string));

  return (
    <>
      <Toaster position="top-right" /> {/* ✅ Toast container */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
          {/* Edit Icon Top Right */}
          <div className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 cursor-pointer transition-all z-10"
               onClick={() => editing ? handleSave() : setEditing(true)}
               title={editing ? "Save Profile" : "Edit Profile"}>
            {editing ? <FiSave className="text-gray-700 w-5 h-5" /> : <FiEdit3 className="text-gray-700 w-5 h-5" />}
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-8 flex flex-col items-center text-white">
            {imageUrl ? (
              <div className="relative w-36 h-36 rounded-full shadow-lg ring-4 ring-white overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`${user.firstName as string || "User"} ${user.lastName as string || ""}`}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => ((e.target as HTMLImageElement).src = "/fallback-avatar.png")}
                />
              </div>
            ) : (
              <div className="w-36 h-36 rounded-full bg-purple-400 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg ring-4 ring-white">
                {(user.firstName as string)?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <h1 className="text-3xl font-bold mt-4">{user.firstName as string} {user.lastName as string}</h1>
            <p className="text-sm mt-1 capitalize">{user.role as string || "Simple User"}</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            {Object.entries(formData).map(([key, value]) => {
              if (!value && !editing) return null;
              if (hiddenFields.includes(key)) return null;

              const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
              const displayValue =
                typeof value === "string" && key.toLowerCase().includes("date")
                  ? new Date(value).toLocaleDateString()
                  : value?.toString() || "";

              const icon = getFieldIcon(key);

              return (
                <div
                  key={key}
                  className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition"
                >
                  {icon && <span className="text-xl">{icon}</span>}
                  <div className="flex flex-col w-full">
                    <span className="text-gray-500 text-sm">{label}</span>
                    {editing ? (
                      <input
                        type="text"
                        value={displayValue}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                      />
                    ) : (
                      <span className="text-gray-800 font-medium">{displayValue}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-8 flex justify-start bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition shadow-lg"
            >
              <FiArrowLeft /> Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
