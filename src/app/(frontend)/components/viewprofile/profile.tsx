"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit3, FiSave, FiX } from "react-icons/fi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import jwt_decode from "jwt-decode";
import Image from "next/image";

// -------------------- Type Definitions --------------------
export interface EmployeeProfileData {
  _id: string; // Required for PUT requests
  avatar?: string;
  picture?: string;

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
  password?: string;

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
  createdAt?: string;
  updatedAt?: string;
}

// -------------------- Constants --------------------
const BASE_SECTION_MAP: Record<string, (keyof EmployeeProfileData)[]> = {
  "Basic Info": [
    "firstName",
    "lastName",
    "cnic",
    "birthday",
    "gender",
    "maritalStatus",
  ],
  "Contact Details": [
    "email",
    "phone",
    "emergencyContact",
    "address",
    "city",
    "state",
    "zip",
  ],
  "Work Details": [
    "department",
    "role",
    "workType",
    "comment",
    "Branch",
    "companybranch",
    "timing",
  ],
  "Employment History": [
    "experienceLevel",
    "previousCompany",
    "experienceYears",
    "joiningDate",
    "leavingDate",
    "joining",
    "leaving",
  ],
  "Financial & Health": ["salary", "bankAccount", "bloodGroup", "education"],
  Administrative: ["employeeId"],
};

const EXCLUDED_KEYS = [
  "_id",
  "createdAt",
  "updatedAt",
  "avatar",
  "picture",
  "password",
];

type SectionName = keyof typeof BASE_SECTION_MAP | "Other / Uncategorized";

const gradients = [
  ["#60a5fa", "#bfdbfe"],
  ["#4ade80", "#a7f3d0"],
  ["#818cf8", "#c7d2fe"],
  ["#a78bfa", "#ddd6fe"],
  ["#f472b6", "#fbcfe8"],
];

// -------------------- Profile Field Component --------------------
interface ProfileFieldProps {
  label: string;
  value?: string | null;
  editing?: boolean;
  onChange?: (value: string) => void;
  isDate?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  editing,
  onChange,
  isDate = false,
}) => {
  let displayValue = value && value.trim() ? value : "N/A";

  if (isDate && value && value.trim()) {
    try {
      displayValue = new Date(value).toLocaleDateString();
    } catch {
      displayValue = value;
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
      <span className="text-xs font-semibold uppercase text-indigo-500 tracking-wider">
        {label.replace(/([A-Z])/g, " $1").trim()}
      </span>
      {editing ? (
        <input
          type={isDate ? "date" : "text"}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-1 w-full p-2 border-2 border-indigo-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500 transition-all text-base font-medium focus:ring-4 focus:ring-indigo-100"
        />
      ) : (
        <span className="text-gray-800 font-medium text-lg block mt-1 wrap-break-word">
          {displayValue}
        </span>
      )}
    </div>
  );
};

// -------------------- Main Component --------------------
interface UserProfileProps {
  userType?: "admin" | "hr";
}

const UserProfile: React.FC<UserProfileProps> = ({ userType = "admin" }) => {
  const params = useParams<{ id?: string }>();
  const router = useRouter();

  const [user, setUser] = useState<EmployeeProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<EmployeeProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [gradientIndex, setGradientIndex] = useState(0);
  const [effectiveSectionMap, setEffectiveSectionMap] =
    useState<Record<string, (keyof EmployeeProfileData)[]>>(BASE_SECTION_MAP);
  const [activeSection, setActiveSection] = useState<SectionName>(
    Object.keys(BASE_SECTION_MAP)[0] as SectionName
  );

  const getImageUrl = (img?: string) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `https://res.cloudinary.com/dk9i3x5la/image/upload/${img.replace(
      /^uploads\//,
      ""
    )}`;
  };

  const allMappedKeys = useMemo(() => {
    const keys = new Set<keyof EmployeeProfileData>();
    Object.values(BASE_SECTION_MAP).forEach((sectionKeys) =>
      sectionKeys.forEach((k) => keys.add(k))
    );
    return keys;
  }, []);

  // -------------------- Fetch User --------------------
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setErrorMsg(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Unauthorized. Please log in.");
        router.push("/login");
        return;
      }

      let userId: string | null = params?.id ?? null;
      if (!userId) {
        try {
          const decoded = jwt_decode<{ id: string }>(token); // Fixed import issue
          userId = decoded.id;
        } catch {
          setErrorMsg("Invalid authentication token.");
          setLoading(false);
          return;
        }
      }

      if (!userId) {
        setErrorMsg("User ID is missing.");
        setLoading(false);
        return;
      }

      const getApiUrl = (userId: string, action: "get" | "update") => {
        if (userType === "hr")
          return action === "get"
            ? `/api/hr/getusers/${userId}`
            : `/api/hr/updateuser/${userId}`;
        return action === "get"
          ? `/api/admin/getusers/${userId}`
          : `/api/admin/updateuser/${userId}`;
      };

      try {
        const res = await axios.get<{
          user?: EmployeeProfileData;
          message?: string;
        }>(getApiUrl(userId, "get"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.user;
        if (!userData || !userData._id) {
          setErrorMsg(res.data.message || "User not found.");
          setLoading(false);
          return;
        }

        setUser(userData);
        setFormData(userData);

        // Handle uncategorized fields
        const allDataKeys = Object.keys(
          userData
        ) as (keyof EmployeeProfileData)[];
        const uncategorizedKeys = allDataKeys.filter(
          (key) =>
            !allMappedKeys.has(key) && !EXCLUDED_KEYS.includes(key as string)
        );
        const newMap: Record<string, (keyof EmployeeProfileData)[]> = {
          ...BASE_SECTION_MAP,
        };
        if (uncategorizedKeys.length)
          newMap["Other / Uncategorized"] = uncategorizedKeys.sort();
        setEffectiveSectionMap(newMap);
      } catch (err: unknown) {
        if (axios.isAxiosError(err))
          setErrorMsg(err.response?.data?.message || err.message);
        else if (err instanceof Error) setErrorMsg(err.message);
        else setErrorMsg("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [params?.id, router, userType, allMappedKeys]);

  // -------------------- Gradient Rotator --------------------
  useEffect(() => {
    const interval = setInterval(
      () => setGradientIndex((prev) => (prev + 1) % gradients.length),
      5 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (key: keyof EmployeeProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?._id) {
      toast.error("User ID not found.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized. Please login.");
      router.push("/login");
      return;
    }

    try {
      const updateUrl =
        userType === "hr"
          ? `/api/hr/updateuser/${user._id}`
          : `/api/admin/updateuser/${user._id}`;

      const dataToSubmit = { ...formData };
      delete dataToSubmit.password;

      const res = await axios.put(updateUrl, dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.user) {
        setUser(res.data.user);
        setFormData(res.data.user);
        setEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrorMsg(null);
    setFormData(user || {});
    toast.success("Editing cancelled.");
  };

  const currentGradientStyle = {
    background: `linear-gradient(90deg, ${gradients[gradientIndex][0]}, ${gradients[gradientIndex][1]})`,
    transition: "background 1s ease-in-out",
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-indigo-600 animate-pulse">
        Loading profile...
      </p>
    );
  if (errorMsg)
    return <p className="text-center mt-10 text-red-500">{errorMsg}</p>;
  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">
        No profile data available.
      </p>
    );

  const filteredFields = Object.entries(formData)
    .filter(([key]) =>
      effectiveSectionMap[activeSection as string]?.includes(
        key as keyof EmployeeProfileData
      )
    )
    .sort((a, b) => a[0].localeCompare(b[0]));

  const sectionKeys = Object.keys(effectiveSectionMap) as SectionName[];
  const imageUrl = getImageUrl(user.picture || user.avatar);

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
        <div className="max-w-4xl mx-auto bg-white shadow-3xl rounded-3xl overflow-hidden relative border border-gray-200">
          {/* Header */}
          <div
            style={currentGradientStyle}
            className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative"
          >
            <div className="absolute top-4 right-4 flex space-x-2">
              {editing && (
                <button
                  className="p-3 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-200 transition-all border border-gray-200"
                  onClick={handleCancel}
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
              <button
                className="p-3 rounded-full bg-white text-indigo-600 shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all"
                onClick={() => (editing ? handleSave() : setEditing(true))}
              >
                {editing ? (
                  <FiSave className="w-5 h-5" />
                ) : (
                  <FiEdit3 className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="shrink-0">
              {imageUrl ? (
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center text-white font-extrabold text-4xl shadow-xl bg-gray-300">
                  {user.firstName?.[0] ?? "U"}
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-indigo-100 text-xl mt-1 font-semibold">
                {user.role ?? "N/A"}
              </p>
              <p className="text-indigo-100 text-base mt-1 font-medium">
                {user.employeeId ? `ID: ${user.employeeId}` : ""}
              </p>
              <p className="text-indigo-100 text-sm mt-1">
                {user.department ?? ""}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="border-b border-gray-200 px-6 sm:px-10 pt-4">
            <div className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto pb-1">
              {sectionKeys.map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    if (editing) {
                      toast.error("Save or cancel edits first");
                      return;
                    }
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

          {/* Details */}
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {activeSection}
            </h2>
            {filteredFields.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFields.map(([key, value]) => (
                  <ProfileField
                    key={key}
                    label={key}
                    value={(value ?? "").toString()}
                    editing={editing}
                    isDate={
                      key.toLowerCase().includes("date") ||
                      key.toLowerCase().includes("joining") ||
                      key.toLowerCase().includes("leaving")
                    }
                    onChange={(val) =>
                      handleInputChange(key as keyof EmployeeProfileData, val)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 p-8 border border-dashed rounded-xl bg-gray-50 text-center">
                No editable fields available for {activeSection}.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 flex justify-start bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
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
