"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface CardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  subDescription?: string;
  useCases: string[];
  getStartedLink: string;
  learnMoreLink: string;
  className?: string;
  buttonColor: string;
}

export default function Card({
  icon,
  title,
  description,
  subDescription,
  useCases,
  getStartedLink,
  learnMoreLink,
  className = "",
  buttonColor,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`min-w-[280px] max-w-[300px] w-full p-6 rounded-xl shadow-lg transition-all ease-in-out duration-500 flex flex-col ${className} ${isExpanded ? "h-auto" : "h-[250px]"}`}
    >      <div className="flex items-center gap-3 mb-3">
        <img src={icon} alt={title} width={48} height={48} />
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      </div>

      {/* Expanded Content */}
      <p className="text-gray-600 text-sm mt-2">{description}</p>
      {subDescription && (
        <p className="text-black font-semibold text-sm mt-1">
          {subDescription}
        </p>
      )}
      {isExpanded && (
        <>
          <hr className="my-2 border-gray-200" />
          <div>
            <p className="font-medium">Top Use Cases:</p>
            <ul className="mt-2 space-y-1 text-sm">
              {useCases.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: buttonColor }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 mt-4">
            <Link
              href={getStartedLink}
              style={{ backgroundColor: buttonColor }}
              className="text-white rounded-lg cursor-pointer flex items-center gap-2 px-2 py-2 text-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={learnMoreLink}
              style={{ color: buttonColor, borderColor: buttonColor }}
              className="flex items-center cursor-pointer gap-2 px-3 py-2 border text-sm rounded-lg"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ color: buttonColor }}
        className="mt-4 font-medium text-sm underline cursor-pointer hover:opacity-80 transition"
        >
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}
