"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiFileText, FiCoffee, FiHome, FiKey } from "react-icons/fi";

const subItems = [
  { name: "Leaves", icon: <FiFileText size={18} />, href: "/user/request/leaves" },
  { name: "Work From Home", icon: <FiCoffee size={18} />, href: "/user/request/whf" },
  { name: "Home Loan", icon: <FiHome size={18} />, href: "/user/request/homeloan" },
  { name: "OTP", icon: <FiKey size={18} />, href: "/user/request/otp" },
];

export default function RequestSubSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-purple-800 text-white w-56 p-4 flex flex-col border-l border-purple-700">
      <h2 className="text-lg font-semibold mb-4">Requests</h2>
      <nav className="flex flex-col gap-2">
        {subItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-purple-700 transition ${
                isActive ? "bg-purple-700" : ""
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
