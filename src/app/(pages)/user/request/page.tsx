// "use client";

// import React from "react";
// import { FiFileText, FiCoffee, FiHome, FiKey } from "react-icons/fi";
// import Link from "next/link";

// const RequestPage = () => {
//   const requestTypes = [
//     {
//       title: "Leave Request",
//       description: "Apply for leave and track approval status.",
//       icon: <FiFileText className="text-purple-700 text-3xl" />,
//       href: "/user/request/leaves",
//     },
//     {
//       title: "Work From Home",
//       description: "Submit a WFH request for specific dates.",
//       icon: <FiCoffee className="text-purple-700 text-3xl" />,
//       href: "/user/request/whf",
//     },
//     {
//       title: "Home Loan",
//       description: "Apply for company home loan assistance.",
//       icon: <FiHome className="text-purple-700 text-3xl" />,
//       href: "/user/request/homeloan",
//     },
//     {
//       title: "OTP Request",
//       description: "Generate or verify a one-time password.",
//       icon: <FiKey className="text-purple-700 text-3xl" />,
//       href: "/user/request/otp",
//     },
//   ];

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold text-purple-900 mb-2">Requests Dashboard</h1>
//       <p className="text-gray-600 mb-8">
//         Select a request type below or from the sidebar to get started.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {requestTypes.map((req) => (
//           <Link
//             href={req.href}
//             key={req.title}
//             className="bg-white shadow-md hover:shadow-lg border border-gray-200 rounded-2xl p-6 flex flex-col items-start gap-3 transition-all duration-300 hover:-translate-y-1"
//           >
//             <div className="p-3 bg-purple-100 rounded-full">{req.icon}</div>
//             <h2 className="text-lg font-semibold text-purple-900">{req.title}</h2>
//             <p className="text-gray-500 text-sm">{req.description}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RequestPage;
import WorkFromHomePage from "@/app/(frontend)/components/workfromhome";
export default function Page() {
  return <WorkFromHomePage userRole="hr" />;
}

