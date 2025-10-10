"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface TeamLead {
  _id: string;
  name: string;
  email: string;
  companyname?: string;
  phonenumber?: string;
  avatar?: string;
}

export default function TeamLeadProfilePage() {
  const [teamLead, setTeamLead] = useState<TeamLead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // 🧠 Replace this with actual logged-in team lead ID
  const teamLeadId = "YOUR_TEAMLEAD_ID"; // will come from token later

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/teamlead/${teamLeadId}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setTeamLead(data);
      } catch (error) {
        console.error(error);
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [teamLeadId]);

  const handleChange = (field: keyof TeamLead, value: string) => {
    if (!teamLead) return;
    setTeamLead({ ...teamLead, [field]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!teamLead) return;
    try {
      const formData = new FormData();
      formData.append("name", teamLead.name);
      formData.append("email", teamLead.email);
      formData.append("companyname", teamLead.companyname || "");
      formData.append("phonenumber", teamLead.phonenumber || "");
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch(`/api/teamlead/${teamLead._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Update failed");

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!teamLead) return <p className="text-center mt-10">No profile found.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold text-purple-700">
            Team Lead Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <Image
              src={avatarPreview || teamLead.avatar || "/default-avatar.png"}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full object-cover border-2 border-purple-500"
            />
            {isEditing && (
              <div className="flex flex-col items-center">
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer text-sm text-purple-600 hover:underline"
                >
                  Change Avatar
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div>
            <Label>Name</Label>
            <Input
              value={teamLead.name}
              disabled={!isEditing}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("name", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={teamLead.email} disabled />
          </div>

          <div>
            <Label>Company Name</Label>
            <Input
              value={teamLead.companyname || ""}
              disabled={!isEditing}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("companyname", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              value={teamLead.phonenumber || ""}
              disabled={!isEditing}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("phonenumber", e.target.value)
              }
            />
          </div>

          <div className="flex justify-between mt-5">
            {isEditing ? (
              <>
                <Button
                  onClick={handleUpdate}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-gray-400"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
