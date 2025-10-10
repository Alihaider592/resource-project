"use client";
import { useEffect, useState } from "react";
import EditProfileForm from "./editprofileform";

interface Profile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phonenumber?: string;
  companyname?: string;
}

export default function TeamLeadProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/teamled/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data: { user: Profile } = await res.json(); 
        setProfile(data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      {profile ? (
        <EditProfileForm profile={profile} />
      ) : (
        <p className="text-gray-600">Loading profile...</p>
      )}
    </div>
  );
}
