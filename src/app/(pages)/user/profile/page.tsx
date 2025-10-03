"use client";

import { useEffect, useState } from "react";
interface User {
  id: string;
  name: string;
  email: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/getusers")
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .finally(() => setLoading(false));
  }, []);

  return (
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-6 flex items-baseline-last gap-1">My <div className="text-purple-800 text-3xl font-bold flex items-baseline-last">Profile <hr className=' w-20 bg-purple-900' /></div></h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-purple-100 ">
              <tr className="flex justify-around">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
              </tr>
            </div>
            <div>
              {users.map((user) => (
                <tr key={user.id} className="border-b flex justify-around">
                  <td className="py-2 px-10">{user.name}</td>
                  <td className="py-2 ">{user.email}</td>
                </tr>
              ))}
            </div>
          </table>
        )}
      </div>
  );
}
