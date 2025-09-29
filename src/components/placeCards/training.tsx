import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function TrainingCard() {
  return (
    <div className="w-full max-w-xs m-5 hover:shadow-lg transition-all ease-in-out duration-1000 hover:shadow-sky-300 p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center gap-3">
        <img
          src="https://resourceinn.com/wp-content/uploads/2024/04/training.svg"
          alt="Training Icon"
          width={48}
          height={48}
        />
        <h4 className="text-xl font-semibold text-gray-800">
          Training &amp; Development
        </h4>
      </div>

      <p className="text-gray-600 text-sm">
        Fill the learning gaps of your workforce with proper training
      </p>
      <p className="text-gray-600 text-sm">
        Make your people stay on top of fast-paced competitions
      </p>

      <hr className="my-2 border-gray-200" />

      <div>
        <p className="font-medium text-gray-800">Top Use Cases:</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {[
            "Course Planning",
            "Media Library Course Material",
            "Scheduling of Training Events",
            "Training Calendar",
            "Certificate",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sky-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          href="https://resourceinn.com/free-trial-td"
          className="flex items-center gap-2 p-2 text-sm p bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="https://resourceinn.com/employee-training-and-development-software/"
          className="flex items-center gap-2 p-2 border border-sky-400 text-sm text-sky-500 rounded-lg hover:bg-purple-50 transition"
        >
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
