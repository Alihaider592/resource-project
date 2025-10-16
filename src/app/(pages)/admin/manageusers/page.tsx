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

  /* -------------------------------------------------------------------------- */
  /* 🧭 Fetch all users                                                         */
  /* -------------------------------------------------------------------------- */
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/admin/getusers", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

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

  /* -------------------------------------------------------------------------- */
  /* ❌ Delete user                                                             */
  /* -------------------------------------------------------------------------- */
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

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting user.");
    } finally {
      setDeletingId(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 👤 View profile                                                            */
  /* -------------------------------------------------------------------------- */
  const handleViewProfile = (id: string) => {
    if (!id) return alert("User ID not found");
    router.push(`/admin/profile/${id}`);
  };

  /* -------------------------------------------------------------------------- */
  /* 🧠 Safe image helper                                                       */
  /* -------------------------------------------------------------------------- */
  const getSafeImageSrc = (img?: string) => {
    if (!img) return "/fallback-avatar.png";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `https://res.cloudinary.com/dk9i3x5la/image/upload/${img.replace(
      /^uploads\//,
      ""
    )}`;
  };

  /* -------------------------------------------------------------------------- */
  /* 🧰 Handle image error                                                      */
  /* -------------------------------------------------------------------------- */
  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🎨 UI Render                                                              */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
        Manage <span className="text-indigo-600">Users</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
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
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {hasError ? (
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-sm">
                    {user.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                ) : (
                  <div className="w-24 h-24 relative">
                    <Image
                      src={imgSrc}
                      alt={user.name || "User"}
                      width={96}
                      height={96}
                      unoptimized
                      loading="lazy"
                      className="rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                      onError={() => handleImageError(user._id)}
                    />
                  </div>
                )}

                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {user.name}
                </h3>
                <p className="text-gray-500 text-sm">{user.email}</p>

                {user.role && (
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                    {user.role}
                  </p>
                )}

                <div className="flex gap-3 w-full justify-center mt-5">
                  <button
                    onClick={() => handleViewProfile(user._id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium shadow-md w-full"
                  >
                    <FiUser size={16} />
                    View Profile
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
                    className={`flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-md w-full ${
                      deletingId === user._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {deletingId === user._id ? (
                      <span className="animate-pulse">Deleting...</span>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete
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
