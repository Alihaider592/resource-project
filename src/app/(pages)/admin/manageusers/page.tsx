"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
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
  const router = useRouter();

  // ✅ Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        console.warn("⚠️ No token found, redirecting to login...");
        router.push("/login");
        return;
      }

      const res = await fetch("/api/admin/getusers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401) {
        console.warn("🚫 Unauthorized — redirecting to login...");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        console.error("❌ Failed to fetch users:", res.status, res.statusText);
        setErrorMsg(`Failed to load users (${res.status})`);
        setUsers([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data.users)) setUsers(data.users);
      else if (Array.isArray(data)) setUsers(data);
      else {
        console.error("⚠️ Unexpected data format:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMsg("Server error while loading users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/admin/deleteuser/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting user.");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ UI Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-8">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
        Manage <span className="text-indigo-600">Users</span>
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {!loading && errorMsg && (
        <div className="text-center text-red-600 font-medium">{errorMsg}</div>
      )}

      {/* Empty State */}
      {!loading && !errorMsg && users.length === 0 && (
        <p className="text-gray-500 text-center text-lg">No users found.</p>
      )}

      {/* Users Grid */}
      {!loading && !errorMsg && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Avatar */}
              {user.avatar || user.picture ? (
                <img
                  src={user.avatar || user.picture || ""}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              {/* Info */}
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {user.name}
              </h3>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.role && (
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                  {user.role}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 w-full justify-center mt-5">
                {/* View Profile */}
                <Link
                  href={`/admin/profile/${user.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium shadow-md w-full"
                >
                  <FiUser size={16} />
                  View Profile
                </Link>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-md w-full ${
                    deletingId === user.id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {deletingId === user.id ? (
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
          ))}
        </div>
      )}
    </div>
  );
}
