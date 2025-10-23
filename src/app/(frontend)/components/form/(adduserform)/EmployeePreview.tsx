"use client";

import React from "react";
import type { EmployeeData } from "./EmployeeStepForm";

interface EmployeePreviewProps {
  employee: EmployeeData;
}

const EmployeePreview: React.FC<EmployeePreviewProps> = ({ employee }) => {
  return (
    <div className="bg-gray-50 rounded-xl shadow-inner p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-purple-700 mb-4 text-center">
        Employee Details Preview
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        {(
          Object.keys(employee) as (keyof EmployeeData)[]
        ).map((key) => {
          const value = employee[key];

          let displayValue: string;

          if (value === undefined || value === null) {
            displayValue = "-";
          } else if (value instanceof File) {
            displayValue = value.name;
          } else if (typeof value === "string" || typeof value === "number") {
            displayValue = value.toString();
          } else {
            displayValue = JSON.stringify(value);
          }

          return (
            <div key={key} className="flex justify-between border-b py-1">
              <span className="font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="text-gray-600">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeePreview;
