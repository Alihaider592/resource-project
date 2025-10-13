"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { FiUser } from "react-icons/fi";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch("/api/admin/getusers", {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("❌ Failed to fetch users:", res.status, res.statusText);
        setUsers([]);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data.users)) setUsers(data.users);
      else if (Array.isArray(data)) setUsers(data);
      else {
        console.error("Unexpected data format:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/admin/deleteuser/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
      else alert(data.error || "Failed to delete user");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Manage <span className="text-purple-700">Users</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                  N/A
                </div>
              )}

              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {user.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{user.email}</p>

              <div className="flex gap-3 w-full justify-center">
                <Link
                  href={`/admin/profile/${user.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-md w-full"
                >
                  <FiUser size={16} />
                  View Profile
                </Link>

                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full"
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
