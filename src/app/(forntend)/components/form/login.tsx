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
    role: string;
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
        setError(data.error || data.message || "Invalid credentials");
        return;
      }

      if (!data.token || !data.user) {
        setError("Invalid response from server");
        return;
      }

      // Normalize role: "user" → "simpleuser"
      const role = data.user.role.toLowerCase().replace(/\s+/g, "");
      const normalizedRole = role === "user" ? "simpleuser" : role;

      // Save token and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", normalizedRole);
      document.cookie = `token=${data.token}; path=/;`;

      // Verify token once
      const verifyRes = await fetch("/api/admin/protectedRoute", {
        method: "GET",
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json().catch(() => ({}));
        console.error("Protected route failed:", errData);
        setError(errData.message || "Auth verification failed. Please log in again.");
        return;
      }

      const verified = await verifyRes.json();
      console.log("Verified user:", verified);

      setSuccess("Login successful ✅");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect based on normalized role
      switch (normalizedRole) {
        case "admin":
          router.push("/admin");
          break;
        case "hr":
          router.push("/hr");
          break;
        case "teamlead":
          router.push("/teamlead");
          break;
        case "simpleuser":
          router.push("/user");
          break;
        default:
          router.push("/");
          break;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Login error:", message);
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
