import Image from "next/image";
import { FaCheck, FaArrowRight } from "react-icons/fa";

export default function AttendanceCard() {
  return (
    <div className="w-full max-w-xs hover:shadow-lg ml-5 transition-all ease-in-out duration-1000 hover:shadow-orange-300 p-6 rounded-xl shadow-lg bg-white">
      <div className="flex items-center gap-3">
        <Image
          src="https://resourceinn.com/wp-content/uploads/2024/04/attendance.svg"
          alt="Attendance & Leave"
          width={48}
          height={48}
        />
        <h4 className="text-xl font-semibold">Attendance & Leave</h4>
      </div>

      <p className="mt-3 text-gray-600">
        For people time tracking & leave management
      </p>
      <p className="text-gray-600">
        Keep your SOPs transparent with people’s satisfaction
      </p>

      <hr className="my-4 border-gray-200" />

      <div>
        <p className="font-medium text-gray-800 mb-2">Top Use Cases:</p>
        <ul className="space-y-1 text-gray-700">
          {[
            "Roster & Time Scheduling",
            "Leave Management",
            "Biometric Integrations",
            "Travel & Official Duties",
            "Geofencing",
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <FaCheck className="text-orange-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href="https://resourceinn.com/free-trial-attendance/"
          className="flex items-center gap-2 p-2 text-sm p bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          <FaArrowRight />
          Get Started
        </a>
        <a
          href="https://resourceinn.com/online-attendance-management-system/"
          className="flex items-center gap-2 px-4 py-2 text-sm border border-orange-600 text-orange-600 rounded-lg hover:bg-purple-50 transition"
        >
          <FaArrowRight />
          Learn More
        </a>
      </div>
    </div>
  );
}
