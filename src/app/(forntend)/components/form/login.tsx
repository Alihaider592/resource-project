"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState(""); // only for admin
  const [isAdmin, setIsAdmin] = useState(false); // toggle state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 
    setSuccess("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, adminKey: isAdmin ? adminKey : undefined }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.error || "Login failed");
      else {
        setSuccess("Login successful ✅");
        if (data.token) localStorage.setItem("token", data.token);
        router.push(data.user.role === "admin" ? "/admin" : "/");
      }
    } catch {
      setError("Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-purple-800">Login</h2>

        {error && <p className="text-red-600 text-sm mb-2 bg-red-100 p-2 rounded">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2 bg-green-100 p-2 rounded">{success}</p>}

        {/* Toggle */}
        <div className="flex items-center justify-center mb-4">
          <span className={`mr-2 font-medium ${!isAdmin ? "text-gray-800" : "text-gray-400"}`}>User</span>
          <button
            type="button"
            onClick={() => setIsAdmin(!isAdmin)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              isAdmin ? "bg-purple-700" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                isAdmin ? "translate-x-6" : "translate-x-0"
              }`}
            ></span>
          </button>
          <span className={`ml-2 font-medium ${isAdmin ? "text-gray-800" : "text-gray-400"}`}>Admin</span>
        </div>

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

        {/* Admin Key Input */}
        {isAdmin && (
          <input
            type="password"
            placeholder="Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            required={isAdmin}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

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
