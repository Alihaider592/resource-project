import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { color } from "framer-motion";

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
  return (
    <div
  className={`w-full max-w-xs m-5 p-6 rounded-xl shadow-lg transition-all ease-in-out duration-700 flex flex-col ${className} hover:shadow-${buttonColor}-500`}
>
  {/* Header */}
  <div className="flex items-center gap-3">
    <img src={icon} alt={title} width={48} height={48} />
    <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
  </div>

  {/* Description */}
  <p className="text-gray-600 text-sm mt-2">{description}</p>
  {subDescription && (
    <p className="text-black font-semibold text-sm">{subDescription}</p>
  )}

  <hr className="my-2 border-gray-200" />

  {/* Use Cases with Check marks */}
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

  {/* Buttons always at bottom */}
  <div className="flex gap-3 mt-auto">
    <Link
      href={getStartedLink}
      style={{ backgroundColor: buttonColor }}
      className="text-white rounded-lg relative transition flex items-center gap-2 px-3 py-2 text-sm"
    >
      <span>Get Started</span>
      <ArrowRight className="w-4 h-4" />
    </Link>

    <Link
      href={learnMoreLink}
      style={{ color: buttonColor, borderColor: buttonColor }}
      className="flex items-center gap-2 px-3 py-2 border text-sm rounded-lg transition"
    >
      <span>Learn More</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
</div>

  );
}

