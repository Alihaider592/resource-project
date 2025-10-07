"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginResponse {
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "HR" | "simple user" | string;
  };
  error?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name); 
      }
      if (data.token && data.user) {
  document.cookie = `token=${data.token}; path=/`; 
}

      // Redirect based on role
      switch (data.user?.role) {
        case "admin":
          router.push("/admin");
          break;
        case "HR":
          router.push("/HR");
          break;
        case "simple user":
          router.push("/user");
          break;
        default:
          router.push("/");
          break;
      }
      setSuccess("Login successful ✅");
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-purple-800">
          Login
        </h2>

        {error && <p className="text-red-600 p-2 rounded bg-red-100">{error}</p>}
        {success && <p className="text-green-600 p-2 rounded bg-green-100">{success}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="Enter your password"
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
