"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiFileText, FiCoffee, FiHome } from "react-icons/fi";

const teamLeadRequestItems = [
  { name: "Leaves", icon: <FiFileText size={18} />, href: "/teamlead/leaves" },
  { name: "Work From Home", icon: <FiCoffee size={18} />, href: "/teamlead/employee-requests/wfh" },
  { name: "Home Loan", icon: <FiHome size={18} />, href: "/teamlead/employee-requests/homeloan" },
];

export default function TeamLeadRequestSubSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col p-4 gap-3 bg-teal-600 h-full text-white">
      <h2 className="text-lg font-semibold mb-4 border-b border-teal-500 pb-2">Team Members Requests</h2>
      <nav className="flex flex-col gap-2">
        {teamLeadRequestItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 cursor-pointer hover:bg-teal-500 ${
                isActive ? "bg-teal-500 font-semibold shadow-lg" : ""
              }`}
            >
              {item.icon}
              <span className="text-white">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
