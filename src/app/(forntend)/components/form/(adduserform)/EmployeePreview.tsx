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
        {Object.entries(employee).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b py-1">
            <span className="font-medium capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span className="text-gray-600">
              {typeof value === "string"
                ? value
                : value instanceof File
                ? value.name
                : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePreview;
