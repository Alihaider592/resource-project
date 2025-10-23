"use client";

import React, { useEffect, useState } from "react";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ---------------- DATA STRUCTURE ----------------
export interface EmployeeProfileData {
  _id?: string;
  avatar?: string;

  employeeId: string;
  firstName: string;
  lastName: string;
  cnic: string;
  email: string;
  phone: string;
  emergencyContact: string;
  birthday: string;
  gender: string;
  maritalStatus: string;
  password: string;

  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  zip: string;

  department: string;
  role: string;
  workType: string;

  experienceLevel: string;
  previousCompany: string;
  experienceYears: string;
  joiningDate: string;
  leavingDate: string;
  Branch: string;

  education: string;
  bankAccount: string;
  salary: string;
  joining: string;
  leaving: string;
  companybranch: string;
  timing: string;

  comment?: string;
}

// ---------------- GRADIENTS ----------------
const gradients = [
  ["#60a5fa", "#bfdbfe"],
  ["#4ade80", "#a7f3d0"],
  ["#818cf8", "#c7d2fe"],
  ["#a78bfa", "#ddd6fe"],
  ["#f472b6", "#fbcfe8"],
];

// ---------------- SECTION MAP ----------------
const SECTION_MAP: Record<string, (keyof EmployeeProfileData)[]> = {
  "Basic Info": ["firstName", "lastName", "cnic", "birthday", "gender", "maritalStatus"],
  "Contact Details": ["email", "phone", "emergencyContact", "address", "city", "state", "zip"],
  "Work Details": ["department", "role", "workType", "comment"],
  "Company & Timing": ["Branch", "companybranch", "timing", "joining", "leaving"],
  "Employment History": ["experienceLevel", "previousCompany", "experienceYears", "joiningDate", "leavingDate"],
  "Financial & Health": ["salary", "bankAccount", "bloodGroup", "education"],
  "Administrative": ["employeeId"],
};
type SectionName = keyof typeof SECTION_MAP;

// ---------------- PROFILE FIELD ----------------
interface ProfileFieldProps {
  label: string;
  value?: string | null;
  editing?: boolean;
  onChange?: (value: string) => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, editing, onChange }) => {
  const isExperienceField = ["previousCompany", "experienceYears", "joiningDate", "leavingDate", "Branch"].includes(label);
  const disabled = editing && isExperienceField && value === "Fresher";

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
      <span className="text-xs font-semibold uppercase text-indigo-500 tracking-wider">
        {label.replace(/([A-Z])/g, " $1").trim()}
      </span>
      {editing ? (
        label === "experienceLevel" ? (
          <select
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="mt-1 w-full p-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-all text-base"
          >
            <option value="">Select</option>
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
        ) : label.toLowerCase().includes("date") ? (
          <input
            type="date"
            value={value ?? ""}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className="mt-1 w-full p-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-all text-base"
          />
        ) : (
          <input
            type="text"
            value={value ?? ""}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className="mt-1 w-full p-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-all text-base"
          />
        )
      ) : (
        <span className="text-gray-800 font-medium text-lg block mt-1 wrap-break-word">{value ?? "N/A"}</span>
      )}
    </div>
  );
};

// ---------------- MAIN PROFILE PAGE ----------------
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<EmployeeProfileData>>({});
  const [gradientIndex, setGradientIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionName>(Object.keys(SECTION_MAP)[0] as SectionName);
  const router = useRouter();

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");
      try {
        const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user as EmployeeProfileData);
        setFormData(data.user as EmployeeProfileData);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  // ---------------- GRADIENT ROTATOR ----------------
  useEffect(() => {
    const interval = setInterval(() => setGradientIndex((prev) => (prev + 1) % gradients.length), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (key: keyof EmployeeProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------- SAVE (Backend PUT /me integration) ----------------
  const handleSave = async () => {
    if (!user) return toast.error("User not found.");
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const { role, _id, email, password, ...dataToSend } = formData; // exclude unsafe fields
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return toast.error(errData.message || "Failed to update profile.");
      }

      const updated = await res.json();
      setUser(updated.user);
      setFormData(updated.user);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating profile.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(user || {});
    toast.success("Editing cancelled.");
  };

  const currentGradientStyle = {
    background: `linear-gradient(90deg, ${gradients[gradientIndex][0]}, ${gradients[gradientIndex][1]})`,
    transition: "background 1s ease-in-out",
  };

  if (loading) return <p className="text-center mt-10 text-indigo-600 animate-pulse">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">No profile data available.</p>;

  const filteredFields = Object.entries(formData)
    .filter(([key]) => SECTION_MAP[activeSection].includes(key as keyof EmployeeProfileData))
    .sort((a, b) => a[0].localeCompare(b[0]));

  const sectionKeys = Object.keys(SECTION_MAP) as SectionName[];

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
        <div className="max-w-4xl mx-auto bg-white shadow-3xl rounded-3xl overflow-hidden relative border border-gray-200">
          <div style={currentGradientStyle} className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              {editing && (
                <button
                  className="p-3 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-200 transition-all border border-gray-200"
                  onClick={handleCancel}
                  title="Cancel Editing"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
              <button
                className="p-3 rounded-full bg-white text-indigo-600 shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all"
                onClick={() => (editing ? handleSave() : setEditing(true))}
                title={editing ? "Save Profile" : "Edit Profile"}
              >
                {editing ? <FiSave className="w-5 h-5" /> : <FiEdit3 className="w-5 h-5" />}
              </button>
            </div>

            <div className="shrink-0">
              {user.avatar ? (
                <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden">
                  <Image src={user.avatar} alt={`${user.firstName} ${user.lastName}`} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full border-4 border-white flex items-center justify-center text-white font-extrabold text-4xl shadow-xl bg-gray-300">
                  {user.firstName?.[0] ?? "U"}
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{user.firstName} {user.lastName}</h1>
              <p className="text-indigo-100 text-xl mt-1 font-semibold">{user.role ?? "N/A"}</p>
              <p className="text-indigo-100 text-base mt-1 font-medium">{user.employeeId ? `ID: ${user.employeeId}` : ""}</p>
              <p className="text-indigo-100 text-sm mt-1">{user.department ?? ""}</p>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="border-b border-gray-200 px-6 sm:px-10 pt-4">
            <div className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto pb-1">
              {sectionKeys.map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    if (editing) return toast.error("Please save or cancel your current edits before switching sections.");
                    setActiveSection(section);
                  }}
                  className={`py-3 px-3 sm:px-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    activeSection === section
                      ? "border-b-4 border-indigo-600 text-indigo-700"
                      : "border-b-4 border-transparent text-gray-500 hover:text-indigo-500 hover:border-gray-300"
                  }`}
                  disabled={editing}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeSection}</h2>
            {filteredFields.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFields.map(([key, value]) => (
                  <ProfileField
                    key={key}
                    label={key}
                    value={(value ?? "").toString()}
                    editing={editing}
                    onChange={(val) => handleInputChange(key as keyof EmployeeProfileData, val)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 p-8 border border-dashed rounded-xl bg-gray-50 text-center">
                No editable fields available for {activeSection}.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
