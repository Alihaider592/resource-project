import Image from "next/image";
import { FaCheck, FaArrowRight } from "react-icons/fa";
export default function Core() {
    return(
        <div className="w-full max-w-xs hover:shadow-lg ml-5 transition-all ease-in-out duration-1000 hover:shadow-purple-400 p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center gap-3">
        <Image
          src="https://resourceinn.com/wp-content/uploads/2024/04/core-hr.svg"
          alt="Core HR"
          width={48}
          height={48}
        />
        <h4 className="text-xl font-semibold">Core HR</h4>
      </div>

     
      <p className="mt-3 text-gray-600">
        For managing the basic HR operations
      </p>
      <p className="text-gray-600">
        Make your record management easier than ever before
      </p>

      
      <hr className="my-4 border-gray-200" />

     
      <div>
        <p className="font-medium text-gray-800 mb-2">Top Use Cases:</p>
        <ul className="space-y-1 text-gray-700">
          {[
            "People Record Management",
            "Custom Dashboard",
            "Organogram",
            "Employee Self-service (ESS)",
            "People Assets",
            "Report Scheduler",
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <FaCheck className="text-purple-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      
      <div className="mt-6 flex gap-3">
        <a
          href="https://resourceinn.com/free-trial-core-hr/"
          className="flex items-center gap-2 p-2 text-sm p bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FaArrowRight />
          Get Started
        </a>
        <a
          href="https://resourceinn.com/core-hr/"
          className="flex items-center gap-2 p-2 border border-purple-600 text-sm text-purple-600 rounded-lg hover:bg-purple-50 transition"
        >
          <FaArrowRight />
          Learn More
        </a>
      </div>
    </div>
    )
}