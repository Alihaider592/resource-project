"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react'; 

// --- Interface Definitions (No Change) ---
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

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: React.ElementType;
  loading: boolean;
}

// --- Input Field Component (No Change) ---
const InputField = ({ type, placeholder, value, onChange, Icon, loading }: InputFieldProps) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-indigo-500">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        disabled={loading}
        className="w-full py-3.5 pl-12 pr-4 text-gray-800 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition duration-200 ease-in-out placeholder-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
);


// --- Main Login Form Component ---

export default function LoginForm() {
  const nextRouter = useRouter(); 
  const router = nextRouter || { push: (path: string) => console.log('Routing to:', path) };

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

      const role = data.user.role.toLowerCase().replace(/\s+/g, "");
      const normalizedRole = role === "user" ? "simpleuser" : role;

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", normalizedRole);
      document.cookie = `token=${data.token}; path=/;`;

      const verifyRes = await fetch("/api/admin/protectedRoute", {
        method: "GET",
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json().catch(() => ({}));
        console.error("Protected route failed:", errData);
        setError(errData.message || "Auth verification failed. Please log in again.");
      } else {
        const verified = await verifyRes.json();
        console.log("Verified user:", verified);
      }
      
      setSuccess("Login successful. Redirecting...");
      await new Promise((resolve) => setTimeout(resolve, 300));

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
      setError("Something went wrong. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer Container: VIBRANT, STYLISH BACKGROUND
    <div className="relative flex items-center justify-center min-h-screen font-['Inter'] p-4 bg-gray-50 overflow-hidden">
        
        {/* Animated Shapes Layer 1: Large, slow-moving, blurred elements */}
        <div className="absolute inset-0 z-0 opacity-60">
            <div className="absolute w-[800px] h-[800px] rounded-[40%] bg-indigo-200/40 blur-[150px] -top-80 -left-60 animate-rotate-slow"></div>
            <div className="absolute w-[600px] h-[600px] rounded-[50%] bg-purple-200/50 blur-[120px] -bottom-60 -right-40 animate-rotate-slow animation-delay-1000"></div>
            <div className="absolute w-[700px] h-[700px] rounded-[60%] bg-blue-100/40 blur-[180px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-rotate-slow animation-delay-2000"></div>
        </div>

        {/* Geometric Overlay Layer 2: Subtle Diagonal Line Pattern */}
        <div className="absolute inset-0 z-0 bg-white/50 bg-[repeating-linear-gradient(-45deg,#f0f0f0_0,#f0f0f0_1px,transparent_1px,transparent_50px)] opacity-30 [background-size:200px_200px]"></div>

        
        {/* Form Card: Split-Screen Layout (z-index 10 to float above background) */}
        <div className="relative z-10 flex bg-white rounded-3xl shadow-2xl shadow-indigo-300/60 overflow-hidden max-w-4xl w-full border border-gray-100 transform transition-all duration-500 hover:shadow-indigo-400/70">

            {/* Left Side: STYLISH & BEAUTIFUL Employee Management Visual */}
            <div className="hidden md:flex flex-col justify-between p-12 w-1/2 bg-gradient-to-br from-indigo-700 to-purple-800 text-white relative overflow-hidden">
                
                {/* Internal Animated Circles (Ping) */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-24 h-24 bg-white/10 rounded-full absolute -top-12 -left-12 animate-ping-slow-1"></div>
                    <div className="w-56 h-56 bg-white/10 rounded-full absolute -bottom-32 -right-32 animate-ping-slow-2"></div>
                    <div className="w-16 h-16 bg-white/20 rounded-full absolute top-1/3 left-1/4 opacity-50 animate-ping-slow-3"></div>
                </div>
                
                {/* Branding and Main Text */}
                <div className="relative z-10">
                    <div className="flex items-center mb-6">
                        <Users className="w-8 h-8 mr-3 text-indigo-200" />
                        <span className="text-xl font-semibold tracking-wider text-indigo-100">Horizon EMS</span>
                    </div>
                    
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                        Powering Your People.
                    </h1>
                    <p className="text-indigo-200 text-lg font-light">
                        Your modern employee management system for streamlined HR operations, performance tracking, and seamless team collaboration.
                    </p>
                </div>
                
                {/* Image Placeholder / Bottom Accent */}
                <div className="relative z-10 mt-auto pt-8">
                    {/* Placeholder for the image */}
                    <div className=" w-full bg-contain bg-no-repeat bg-center">
                        
                    </div>
                    <p className="text-sm text-indigo-300 mt-6 border-t border-indigo-500/50 pt-3">
                        Access roles: Admin, HR, Team Lead, User.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/2 p-8 sm:p-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        Welcome to Horizon
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Enter your secure credentials to proceed.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {error && (
                        <div className="flex items-center p-3 text-red-700 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center p-3 text-green-700 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm">
                            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                            <p className="text-sm font-medium">{success}</p>
                        </div>
                    )}
                    <InputField type="email" placeholder="Work Email" value={email} onChange={(e) => setEmail(e.target.value)} Icon={Mail} loading={loading}/>
                    <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} Icon={Lock} loading={loading}/>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3.5 px-4 mt-1 text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 ease-in-out shadow-lg shadow-indigo-500/30 transform active:scale-[0.99] disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><Clock className="w-5 h-5 mr-3 animate-spin" />Authorizing...</>
                        ) : (
                            <><LogIn className="w-5 h-5 mr-2" />Sign In</>
                        )}
                    </button>
                    <div className="text-center mt-3">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150">
                            Need access? Contact HR.
                        </a>
                    </div>
                </form>
            </div>
        </div>
        
        {/* Custom CSS for Animations (Crucial for the stylistic effect) */}
        <style jsx global>{`
            /* Background Rotation Animation for Oversized Shapes */
            @keyframes rotate-slow {
                0% { transform: rotate(0deg) translate(0, 0); }
                50% { transform: rotate(10deg) translate(50px, 30px); }
                100% { transform: rotate(0deg) translate(0, 0); }
            }
            .animate-rotate-slow {
                animation: rotate-slow 35s ease-in-out infinite alternate;
            }
            .animation-delay-1000 {
                animation-delay: 10s;
            }
            .animation-delay-2000 {
                animation-delay: 20s;
            }

            /* Internal Ping Animation (for the left sidebar bubbles) */
            @keyframes ping {
              0% {
                transform: scale(0.2);
                opacity: 0.8;
              }
              80%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
            .animate-ping-slow-1 {
              animation: ping 4s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
            .animate-ping-slow-2 {
              animation: ping 6s cubic-bezier(0, 0, 0.2, 1) infinite;
              animation-delay: 1.5s;
            }
            .animate-ping-slow-3 {
              animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
              animation-delay: 0.5s;
            }
        `}</style>
    </div>
  );
}