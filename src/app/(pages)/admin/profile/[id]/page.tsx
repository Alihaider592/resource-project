"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiMail,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiArrowLeft,
} from "react-icons/fi";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  designation?: string;
  picture?: string;
  joiningDate?: string;
}

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async (): Promise<void> => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          setErrorMsg("Unauthorized: No token found. Please log in again.");
          router.push("/login");
          return;
        }

        const res = await fetch(`/api/admin/getuser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const contentType = res.headers.get("content-type");

        // ✅ Make sure server returned JSON
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("❌ Non-JSON response from server:", text);
          throw new Error("Server returned invalid response format.");
        }

        const data: unknown = await res.json();

        // ✅ Validate the response shape
        if (
          typeof data === "object" &&
          data !== null &&
          "user" in data &&
          res.ok
        ) {
          setUser((data as { user: UserProfile }).user);
        } else {
          const message =
            (data as { message?: string })?.message ||
            "Something went wrong while loading the profile.";
          setErrorMsg(message);
          setUser(null);
        }
      } catch (error) {
        const err =
          error instanceof Error
            ? error.message
            : "Unknown error fetching user.";
        console.error("❌ Fetch user failed:", err);
        setErrorMsg(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [id, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading profile...
      </div>
    );

  if (errorMsg)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 font-medium">
        ❌ {errorMsg}
        <button
          onClick={() => router.back()}
          className="mt-4 text-purple-600 underline font-medium"
        >
          ← Go Back
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500">
        ❌ No profile found
        <button
          onClick={() => router.back()}
          className="mt-4 text-purple-600 underline font-medium"
        >
          ← Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <div className="flex flex-col items-center mb-8">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-purple-300 shadow-lg object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-gray-700 border-4 border-purple-200 shadow">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-800 mt-4">{user.name}</h1>
          <p className="text-gray-500">{user.role || "User"}</p>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex items-center gap-3">
            <FiMail className="text-purple-600" /> <span>{user.email}</span>
          </div>
          {user.department && (
            <div className="flex items-center gap-3">
              <FiBriefcase className="text-purple-600" />{" "}
              <span>{user.department}</span>
            </div>
          )}
          {user.designation && (
            <div className="flex items-center gap-3">
              <FiUser className="text-purple-600" />{" "}
              <span>{user.designation}</span>
            </div>
          )}
          {user.joiningDate && (
            <div className="flex items-center gap-3">
              <FiCalendar className="text-purple-600" />{" "}
              <span>Joined on {new Date(user.joiningDate).toDateString()}</span>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            <FiArrowLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
}
