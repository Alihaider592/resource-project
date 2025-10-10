// src/app/(pages)/teamlead/teamleadsidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeamLeadSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/teamlead", label: "Dashboard" },
    { href: "/teamlead/profile", label: "Profile" },
  ];

  return (
    <aside className="w-64 bg-teal-600 text-white flex flex-col p-5 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Team Lead Panel</h2>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === link.href ? "bg-white text-teal-700" : "hover:bg-teal-500"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
