"use client";
import React from "react";

interface Step {
  number: number;
  label: string;
}

interface StepProgressBarProps {
  step: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ step }) => {
  const steps: Step[] = [
    { number: 1, label: "Contact Info" },
    { number: 2, label: "Personal Info" },
    { number: 3, label: "Role" },
    { number: 4, label: "Address" },
    { number: 5, label: "Experience Info" },
    { number: 6, label: "Preview" },
  ];

  return (
    <div className="flex items-center justify-between max-w-4xl w-full mb-8 mx-auto">
      {steps.map((item, index, arr) => (
        <div key={item.number} className="flex-1 flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold border-2 transition-colors duration-300 ${
              step === item.number
                ? "bg-purple-600 border-purple-600 text-white"
                : step > item.number
                ? "bg-purple-400 border-purple-400 text-white"
                : "bg-white border-gray-400 text-gray-600"
            }`}
          >
            {item.number}
          </div>
          <div className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap">
            {item.label}
          </div>
          {index < arr.length - 1 && (
            <div
              className={`flex-1 h-[2px] mx-4 transition-colors duration-300 ${
                step > item.number ? "bg-purple-500" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepProgressBar;
