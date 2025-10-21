"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiFileText, FiCoffee, FiHome } from "react-icons/fi";

const hrRequestItems = [
  { name: "Leaves", icon: <FiFileText size={18} />, href: "/hr/leaves" },
  { name: "Work From Home", icon: <FiCoffee size={18} />, href: "/hr/employee-requests/wfh" },
  { name: "Home Loan", icon: <FiHome size={18} />, href: "/hr/employee-requests/homeloan" },
];

export default function RequestSubSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col p-4 gap-2">
      <h2 className="text-lg font-semibold mb-4">Employee Requests</h2>
      <nav className="flex flex-col gap-2">
        {hrRequestItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-green-500 transition ${
                isActive ? "bg-green-500" : ""
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
