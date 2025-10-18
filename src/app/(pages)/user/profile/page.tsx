"use client";

import React, { useEffect, useState } from "react";
import { EmployeeData } from "@/app/(backend)/api/auth/me/route";
import { FiEdit3, FiSave } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const gradients = [
  ["#60a5fa", "#bfdbfe"],
  ["#4ade80", "#a7f3d0"],
  ["#818cf8", "#c7d2fe"],
  ["#a78bfa", "#ddd6fe"],
  ["#f472b6", "#fbcfe8"],
];

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EmployeeData>>({});
  const [gradientIndex, setGradientIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please login.");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          const errData = await res.json().catch(() => ({}));
          toast.error(errData.message || "Unauthorized. Please login.");
          router.push("/login");
          return;
        }

        const data = await res.json();
        if (!data.user) {
          localStorage.removeItem("token");
          toast.error("Unauthorized access.");
          router.push("/login");
          return;
        }

        setUser(data.user);
        setFormData(data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        toast.error("An unexpected error occurred.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (key: keyof EmployeeData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?._id) return toast.error("User ID not found.");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized. Please login.");
        router.push("/login");
        return;
      }

      // Determine API endpoint
      const role = user.role?.toLowerCase().replace(/\s+/g, "");
      const updateUrl =
        role === "admin"
          ? `/api/admin/updateuser/${user._id}` // Admin can update any user
          : `/api/auth/me`; // Others update self

      const res = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to update profile");
        return;
      }

      const updated = await res.json();
      const updatedUser = updated.user || updated; // normalize
      setUser(updatedUser);
      setFormData(updatedUser);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const currentGradient = `linear-gradient(90deg, ${gradients[gradientIndex][0]}, ${gradients[gradientIndex][1]})`;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
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
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden relative">
          {/* Header */}
          <div
            style={{ backgroundImage: currentGradient, transition: "background-image 2s ease-in-out" }}
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
              <h1 className="text-4xl font-bold text-white">{user.firstName} {user.lastName}</h1>
              <p className="text-white text-lg">{user.role ?? "N/A"}</p>
              <p className="text-white text-sm">{user.department ?? ""}</p>
              <p className="text-white text-sm">{user.employeeId ?? ""}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData)
              .filter(([key]) => key !== "_id" && key !== "createdAt")
              .map(([key, value]) => (
                <ProfileField
                  key={key}
                  label={key}
                  value={(value ?? "").toString()}
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
