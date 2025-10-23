"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, LogIn, AlertTriangle, CheckCircle, Shield, Briefcase, Zap } from 'lucide-react'; 
import * as React from 'react';

// --- Type Definitions for Props (Required for TypeScript) ---
interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: React.ElementType;
  loading: boolean;
}

// --- Styled Input Field Component ---
const StyledInputField = ({ type, placeholder, value, onChange, Icon, loading }: InputFieldProps) => (
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
            className="w-full py-3.5 pl-12 pr-4 text-gray-800 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition duration-200 ease-in-out placeholder-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
    </div>
);


// --- Main Admin Sign-Up Form Component (Split-Screen Styled) ---
export default function AdminSignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password}),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Admin Sign-Up successful! Redirecting...");
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          router.push("/admin"); 
        }, 1000);
      } else {
        setMessage(data.error || "Something went wrong. Please check your details.");
      }
    } catch (err) {
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer Container: Min-height screen, centered
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-['Inter']">
        
        {/* Styled Card Component: SPLIT SCREEN */}
        <div className="flex w-full max-w-4xl bg-white shadow-2xl shadow-indigo-200/50 rounded-2xl border border-gray-100 overflow-hidden">

            {/* Left Side: STYLISH VISUAL SECTION */}
            <div className="hidden md:flex flex-col justify-between p-12 w-1/2 bg-gradient-to-br from-indigo-700 to-purple-800 text-white relative overflow-hidden">
                
                {/* Animated Circles (for style) */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-32 h-32 bg-white/10 rounded-full absolute -top-16 -left-16 animate-pulse-slow"></div>
                    <div className="w-64 h-64 bg-white/10 rounded-full absolute -bottom-32 -right-32 animate-pulse-slow delay-1000"></div>
                </div>
                
                {/* Branding and Main Text */}
                <div className="relative z-10">
                    <div className="flex items-center mb-6">
                        <Shield className="w-8 h-8 mr-3 text-indigo-200" />
                        <span className="text-xl font-semibold tracking-wider text-indigo-100">Horizon EMS Admin</span>
                    </div>
                    
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                        Secure Access Setup
                    </h1>
                    <p className="text-indigo-200 text-lg font-light">
                        This account holds the keys to system management, configuration, and user control.
                    </p>
                </div>
                
                {/* Features List */}
                <div className="relative z-10 mt-auto pt-8">
                    <p className="text-sm font-semibold text-indigo-300 mb-3">ADMIN PRIVILEGES INCLUDE:</p>
                    <ul className="space-y-2">
                        <li className="flex items-center text-indigo-100 text-sm"><Briefcase className="w-4 h-4 mr-2" /> Full System Configuration</li>
                        <li className="flex items-center text-indigo-100 text-sm"><Zap className="w-4 h-4 mr-2" /> Data Migration and Backup</li>
                        <li className="flex items-center text-indigo-100 text-sm"><Shield className="w-4 h-4 mr-2" /> User Role and Access Management</li>
                    </ul>
                </div>
            </div>

            {/* Right Side: FORM SECTION */}
            <div className="w-full md:w-1/2 p-8 sm:p-12">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Admin Registration</h2>
                    <p className="text-gray-500 mt-1 text-sm">Create the root system administrator account.</p>
                </div>

                {/* Message Alert Area */}
                {message && (
                    <div 
                        className={`flex items-center p-3 mb-4 rounded-lg shadow-sm border ${
                            message.includes("successful") 
                                ? "bg-green-50 border-green-400 text-green-700" 
                                : "bg-red-50 border-red-400 text-red-700"
                        }`}
                    >
                        {message.includes("successful") ? <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />}
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    <StyledInputField type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} Icon={User} loading={loading} />
                    <StyledInputField type="email" placeholder="Admin Email Address" value={email} onChange={(e) => setEmail(e.target.value)} Icon={Mail} loading={loading} />
                    <StyledInputField type="password" placeholder="Secure Password" value={password} onChange={(e) => setPassword(e.target.value)} Icon={Lock} loading={loading} />
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3.5 px-4 mt-2 text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 ease-in-out shadow-lg shadow-indigo-500/40 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Processing...
                            </span>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5 mr-2" />
                                Complete Sign Up
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-2">
                        Ensure the password is strong and stored securely.
                    </p>
                </form>
            </div>
        </div>
        
        {/* Custom CSS for Animations */}
        <style jsx global>{`
            /* Simple pulsing animation for the left pane bubbles */
            @keyframes pulse-slow {
              0% { transform: scale(0.95); opacity: 0.7; }
              50% { transform: scale(1.05); opacity: 0.9; }
              100% { transform: scale(0.95); opacity: 0.7; }
            }
            .animate-pulse-slow {
              animation: pulse-slow 8s ease-in-out infinite alternate;
            }
            .delay-1000 {
              animation-delay: 1s;
            }
        `}</style>
    </div>
  );
}