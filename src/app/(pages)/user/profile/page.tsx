"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  phonenumber?: string | null;
  companyname?: string | null;
}

interface UpdatedUserResponse {
  message: string;
  user: User;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");

  const router = useRouter();

  // ✅ Fetch latest user data (no cache)
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-store",
        },
      });

      const data = await res.json();
      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setPreview(data.user.avatar);
      setPhoneNumber(data.user.phonenumber || "");
      setCompanyName(data.user.companyname || "");
    } catch {
      toast.error("⚠️ Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ File change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Save Profile
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token missing. Please login again.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phonenumber", phoneNumber);
    formData.append("companyname", companyName);
    if (avatar) formData.append("avatar", avatar);

    const toastId = toast.loading("Updating profile...");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-store" },
        body: formData,
      });

      const data: UpdatedUserResponse | ErrorResponse = await res.json();

      if (!res.ok) {
        toast.error((data as ErrorResponse).message || "Update failed.", { id: toastId });
        return;
      }

      const updated = (data as UpdatedUserResponse).user;
      setUser(updated);
      setEditMode(false);
      setAvatar(null);
      setPreview(updated.avatar || null);

      toast.success("Profile updated!", { id: toastId });

      await fetchUserData();
      router.refresh();
    } catch {
      toast.error("Server error. Try again later.", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-purple-600 text-lg animate-pulse">
        Loading profile...
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-purple-50 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-md bg-white border border-purple-100 rounded-2xl shadow-md p-6">
        <h2 className="text-center text-2xl font-bold text-purple-700 mb-6">My Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover ring-2 ring-purple-400"
              />
            ) : (
              <div className="w-28 h-28 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 font-semibold">
                No Image
              </div>
            )}
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs py-1 px-2 rounded-full cursor-pointer">
                Edit
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <ProfileField label="Name" value={name} editable={editMode} onChange={setName} />
          <ProfileField label="Email" value={email} editable={false} />
          <ProfileField
            label="Phone Number"
            value={phoneNumber}
            editable={editMode}
            onChange={setPhoneNumber}
          />
          <ProfileField
            label="Company Name"
            value={companyName}
            editable={editMode}
            onChange={setCompanyName}
          />
          <ProfileField label="Role" value={user.role} editable={false} color="text-purple-600" />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-purple-100 text-purple-700 px-6 py-2 rounded-full font-semibold hover:bg-purple-200 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-purple-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Field
function ProfileField({
  label,
  value,
  editable,
  onChange,
  color,
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange?: (val: string) => void;
  color?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {editable ? (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full p-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800"
        />
      ) : (
        <p className={`p-2 bg-purple-50 rounded-md border border-purple-100 ${color || "text-gray-800"}`}>
          {value || "N/A"}
        </p>
      )}
    </div>
  );
}
