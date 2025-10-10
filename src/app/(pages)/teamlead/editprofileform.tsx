"use client";
import { useState } from "react";

interface Profile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phonenumber?: string;
  companyname?: string;
}

interface ProfileProps {
  profile: Profile;
}

export default function EditProfileForm({ profile }: ProfileProps) {
  const [form, setForm] = useState<Profile>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/teamlead/${profile._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md bg-white p-6 shadow-md rounded-xl"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          disabled
          className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="phonenumber"
          value={form.phonenumber || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <input
          type="text"
          name="companyname"
          value={form.companyname || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
      >
        Save Changes
      </button>
    </form>
  );
}
