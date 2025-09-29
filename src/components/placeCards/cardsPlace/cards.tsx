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
  return (
    <div
      className={`w-full max-w-xs m-5 p-6 rounded-xl shadow-lg transition-all ease-in-out duration-700 ${className} hover:shadow-${buttonColor}-500`}
    >
      <div className="flex items-center gap-3">
        <img src={icon} alt={title} width={48} height={48} />
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      </div>

      <p className="text-gray-600 text-sm mt-2">{description}</p>
      {subDescription && (
        <p className="text-black font-semibold text-sm">{subDescription}</p>
      )}

      <hr className="my-2 border-gray-200" />

      <div>
        <p className="font-medium ">Top Use Cases:</p>
        <ul className="mt-2 space-y-1 text-sm ">
          {useCases.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className={`w-4 h-4 text-${buttonColor}-400`} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          href={getStartedLink}
          className={` flex gap-2 px-3 py-2 text-sm bg-${buttonColor}-400 text-white rounded-lg hover:bg-${buttonColor}-500 transition`}
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={learnMoreLink}
          className={`flex items-center gap-2 px-3 py-2 border border-${buttonColor}-400 text-sm text-${buttonColor}-500 rounded-lg hover:bg-${buttonColor}-50 transition`}
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
