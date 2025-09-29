"use client";

import Link from "next/link";
import { FaCheck, FaArrowRight } from "react-icons/fa";

export default function PayrollCard() {
  return (
    <div className="w-full max-w-xs hover:shadow-lg transition-all ease-in-out duration-1000 hover:shadow-green-700 p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center gap-4">
        <img
          src="https://resourceinn.com/wp-content/uploads/2024/04/payroll.svg"
          alt="Payroll"
          width={48}
          height={48}
          className="w-12 h-12"
        />
        <h4 className="text-lg font-semibold">Payroll</h4>
      </div>

      <p className="mt-4 text-gray-600">
        For managing your people’s <span className="font-medium">payroll</span>{" "}
        operations easily
      </p>
      <p className="mt-2 text-gray-600">
        Save your time with fast, easy & accurate{" "}
        <span className="font-medium">payroll</span>
      </p>

      <div className="my-4 border-t border-gray-200"></div>

      <h5 className="font-semibold mb-2">Top Use Cases:</h5>
      <ul className="space-y-2 text-gray-700">
        {[
          "Tax & Compliance",
          "Pay Slips",
          "Integrations",
          "Compensations",
          "Custom Pay Items",
          "Leave Encashment",
          "Final Settlement",
        ].map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <FaCheck className="text-green-600" />
            {item}
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-6">
        <Link
          href="https://resourceinn.com/free-trial-payroll/"
           className="flex items-center gap-2 p-2 text-sm p bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Get Started <FaArrowRight />
        </Link>
        <Link
          href="https://resourceinn.com/payroll-management-system/"
         className="flex items-center gap-2 p-2 border border-green-600 text-sm text-green-600 rounded-lg hover:bg-purple-50 transition"
        >
          Learn More <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}
