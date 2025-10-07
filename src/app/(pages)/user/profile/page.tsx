"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  profilePic?: string;
  role: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState<string | undefined>();
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return router.push("/login");

    fetch("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) return router.push("/login");
        setUser(data.user);
        setName(data.user.name);
        setProfilePic(data.user.profilePic);
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  const handleUpdate = async () => {
    if (!token) return;

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, profilePic }),
    });

    const data = await res.json();
    if (res.ok && data.user) {
      setUser(data.user);
      alert("Profile updated successfully ✅");
    } else {
      alert(data.error || "Update failed ❌");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <img
          src={profilePic || "/default-avatar.png"}
          alt="Profile Picture"
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Email</label>
        <input
          type="text"
          value={user?.email || ""}
          disabled
          className="w-full p-2 border rounded-lg bg-gray-100"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition"
      >
        Update Profile
      </button>
    </div>
  );
}
