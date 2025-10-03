"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

export default function AddUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (picture) {
        formData.append("picture", picture);
      }

      const res = await fetch("/api/admin/adduser", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("User added successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setPicture(null);
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
        Add User
      </h2>

      {message && (
        <p
          className={`mb-4 text-center ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Picture Upload Field */}
        <div className="flex flex-col items-center mb-4">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setPicture(e.target.files ? e.target.files[0] : null)
              }
            />
            <div className="w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden relative bg-gray-100">
              {picture ? (
                <img
                  src={URL.createObjectURL(picture)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <span className="absolute bottom-2 right-2 bg-purple-600 text-white p-1 rounded-full">
              <Camera className="w-4 h-4" />
            </span>
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Upload profile picture
          </p>
        </div>

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition"
        >
          {loading ? "Adding User..." : "Add User"}
        </button>
      </form>
    </div>
  );
}
