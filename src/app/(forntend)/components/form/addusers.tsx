"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaBuilding, FaClipboardList, FaMapMarkedAlt, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  department: string;
  role: string;
  timing: string;
  joiningDate: string;
  leavingDate: string;
  location: string;
  remoteOrSite: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  accountPassword: string;
  experienceYears: string;
  previousCompany: string;
  education: string;
  salary: string;
  additionalInfo: string;
}

export default function FullFledgedAddEmployeeFormWithToast() {
  const initialState: EmployeeData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthday: "",
    department: "",
    role: "",
    timing: "",
    joiningDate: "",
    leavingDate: "",
    location: "",
    remoteOrSite: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    accountPassword: "",
    experienceYears: "",
    previousCompany: "",
    education: "",
    salary: "",
    additionalInfo: "",
  };

  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState<EmployeeData>({ ...initialState });

  const totalSteps = 5;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Employee Data:", employee);

    // Show toast success
    toast.success("Employee added successfully!");

    // Reset form
    setEmployee({ ...initialState });
    setStep(1);
  };

  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Add New Employee
        </h1>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 text-center mb-6">{`Step ${step} of ${totalSteps}`}</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaUser className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={employee.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                    required
                  />
                </div>
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaUser className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={employee.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                    required
                  />
                </div>
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaEnvelope className="text-gray-400 mr-3" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={employee.email}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                    required
                  />
                </div>
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaPhone className="text-gray-400 mr-3" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={employee.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                  />
                </div>
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaBirthdayCake className="text-gray-400 mr-3" />
                  <input
                    type="date"
                    name="birthday"
                    placeholder="Birthday"
                    value={employee.birthday}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">Job Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaBuilding className="text-gray-400 mr-3" />
                  <select
                    name="department"
                    value={employee.department}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaClipboardList className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    name="role"
                    placeholder="Role/Position"
                    value={employee.role}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="timing"
                  placeholder="Timing (e.g., 9am - 5pm)"
                  value={employee.timing}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="date"
                  name="joiningDate"
                  placeholder="Joining Date"
                  value={employee.joiningDate}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="date"
                  name="leavingDate"
                  placeholder="Leaving Date"
                  value={employee.leavingDate}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <select
                  name="remoteOrSite"
                  value={employee.remoteOrSite}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                >
                  <option value="">Remote or On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
                <input
                  type="text"
                  name="location"
                  placeholder="Location / Office"
                  value={employee.location}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
              </div>
            </div>
          )}

          {/* Step 3: Address & Account */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">Address & Account</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={employee.address}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={employee.city}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={employee.state}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  value={employee.zip}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <div className="flex items-center border rounded-lg p-3 bg-gray-50">
                  <FaLock className="text-gray-400 mr-3" />
                  <input
                    type="password"
                    name="accountPassword"
                    placeholder="Account Password"
                    value={employee.accountPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Experience & Education */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">Experience & Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="experienceYears"
                  placeholder="Years of Experience"
                  value={employee.experienceYears}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="text"
                  name="previousCompany"
                  placeholder="Previous Company"
                  value={employee.previousCompany}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="text"
                  name="education"
                  placeholder="Education"
                  value={employee.education}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <input
                  type="text"
                  name="salary"
                  placeholder="Salary"
                  value={employee.salary}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full"
                />
                <textarea
                  name="additionalInfo"
                  placeholder="Additional Information"
                  value={employee.additionalInfo}
                  onChange={handleChange}
                  className="border rounded-lg p-3 bg-gray-50 w-full md:col-span-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">Review Employee Details</h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                <ul className="space-y-2 text-gray-700">
                  {Object.entries(employee).map(([key, value]) => (
                    <li key={key}>
                      <strong className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</strong> {value || "-"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
