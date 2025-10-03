"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react"; // nice icons

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
      const res = await fetch("/api/admin/getusers");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
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
      const res = await fetch(`/api/admin/deleteuser/${id}`, { method: "DELETE" });
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
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h2 className="text-4xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        Manage{" "}
        <span className="text-purple-700 flex items-center gap-2">
          Users
          <hr className="w-20 h-1 bg-purple-700 border-0 rounded" />
        </span>
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-200 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                  N/A
                </div>
              )}

              <h3 className="mt-4 text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-500 text-sm">{user.email}</p>

              <div className="mt-4 flex gap-3">
                <button
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={() => alert("Edit functionality not implemented")}
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === user.id ? (
                    <>
                      <span className="animate-pulse">Deleting...</span>
                    </>
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
