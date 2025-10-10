"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

interface TeamLead {
  _id: string;
  name: string;
  email: string;
  companyname?: string;
  phonenumber?: string;
  avatar?: string | null;
}

export default function TeamLeadProfilePage() {
  const router = useRouter();
  const [teamLead, setTeamLead] = useState<TeamLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize: fetch /api/auth/me to get user id, then load profile
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 1) fetch logged-in user
        const meRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!meRes.ok) {
          throw new Error("Not authenticated");
        }

        const meData = await meRes.json();
        const user = meData?.user;
        if (!user || (user.role && user.role !== "teamlead")) {
          // if not teamlead, redirect or show error
          router.push("/login");
          return;
        }

        // resolve id from possible shapes (id or _id)
        const id = (user.id || user._id || "").toString();
        if (!id) {
          throw new Error("User id not available");
        }

        // 2) fetch teamlead profile by id
        const profileRes = await fetch(`/api/teamlead/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!profileRes.ok) {
          const text = await profileRes.text().catch(() => "");
          throw new Error(text || "Failed to fetch profile");
        }

        const profile = await profileRes.json();
        setTeamLead(profile);
        setAvatarPreview(profile?.avatar || null);
      } catch (err) {
        console.error("Profile init error:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  // file input change -> preview + store file
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Save updates
  const handleSave = async () => {
    if (!teamLead) return toast.error("No profile loaded");
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Not authenticated");

    try {
      const fd = new FormData();
      fd.append("name", teamLead.name);
      fd.append("email", teamLead.email);
      if (teamLead.companyname) fd.append("companyname", teamLead.companyname);
      if (teamLead.phonenumber) fd.append("phonenumber", teamLead.phonenumber);
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await fetch(`/api/teamlead/${teamLead._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type — let browser set multipart boundary
          "Cache-Control": "no-store",
        },
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Update failed");
      }

      const updated = await res.json();
      setTeamLead(updated);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(updated.avatar || null);
      toast.success("Profile updated");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="py-16 text-center">Loading profile...</div>;
  if (!teamLead) return <div className="py-16 text-center">No profile found.</div>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Team Lead Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Image
              src={avatarPreview || teamLead.avatar || "/default-avatar.png"}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full object-cover border-2 border-gray-200"
            />
            {isEditing && (
              <label className="absolute -bottom-2 right-0 bg-gray-800 text-white px-2 py-1 text-xs rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              className="w-full p-2 border rounded-md"
              value={teamLead.name}
              disabled={!isEditing}
              onChange={(e) => setTeamLead({ ...teamLead, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              className="w-full p-2 border rounded-md bg-gray-50"
              value={teamLead.email}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Company</label>
            <input
              className="w-full p-2 border rounded-md"
              value={teamLead.companyname ?? ""}
              disabled={!isEditing}
              onChange={(e) => setTeamLead({ ...teamLead, companyname: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              className="w-full p-2 border rounded-md"
              value={teamLead.phonenumber ?? ""}
              disabled={!isEditing}
              onChange={(e) => setTeamLead({ ...teamLead, phonenumber: e.target.value })}
            />
          </div>

          <div className="flex gap-3 justify-end mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => { setIsEditing(false); setAvatarFile(null); setAvatarPreview(teamLead.avatar || null); }}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
