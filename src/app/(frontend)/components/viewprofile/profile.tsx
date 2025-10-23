"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiEdit3,
  FiSave,
  FiX,
} from "react-icons/fi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

// --- CORE DATA STRUCTURE ---
// Defining the comprehensive data structure to enable typed keys
export interface EmployeeProfileData {
    // API/DB-specific fields
    _id?: string;
    avatar?: string;
    picture?: string; // Added from the provided UserProfile component
    
    // Core fields
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

    // Health & Address
    bloodGroup: string;
    address: string;
    city: string;
    state: string;
    zip: string;

    // Professional Details
    department: string;
    role: string; 
    workType: string; 

    // Experience Details
    experienceLevel: string;
    previousCompany: string;
    experienceYears: string;
    joiningDate: string;
    leavingDate: string; 
    Branch: string; // Current Company Branch

    // Education & Finance
    education: string;
    bankAccount: string;
    salary: string;
    
    // Redundant/Aliased fields often found in form data
    joining: string; 
    leaving: string; 
    companybranch: string; 
    timing: string; 
    
    // Optional/Miscellaneous
    comment?: string;
    createdAt?: string;
    updatedAt?: string;
}

// --- CONFIGURATION: SECTION MAPPING ---
// Fields not listed here will be dynamically added to the 'Other / Uncategorized' section.
const BASE_SECTION_MAP: Record<string, (keyof EmployeeProfileData)[]> = {
  'Basic Info': ['firstName', 'lastName', 'cnic', 'birthday', 'gender', 'maritalStatus'],
  'Contact Details': ['email', 'phone', 'emergencyContact', 'address', 'city', 'state', 'zip'],
  'Work Details': ['department', 'role', 'workType', 'comment', 'Branch', 'companybranch', 'timing'],
  'Employment History': ['experienceLevel', 'previousCompany', 'experienceYears', 'joiningDate', 'leavingDate', 'joining', 'leaving'],
  'Financial & Health': ['salary', 'bankAccount', 'bloodGroup', 'education'],
  'Administrative': ['employeeId'], 
};

// Define keys that should NEVER be displayed in the data grid (metadata or sensitive info)
const EXCLUDED_KEYS = ['_id', 'createdAt', 'updatedAt', 'avatar', 'picture', 'password'];

// Define the correct type for section names
type SectionName = keyof typeof BASE_SECTION_MAP | 'Other / Uncategorized'; 


// --- HELPER FUNCTIONS & COMPONENTS ---

// Aesthetic Gradients
const gradients = [
  ["#60a5fa", "#bfdbfe"], // Light Blue
  ["#4ade80", "#a7f3d0"], // Light Green
  ["#818cf8", "#c7d2fe"], // Light Indigo
  ["#a78bfa", "#ddd6fe"], // Light Violet
  ["#f472b6", "#fbcfe8"], // Light Pink
];

// Profile Field Sub-Component
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
    // Check for null/undefined, or if the string value is empty/only whitespace.
    // Use the value if it has content, otherwise default to "N/A" for display.
    let displayValue = (value && value.trim()) ? value : "N/A";
    
    if (isDate && value && value.trim()) { // Only attempt date formatting if value is non-empty
        try {
            // Attempt to format as a local date string
            displayValue = new Date(value).toLocaleDateString();
        } catch {
            // Fallback if parsing fails
            displayValue = value; 
        }
    }
    
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
            <span className="text-xs font-semibold uppercase text-indigo-500 tracking-wider">
            {/* Format key for better display (e.g., 'firstName' -> 'First Name') */}
            {label.replace(/([A-Z])/g, ' $1').trim()} 
            </span>
            {editing ? (
            <input
                type={isDate ? "date" : "text"} // Use date type for date fields
                value={value ?? ""} // Keep original behavior for editing (empty string is fine here)
                onChange={(e) => onChange?.(e.target.value)}
                // Enhanced focus and border styles
                className="mt-1 w-full p-2 border-2 border-indigo-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500 transition-all text-base font-medium focus:ring-4 focus:ring-indigo-100"
            />
            ) : (
            // Using wrap-break-word for canonical Tailwind class
            <span className="text-gray-800 font-medium text-lg block mt-1 wrap-break-word">
                {/* Use the calculated displayValue which defaults to "N/A" for empty strings */}
                {displayValue}
            </span>
            )}
        </div>
    );
};

// Function to bypass strict literal type checking (TS2367) while maintaining type safety
const getInitialUserType = (): "admin" | "hr" => "admin";

// --- MAIN PROFILE COMPONENT ---

const UserProfile: React.FC = () => {
  // Hardcoded as 'admin' to determine API endpoint paths, consistent with the user's logic.
  // The value is derived from a function to prevent TS from statically evaluating the impossible comparison (userType === "hr"), 
  // resolving the TS2367 error while keeping the variable constant.
  const userType = getInitialUserType(); 

  const params = useParams<{ id?: string }>();
  const router = useRouter(); 

  const [user, setUser] = useState<EmployeeProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<EmployeeProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [gradientIndex, setGradientIndex] = useState(0);
  
  // State for the full, effective map including the dynamic 'Uncategorized' section
  const [effectiveSectionMap, setEffectiveSectionMap] = useState<Record<string, (keyof EmployeeProfileData)[]>>(BASE_SECTION_MAP);

  // Set initial state based on the first section key
  const [activeSection, setActiveSection] = useState<SectionName>(Object.keys(BASE_SECTION_MAP)[0] as SectionName); 


  // Helper to construct the image URL from the stored path
  const getImageUrl = (img?: string) => {
    if (!img || typeof img !== "string") return null;
    if (img.startsWith("http")) return img;
    // Assuming a standard cloudinary path setup
    return `https://res.cloudinary.com/dk9i3x5la/image/upload/${img.replace(
      /^uploads\//,
      ""
    )}`;
  };
  
  // --- Dynamic Mapping Calculation (Ensures all fields are covered) ---
  const allMappedKeys = useMemo(() => {
    const keys = new Set<keyof EmployeeProfileData>();
    Object.values(BASE_SECTION_MAP).forEach(sectionKeys => 
      sectionKeys.forEach(key => keys.add(key))
    );
    return keys;
  }, []);

  // Effect to fetch profile and calculate dynamic map
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setErrorMsg(null);
      let userId: string | null = null;
      // FIX 1: Use 'const' for token as it's not reassigned.
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMsg("Unauthorized. Please log in.");
        router.push("/login");
        return;
      }

      // 1. Determine User ID: Check URL param first, then JWT token.
      userId = params?.id ?? null;
      if (!userId) {
        try {
          const decoded = jwtDecode<{ id: string }>(token);
          userId = decoded.id;
        } catch (err) {
          console.error("JWT decode failed:", err);
          setErrorMsg("Invalid authentication token.");
          return;
        }
      }

      if (!userId) {
        setErrorMsg("User ID is missing.");
        return;
      }
      
      // 2. Determine API Endpoint
      // FIX 2a: Use if/else block to satisfy TS compiler (avoids TS2367)
      let endpoint: string;
      if (userType === "hr") {
        endpoint = `/api/hr/getusers/${userId}`;
      } else {
        endpoint = `/api/admin/getusers/${userId}`;
      }

      try {
        const res = await axios.get<{ user?: EmployeeProfileData; message?: string }>(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.user;

        if (res.status === 200 && userData) {
          
          setUser(userData); 
          setFormData(userData);
          
          // --- DYNAMIC MAPPING LOGIC ---
          const allDataKeys = Object.keys(userData) as (keyof EmployeeProfileData)[];
          
          // Find any keys that exist in the data but are not in the hardcoded map or the exclusion list
          const uncategorizedKeys = allDataKeys.filter(key => 
              !allMappedKeys.has(key) && 
              !EXCLUDED_KEYS.includes(key as string)
          );
          
          const newEffectiveMap: Record<string, (keyof EmployeeProfileData)[]> = { ...BASE_SECTION_MAP };
          
          if (uncategorizedKeys.length > 0) {
              // Add the dynamically discovered keys to a new section
              newEffectiveMap['Other / Uncategorized'] = uncategorizedKeys.sort();
          }

          setEffectiveSectionMap(newEffectiveMap);

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
  }, [params?.id, router, userType, allMappedKeys]);


  // Gradient rotator (Aesthetic element)
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (
    key: keyof EmployeeProfileData,
    value: string
  ) => {
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

      // Determine API endpoint for update
      // FIX 2b: Use if/else block to satisfy TS compiler (avoids TS2367)
      let updateUrl: string;
      if (userType === "hr") {
          updateUrl = `/api/hr/updateuser/${user._id}`;
      } else {
          updateUrl = `/api/admin/updateuser/${user._id}`;
      }

      // IMPORTANT: Exclude fields that shouldn't be updated (like password)
      const dataToSubmit = { ...formData };
      delete dataToSubmit.password;
      
      const res = await axios.put(updateUrl, dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = res.data.user;

      if (res.status === 200 && updated) {
        setUser(updated);
        setFormData(updated);
        setEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };
  
  const handleCancel = () => {
      setEditing(false);
      setErrorMsg(null);
      setFormData(user || {}); // Reset form data to current user state
      toast.success("Editing cancelled."); 
  };

  const currentGradientStyle = {
    background: `linear-gradient(90deg, ${gradients[gradientIndex][0]}, ${gradients[gradientIndex][1]})`,
    transition: "background 1s ease-in-out", 
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-indigo-600 font-medium text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  if (errorMsg)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 font-medium bg-gray-50">
        <p className="text-xl">❌ {errorMsg}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-indigo-600 underline font-medium hover:text-indigo-800 transition"
        >
          ← Go Back
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500 bg-gray-50">
        <p className="text-xl">❌ No profile data available.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-indigo-600 underline font-medium hover:text-indigo-800 transition"
        >
          ← Go Back
        </button>
      </div>
    );
    
  // Filter fields based on the active section and only include data present in formData
  const filteredFields = Object.entries(formData)
    .filter(([key]) => {
      const keyAsProp = key as keyof EmployeeProfileData;
      
      const keysInActiveSection = effectiveSectionMap[activeSection as string];
      if (!keysInActiveSection) return false;

      // Check if the key is in the active section and is not explicitly excluded
      return keysInActiveSection.includes(keyAsProp);
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
    
  const sectionKeys = Object.keys(effectiveSectionMap) as SectionName[];
  
  const imageUrl = getImageUrl((user.picture as string) || (user.avatar as string));


  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
        <div className="max-w-4xl mx-auto bg-white shadow-3xl rounded-3xl overflow-hidden relative border border-gray-200">
          
          {/* Header Section (Dynamic Gradient) */}
          <div
            style={currentGradientStyle}
            className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative"
          >
            {/* Action Buttons */}
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
                    {editing ? (
                        <FiSave className="w-5 h-5" />
                    ) : (
                        <FiEdit3 className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Avatar and Info */}
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

            <div className='mt-4 sm:mt-0 text-center sm:text-left'>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              {/* Role */}
              <p className="text-indigo-100 text-xl mt-1 font-semibold">{user.role ?? "N/A"}</p>
              
              {/* Employee ID (Correctly placed below role) */}
              <p className="text-indigo-100 text-base mt-1 font-medium">{user.employeeId ? `ID: ${user.employeeId}` : ""}</p>
              
              {/* Department */}
              <p className="text-indigo-100 text-sm mt-1">{user.department ?? ""}</p>
            </div>
          </div>
          
          {/* --- Section Navigation Tabs --- */}
          <div className="border-b border-gray-200 px-6 sm:px-10 pt-4">
            <div className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto pb-1">
              {sectionKeys.map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    if (editing) {
                        toast.error("Please save or cancel your current edits before switching sections.");
                        return;
                    }
                    setActiveSection(section);
                  }}
                  className={`
                    py-3 px-3 sm:px-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap
                    ${
                      activeSection === section
                        ? 'border-b-4 border-indigo-600 text-indigo-700'
                        : 'border-b-4 border-transparent text-gray-500 hover:text-indigo-500 hover:border-gray-300'
                    }
                  `}
                  disabled={editing} // Disable switching sections while editing
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
          
          {/* Body Section (Details Grid - Dynamic Content) */}
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
                    isDate={key.toLowerCase().includes('date') || key.toLowerCase().includes('joining') || key.toLowerCase().includes('leaving')}
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
