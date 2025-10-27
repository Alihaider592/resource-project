"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { FiSend, FiHome, FiLock, FiCalendar, FiBriefcase, FiMail, FiUser } from "react-icons/fi";

interface User {
  name: string;
  email: string;
  role: "user" | "teamlead" | "hr";
}

interface WorkFromHomeFormProps {
  user: User;
}

export const WorkFromHomeForm: React.FC<WorkFromHomeFormProps> = ({ user }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    workType: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill name and email from user prop on load
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.workType || !form.reason || !form.name || !form.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // NOTE: API call remains the same
      const res = await fetch("/api/user/profile/request/wfh/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          role: user.role,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Work From Home request submitted! Awaiting approval.");
        setForm((prev) => ({
          ...prev,
          date: "",
          workType: "",
          reason: "",
        }));
      } else {
        toast.error(data.message || "Failed to submit WFH request.");
      }
    } catch (error) {
      console.error("WFH apply error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-white space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Applicant Information (Editable) */}
        <div className="border-gray-200 space-y-6"> 
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FiUser className="w-4 h-4 text-purple-600" /> Applicant Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name - Now Editable */}
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm text-gray-800"
                        required
                        disabled
                    />
                </div>

                {/* Email - Now Editable */}
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your work email"
                        className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm text-gray-800"
                        required
                        disabled
                    />
                </div>
            </div>
        </div>


        {/* SECTION 2: WFH Details - Clearly separated container with color */}
        {/* <div className="p-6 border border-purple-200 rounded-xl shadow-md bg-purple-50/50 space-y-6"> */}
            <p className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                <FiCalendar className="w-4 h-4" /> Schedule & Role
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">
                    WFH Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm text-gray-800"
                    required
                  />
                </div>

                {/* Work Type */}
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">
                    Type of Work
                  </label>
                  <select
                    name="workType"
                    value={form.workType}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 rounded-xl p-3 appearance-none bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm text-gray-800 cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select work type</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="testing">Testing</option>
                    <option value="management">Management</option>
                    <option value="other">Other</option>
                  </select>
                </div>
            </div>
        {/* </div> */}

        {/* SECTION 3: Reason - Clearly separated container */}
        {/* <div className="p-6 border border-gray-200 rounded-xl shadow-md bg-white"> */}
            <label className="block text-sm font-bold mb-3 text-gray-700">Reason (Required)</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Explain why you are requesting WFH..."
              rows={4}
              className="w-full border-2 border-gray-300 rounded-xl p-3 h-32 resize-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm text-gray-800"
              required
            />
        {/* </div> */}

        {/* Submit Button (outside sections) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-3 rounded-xl font-bold transition duration-300 shadow-lg flex items-center justify-center gap-2 
            ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/40'
            }`}
        >
          {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
          ) : (
            <>
              <FiSend className="w-5 h-5" /> Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};
