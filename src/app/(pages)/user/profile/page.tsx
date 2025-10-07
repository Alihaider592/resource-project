"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPreview(data.user.avatar || null);
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type!
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setUser(updated.user);
      setEditMode(false);
      setPreview(updated.user.avatar || null);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">My Profile</h2>

      <div className="flex flex-col gap-4">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Profile Picture"
              className="w-32 h-32 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-2 flex items-center justify-center text-gray-500 text-xl">
              No Image
            </div>
          )}
          {editMode && (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700">Name:</label>
          {editMode ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded w-full"
            />
          ) : (
            <p className="text-gray-900">{user.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email:</label>
          {editMode ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full"
            />
          ) : (
            <p className="text-gray-900">{user.email}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700">Role:</label>
          <p className="text-gray-900">{user.role}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
