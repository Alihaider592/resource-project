"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  picture?: string;
  phonenumber?: string;
  companyname?: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch("/api/admin/getusers", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.status === 401) return router.push("/login");

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Failed to fetch users:", text);
        setErrorMsg(`Failed to load users (${res.status})`);
        setUsers([]);
        return;
      }

      const data = await res.json();
      const fetchedUsers: User[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.users)
        ? data.users
        : [];

      setUsers(fetchedUsers);
      setErrorMsg(fetchedUsers.length === 0 ? "No users found" : null);
    } catch (err) {
      console.error("🔥 Error fetching users:", err);
      setErrorMsg("Server error while loading users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(id);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/deleteuser/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.status === 401) return router.push("/login");

      if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== id));
      else alert(data.message || "Failed to delete user");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting user.");
    } finally {
      setDeletingId(null);
    }
  };

  const getSafeImageSrc = (img?: string) => {
    if (!img) return "/fallback-avatar.png";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `https://res.cloudinary.com/dk9i3x5la/image/upload/${img.replace(
      /^uploads\//,
      ""
    )}`;
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 py-12 px-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-12 tracking-tight text-center">
        Manage <span className="text-indigo-600">Users</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          {/* <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full "></div> */}
        </div>
      ) : errorMsg ? (
        <div className="text-center text-red-600 font-medium">{errorMsg}</div>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => {
            const imgSrc = getSafeImageSrc(user.avatar || user.picture);
            const hasError = imageErrors[user._id];

            return (
              <div
                key={user._id}
                className="flex flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 transition-all duration-300 border border-gray-100"
              >
                {/* Avatar with ring */}
                <div className="w-20 h-20 relative mb-4 flex-shrink-0">
                  {hasError ? (
                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold shadow ring-2 ring-indigo-500 ring-offset-2">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  ) : (
                    <Image
                      src={imgSrc}
                      alt={user.name || "User"}
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-2 border-indigo-100 shadow ring-2 ring-indigo-500 ring-offset-2"
                      onError={() => handleImageError(user._id)}
                    />
                  )}
                </div>

                {/* User info */}
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
                {user.role && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                    {user.role}
                  </span>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-4 w-full">
                  <button
                    onClick={() => router.push(`/admin/profile/${user._id}`)}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-500 shadow-sm transition"
                  >
                    <FiUser size={14} /> Profile
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
                    className={`flex-1 flex cursor-pointer items-center justify-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-pink-500 hover:to-red-500 shadow-sm transition ${
                      deletingId === user._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {deletingId === user._id ? (
                      <span className="animate-pulse text-xs">Deleting...</span>
                    ) : (
                      <>
                        <Trash2 size={14} /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
