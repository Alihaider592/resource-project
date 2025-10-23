"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./buttons";

// interface ButtonProps {
//   text: string;
//   textColor?: string;
//   bgColor?: string;
//   className?: string;
// }

export default function Navbar() {
  const pathname = usePathname();

  const menuStyles = `
    @keyframes slideInFade {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .dropdown-menu {
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
    }

    .dropdown-container:hover .dropdown-menu {
      visibility: visible;
      opacity: 1;
      animation: slideInFade 0.3s ease-out forwards;
    }

    .menu-link:hover {
      color: #ae56ff;
    }

    .active-link {
      color: #ae56ff;
      font-weight: bold;
    }
  `;

  const isActive = (href: string): boolean => pathname === href;

  const isParentActive = (hrefs: string[]): boolean =>
    hrefs.some((h) => pathname.startsWith(h));

  return (
    <div className="sticky top-0 z-50 bg-white shadow">
      <style dangerouslySetInnerHTML={{ __html: menuStyles }} />

      <div className="p-5 flex items-center justify-between">
        <div className="flex gap-7 items-center">
          <Link href="/">
            <img
              src="https://resourceinn.com/wp-content/uploads/2020/01/LOGO-01-TM.svg"
              className="w-50 wp-image-25823"
              alt="Resourceinn HR software logo - Smart business empowerment solutions."
            />
          </Link>
          <ul className="flex gap-5 items-center">
            <li className={isActive("/") ? "active-link" : ""}>
              <Link href="/">Home</Link>
            </li>

            <li className={isActive("/solutions") ? "active-link" : ""}>
              <Link href="/solutions" className="flex gap-0.5">
                Solutions
                <img
                  className="w-2 relative top-3 h-2"
                  src="/images/down-arrow.png"
                  alt=""
                />
              </Link>
            </li>

            <li className={isActive("/pricing") ? "active-link" : ""}>
              <Link href="/pricing">Pricing</Link>
            </li>

            <li className={isActive("/services") ? "active-link" : ""}>
              <Link href="/services" className="flex gap-0.5">
                Services
                <img
                  className="w-2 relative top-3 h-2"
                  src="/images/down-arrow.png"
                  alt=""
                />
              </Link>
            </li>

            <li
              className={`relative dropdown-container ${
                isParentActive([
                  "/hr-blog",
                  "/hr-glossary",
                  "/income-tax-calculator-pakistan",
                  "/write-for-us",
                ])
                  ? "active-link"
                  : ""
              }`}
            >
              <Link href="#" className="flex gap-0.5">
                Resources
                <img
                  className="w-2 relative top-3 h-2"
                  src="/images/down-arrow.png"
                  alt=""
                />
              </Link>
              <div className="absolute dropdown-menu pt-4 z-50">
                <div className="flex flex-col p-5 gap-2 w-36 bg-white shadow-2xl shadow-black rounded">
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn.com/hr-blog/"
                  >
                    Our Blog
                  </a>
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn-support.atlassian.net/servicedesk/customer/portal/3"
                  >
                    Help-Desk
                  </a>
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn.com/hr-glossary/"
                  >
                    HR-Glossary
                  </a>
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn.com/income-tax-calculator-pakistan/"
                  >
                    Income Tax Calculator
                  </a>
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn.com/write-for-us/"
                  >
                    Write For Us
                  </a>
                </div>
              </div>
            </li>

            <li
              className={`relative dropdown-container ${
                isParentActive(["/pasha-membership", "/fast-nuces"])
                  ? "active-link"
                  : ""
              }`}
            >
              <Link href="#" className="flex gap-0.5">
                Associations
                <img
                  className="w-2 relative top-3 h-2"
                  src="/images/down-arrow.png"
                  alt=""
                />
              </Link>
              <div className="absolute dropdown-menu pt-4 z-50">
                <div className="flex flex-col p-5 gap-2 w-36 bg-white shadow-2xl shadow-black rounded">
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn.com/pasha-membership/"
                  >
                    Pasha
                  </a>
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn.com/fast-nuces/"
                  >
                    Fast-Nuces
                  </a>
                </div>
              </div>
            </li>

            <li
              className={`relative dropdown-container ${
                isParentActive(["/about", "/about-us", "/clients", "/contact-us"])
                  ? "active-link"
                  : ""
              }`}
            >
              <Link href="/#" className="flex gap-0.5">
                About Us
                <img
                  className="w-2 relative top-3 h-2"
                  src="/images/down-arrow.png"
                  alt=""
                />
              </Link>
              <div className="absolute dropdown-menu pt-4 z-50">
                <div className="flex flex-col p-5 gap-2 w-36 bg-white shadow-2xl shadow-black rounded">
                 <Link href={'/Ourstory'}>
                    Our Story
                 </Link> 
                  <Link href={'/Ourclient'}>
                    Our Client
                 </Link> 
                  <a
                    className=""
                    href="https://resourceinn.com/become-a-partner/"
                  >
                    
                  </a>
                  <Link href={'/partnersprogram'} className="cursor-pointer hover:text-purple-700 menu-link">Resoursein Partners Program</Link>
                  <a
                    className="cursor-pointer hover:text-purple-700 menu-link"
                    href="https://resourceinn.com/contact-us/"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </li>

            {/* Hiring */}
            <li>
              <Link
                href="/hiring"
                className="flex gap-0.5 font-bold text-orange-500 hover:text-purple-600"
              >
                We are hiring!
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-3">
          <a href="https://resourceinn.com/demo/">
            <Button
              text="Book a Demo"
              textColor="text-sm transition-all duration-300 ease-in-out text-orange-500 hover:text-white"
              bgColor="transition-all duration-300 ease-in-out hover:bg-orange-500"
              className="hover:border-none border-3"
            />
          </a>
          <a href="https://resourceinn.com/support/">
            <Button
              text="Get Support"
              textColor="text-sm text-white transition-all duration-300 ease-in-out"
              bgColor="bg-purple-800 hover:bg-purple-500 transition-all duration-300 ease-in-out"
            />
          </a>
        </div>
          <a href="/login">login</a>
          <a href="/signup">signup</a>
      </div>
    </div>
  );
}
