import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function PerformanceCard() {
  return (
    <div className="w-full max-w-xs m-5 hover:shadow-lg  transition-all ease-in-out duration-1000 hover:shadow-sky-300 p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center gap-3">
        <img
          src="https://resourceinn.com/wp-content/uploads/2024/04/performance.svg"
          alt="Performance Icon"
          width={48}
          height={48}
        />
        <h4 className="text-xl font-semibold text-gray-800">Performance</h4>
      </div>

      <p className="text-gray-600 text-sm">
        For effective people monitoring &amp; evaluations
      </p>
      <p className="text-gray-600 text-sm">
        Monitor, analyze &amp; track goals in the right direction
      </p>

      <hr className="my-2 border-gray-200" />

      <div>
        <p className="font-medium text-gray-800">Top Use Cases:</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {[
            "360 Feedback",
            "Qualitative",
            "OKR",
            "Appraisals",
            "Analysis",
            "Objective Setting",
            "Self Evaluation",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          href="https://resourceinn.com/free-trial-performance/"
          className="flex items-center gap-2 p-2 text-sm p bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="https://resourceinn.com/cloud-based-performance-management-system/"
          className="flex items-center gap-2 p-2 border border-blue-600 text-sm text-blue-600 rounded-lg hover:bg-purple-50 transition"
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
