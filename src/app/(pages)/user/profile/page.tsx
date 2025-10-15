"use client";

import React, { useEffect, useState } from "react";
import { EmployeeData } from "@/app/(backend)/api/auth/me/route";
import { FiEdit3 } from "react-icons/fi";

// Professional pastel gradients
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
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Smooth gradient transition every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const currentGradient = `linear-gradient(90deg, ${gradients[gradientIndex][0]}, ${gradients[gradientIndex][1]})`;

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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden relative">
        {/* Header with smooth gradient */}
        <div
          style={{
            backgroundImage: currentGradient,
            transition: "background-image 2s ease-in-out",
          }}
          className="p-8 flex items-center gap-6 relative"
        >
          {/* Professional edit icon */}
          <div
            className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 cursor-pointer transition-all"
            onClick={() => setEditing(!editing)}
            title="Edit Profile"
          >
            <FiEdit3 className="text-gray-700 w-5 h-5" />
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
          </div>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Email" value={user.email} editing={editing} />
          <ProfileField label="Phone" value={user.phone} editing={editing} />
          <ProfileField label="Employee ID" value={user.employeeId} editing={editing} />
          <ProfileField label="Work Type" value={user.workType} editing={editing} />
          <ProfileField label="Experience Level" value={user.experienceLevel} editing={editing} />
          <ProfileField label="Previous Company" value={user.previousCompany} editing={editing} />
          <ProfileField label="Experience Years" value={user.experienceYears} editing={editing} />
          <ProfileField label="Education" value={user.education} editing={editing} />
          <ProfileField label="Bank Account" value={user.bankAccount} editing={editing} />
          <ProfileField label="Salary" value={user.salary} editing={editing} />
          <ProfileField
            label="Address"
            value={`${user.address ?? ""}, ${user.city ?? ""}, ${user.state ?? ""} ${user.zip ?? ""}`}
            editing={editing}
          />
          <ProfileField label="Birthday" value={user.birthday} editing={editing} />
          <ProfileField label="Gender" value={user.gender} editing={editing} />
          <ProfileField label="Marital Status" value={user.maritalStatus} editing={editing} />
          <ProfileField label="Emergency Contact" value={user.emergencyContact} editing={editing} />
        </div>
      </div>
    </div>
  );
};

interface ProfileFieldProps {
  label: string;
  value?: string | null;
  editing?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, editing }) => (
  <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200">
    <span className="text-gray-400 text-sm">{label}</span>
    {editing ? (
      <input
        type="text"
        defaultValue={value ?? ""}
        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    ) : (
      <span className="text-gray-800 font-semibold">{value ?? "N/A"}</span>
    )}
  </div>
);

export default ProfilePage;
