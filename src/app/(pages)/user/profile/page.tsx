"use client";

import React, { useEffect, useState } from "react";
import { EmployeeData } from "@/app/(backend)/api/auth/me/route";
import { FiEdit3, FiSave } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast"; // ✅ import toast

const gradients = [
  ["#60a5fa", "#bfdbfe"], // blue
  ["#4ade80", "#a7f3d0"], // green-teal
  ["#818cf8", "#c7d2fe"], // indigo
  ["#a78bfa", "#ddd6fe"], // purple
  ["#f472b6", "#fbcfe8"], // pink
];

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradientIndex, setGradientIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EmployeeData>>({});

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please login");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.message || "Failed to fetch profile");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.user || null);
        setFormData(data.user || {});
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Gradient change every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (key: keyof EmployeeData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Save profile
  const handleSave = async () => {
    if (!user?._id) {
      setError("User ID not found.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login.");
        return;
      }

      const res = await fetch(`/api/admin/updateuser/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Failed to update profile");
        return;
      }

      const updated = await res.json();
      setUser(updated.user);
      setFormData(updated.user);
      setEditing(false);
      toast.success("Profile updated successfully!"); // ✅ toast instead of alert
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
      toast.error("Failed to update profile"); // ✅ error toast
    }
  };

  const currentGradient = `linear-gradient(90deg, ${gradients[gradientIndex][0]}, ${gradients[gradientIndex][1]})`;

  // Helper function to display only HH:mm or HH:mm:ss for time fields
  const displayTime = (value: string, key: string) => {
    if (key === "joiningTime" || key === "leavingTime") {
      const match = value.match(/\d{2}:\d{2}(:\d{2})?/);
      if (match) return match[0];
    }
    return value;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No profile data available.</p>
      </div>
    );

  return (
    <>
      <Toaster position="top-right" /> {/* ✅ toast container */}
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden relative">
          <div
            style={{
              backgroundImage: currentGradient,
              transition: "background-image 2s ease-in-out",
            }}
            className="p-8 flex items-center gap-6 relative"
          >
            <div
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 cursor-pointer transition-all"
              onClick={() => (editing ? handleSave() : setEditing(true))}
              title={editing ? "Save Profile" : "Edit Profile"}
            >
              {editing ? <FiSave className="text-gray-700 w-5 h-5" /> : <FiEdit3 className="text-gray-700 w-5 h-5" />}
            </div>

            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-3xl shadow-lg bg-gray-300">
                {user.firstName?.[0] ?? "U"}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-white text-lg">{user.role ?? "N/A"}</p>
              <p className="text-white text-sm">{user.department ?? ""}</p>
              <p className="text-white text-sm">{user.employeeId ?? ""}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData)
              .filter(([key]) => key !== "_id" && key !== "createdAt") // hide _id & createdAt
              .map(([key, value]) => (
                <ProfileField
                  key={key}
                  label={key}
                  value={typeof value === "string" ? displayTime(value, key) : (value ?? "").toString()}
                  editing={editing}
                  onChange={(val) => handleInputChange(key as keyof EmployeeData, val)}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

interface ProfileFieldProps {
  label: string;
  value?: string | null;
  editing?: boolean;
  onChange?: (value: string) => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, editing, onChange }) => (
  <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200">
    <span className="text-gray-400 text-sm">{label}</span>
    {editing ? (
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    ) : (
      <span className="text-gray-800 font-semibold">{value ?? "N/A"}</span>
    )}
  </div>
);

export default ProfilePage;
