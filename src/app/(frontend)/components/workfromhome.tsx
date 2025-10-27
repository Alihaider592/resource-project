// "use client";
// import React, { useState, ChangeEvent, FormEvent } from "react";
// import toast from "react-hot-toast";
// import { FiSend } from "react-icons/fi";

// interface User {
//   name: string;
//   email: string;
//   role: "user" | "teamlead" | "hr";
// }

// interface WorkFromHomeFormProps {
//   user: User;
// }

// export const WorkFromHomeForm: React.FC<WorkFromHomeFormProps> = ({ user }) => {
//   const [form, setForm] = useState({ date: "", reason: "" });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("/api/wfh/apply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...form,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         }),
//       });

//       const data = await res.json();
//       data.success ? toast.success(data.message) : toast.error(data.message);
//       setForm({ date: "", reason: "" });
//     } catch (error) {
//       toast.error("Something went wrong!");
//       console.error(error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 bg-white shadow rounded-xl space-y-3"
//     >
//       <h2 className="text-xl font-semibold">Apply for Work From Home</h2>

//       <input
//         type="date"
//         name="date"
//         value={form.date}
//         onChange={handleChange}
//         className="w-full border p-2 rounded"
//         required
//       />

//       <textarea
//         name="reason"
//         value={form.reason}
//         onChange={handleChange}
//         placeholder="Reason..."
//         className="w-full border p-2 rounded"
//         required
//       />

//       <button
//         type="submit"
//         className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//       >
//         <FiSend /> Submit
//       </button>
//     </form>
//   );
// };
