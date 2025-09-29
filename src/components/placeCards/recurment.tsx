import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function RecruitmentCard() {
  return (
    <div className="w-full max-w-xs m-5 hover:shadow-lg  transition-all ease-in-out duration-1000 hover:shadow-orange-200 p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center gap-3">
        <img
          src="https://resourceinn.com/wp-content/uploads/2024/04/recruitment.svg"
          alt="Recruitment Icon"
          width={48}
          height={48}
        />
        <h4 className="text-xl font-semibold text-gray-800">Recruitment</h4>
      </div>

      <p className="text-gray-600 text-sm">
        For effective hiring &amp;{" "}
        <span
          className="text-blue-600 underline cursor-pointer"
          tabIndex={0}
          role="link"
          title="Onboarding"
        >
          onboarding
        </span>{" "}
        procedures
      </p>
      <p className="text-gray-600 text-sm">
        Hire the right talent for the right positions for long-term success
      </p>

      <hr className="my-2 border-gray-200" />

      <div>
        <p className="font-medium text-gray-800">Top Use Cases:</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {[
            "Applicant Tracking System (ATS)",
            "Onboarding",
            "Notification & Alerts",
            "Evaluation",
            "CV Bank",
            "Recruitment Funnel",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-orange-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          href="https://resourceinn.com/free-trial-recruitment/"
          className="flex items-center gap-2 p-2 text-sm p bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="https://resourceinn.com/cloud-based-recruiting-software/"
          className="flex items-center gap-2 p-2 border border-orange-600 text-sm text-orange-600 rounded-lg hover:bg-purple-50 transition"
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
