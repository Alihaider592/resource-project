"use client";

import React, { useState } from "react";
import EmployeePreview from "./EmployeePreview";
import StepProgressBar from "./StepProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

export interface EmployeeData {
  employeeId: string;
  firstName: string;
  lastName: string;
  cnic: string;
  email: string;
  phone: string;
  emergencyContact: string;
  birthday: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  department: string;
  role: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  experienceLevel: string;
  previousCompany: string;
  experienceYears: string;
  education: string;
  bankAccount: string;
  salary: string;
  password: string;
  workType: "On-site" | "Remote" | "Hybrid";
  avatar?: File | null;
}

const EmployeeStepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState<EmployeeData>({
    employeeId: `EMP-${Date.now()}`,
    firstName: "",
    lastName: "",
    cnic: "",
    email: "",
    phone: "",
    emergencyContact: "",
    birthday: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    department: "",
    role: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    experienceLevel: "",
    previousCompany: "",
    experienceYears: "",
    education: "",
    bankAccount: "",
    salary: "",
    password: "",
    workType: "On-site",
    avatar: null,
  });

  // Handle changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setEmployee((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Validate per step
  const validateStep = (): boolean => {
    const requiredFields: Record<number, (keyof EmployeeData)[]> = {
      1: [
        "firstName", "lastName", "email", "password", "phone",
        "emergencyContact", "cnic", "birthday", "gender", "maritalStatus",
      ],
      2: ["bloodGroup", "address", "city", "state", "zip"],
      3: ["department", "role", "workType"],
      4: ["experienceLevel"],
      5: ["education", "bankAccount", "salary"],
    };

    const fields = requiredFields[step];
    if (fields) {
      for (const field of fields) {
        if (!employee[field]) {
          toast.error(`Please fill the ${field.replace(/([A-Z])/g, " $1")} field.`);
          return false;
        }
      }
    }

    // Extra checks
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
      const phoneRegex = /^\d{11}$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!emailRegex.test(employee.email)) return toast.error("Invalid email format!"), false;
      if (!cnicRegex.test(employee.cnic)) return toast.error("CNIC must be like 12345-1234567-1"), false;
      if (!phoneRegex.test(employee.phone)) return toast.error("Phone must be 11 digits"), false;
      if (!passwordRegex.test(employee.password))
        return toast.error("Password must include uppercase, number & special char"), false;
    }

    if (step === 4 && employee.experienceLevel === "Experienced") {
      if (!employee.previousCompany || !employee.experienceYears) {
        toast.error("Please provide company name & years of experience");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, 6));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    toast.success("Employee Registered Successfully!");

    setEmployee({
      employeeId: `EMP-${Date.now()}`,
      firstName: "",
      lastName: "",
      cnic: "",
      email: "",
      phone: "",
      emergencyContact: "",
      birthday: "",
      gender: "",
      maritalStatus: "",
      bloodGroup: "",
      department: "",
      role: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      experienceLevel: "",
      previousCompany: "",
      experienceYears: "",
      education: "",
      bankAccount: "",
      salary: "",
      password: "",
      workType: "On-site",
      avatar: null,
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">
          Employee Registration Form
        </h2>

        {/* ✅ Progress Bar */}
        <StepProgressBar step={step} />

        {/* ✅ Show form only for steps 1–5 */}
        {step < 6 ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="firstName" placeholder="First Name" value={employee.firstName} onChange={handleChange} />
                  <Input name="lastName" placeholder="Last Name" value={employee.lastName} onChange={handleChange} />
                  <Input name="email" type="email" placeholder="Email" value={employee.email} onChange={handleChange} />
                  <Input name="password" type="password" placeholder="Password" value={employee.password} onChange={handleChange} />
                  <Input name="phone" placeholder="Phone Number" value={employee.phone} onChange={handleChange} />
                  <Input name="emergencyContact" placeholder="Emergency Contact" value={employee.emergencyContact} onChange={handleChange} />
                  <Input name="cnic" placeholder="CNIC (xxxxx-xxxxxxx-x)" value={employee.cnic} onChange={handleChange} />
                  <Input name="birthday" type="date" value={employee.birthday} onChange={handleChange} />
                  <select name="gender" value={employee.gender} onChange={handleChange} className="border rounded-md px-3 py-2">
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <select name="maritalStatus" value={employee.maritalStatus} onChange={handleChange} className="border rounded-md px-3 py-2">
                    <option value="">Marital Status</option>
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Health & Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="bloodGroup" placeholder="Blood Group" value={employee.bloodGroup} onChange={handleChange} />
                  <Input name="address" placeholder="Address" value={employee.address} onChange={handleChange} />
                  <Input name="city" placeholder="City" value={employee.city} onChange={handleChange} />
                  <Input name="state" placeholder="State" value={employee.state} onChange={handleChange} />
                  <Input name="zip" placeholder="Zip Code" value={employee.zip} onChange={handleChange} />
                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Professional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="department" placeholder="Department" value={employee.department} onChange={handleChange} />
                  <select
  name="role"
  value={employee.role}
  onChange={handleChange}
  className="border rounded-md px-3 py-2"
>
  <option value="">Select Role</option>
  <option value="Admin">Admin</option>
  <option value="HR">HR</option>
  <option value="User">User</option>
  <option value="TeamLead">Team Lead</option>
</select>

                  <select name="workType" value={employee.workType} onChange={handleChange} className="border rounded-md px-3 py-2">
                    <option value="">Select Work Type</option>
                    <option>On-site</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </section>
            )}

            {step === 4 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Experience Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select name="experienceLevel" value={employee.experienceLevel} onChange={handleChange} className="border rounded-md px-3 py-2">
                    <option value="">Experience Level</option>
                    <option>Fresher</option>
                    <option>Experienced</option>
                  </select>
                  <Input
                    name="previousCompany"
                    placeholder="Previous Company (if any)"
                    value={employee.previousCompany}
                    onChange={handleChange}
                    disabled={employee.experienceLevel === "Fresher"}
                  />
                  <Input
                    name="experienceYears"
                    placeholder="Years of Experience"
                    value={employee.experienceYears}
                    onChange={handleChange}
                    disabled={employee.experienceLevel === "Fresher"}
                  />
                </div>
              </section>
            )}

            {step === 5 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Education & Finance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="education" placeholder="Highest Education" value={employee.education} onChange={handleChange} />
                  <Input name="bankAccount" placeholder="Bank Account Number" value={employee.bankAccount} onChange={handleChange} />
                  <Input name="salary" type="number" placeholder="Expected Salary" value={employee.salary} onChange={handleChange} />
                  <Input name="avatar" type="file" accept="image/*" onChange={handleChange} />
                </div>
              </section>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button type="button" onClick={prevStep} className="bg-gray-300 hover:bg-gray-400 text-gray-700">
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next
              </Button>
            </div>
          </form>
        ) : (
          // ✅ Step 6: Preview (outside the form)
          <div className="space-y-6">
            <EmployeePreview employee={employee} />
            <div className="flex justify-center gap-4 mt-6">
              <Button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Back
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeStepForm;
