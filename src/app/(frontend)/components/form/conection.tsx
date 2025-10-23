"use client";
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Conection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [comment, setComment] = useState("");

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/connect", {
        name,
        email,
        phonenumber,
        companyname,
        comment,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Your data has been submitted successfully!");
        // reset form
        setName("");
        setEmail("");
        setPhonenumber("");
        setCompanyname("");
        setComment("");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center p-20 bg-gradient-to-b from-purple-800 to-purple-500 w-full">
      {/* Toaster container (must be inside component tree once) */}
      <Toaster position="top-right" reverseOrder={false} />

      <div>
        <img
          className="bg-gray-200 rounded-l-3xl p-4.5"
          src="https://resourceinn.com/wp-content/uploads/2023/01/footer-trial-form-01.webp"
          alt=""
        />
      </div>
      <div className="rounded-r-3xl p-10 bg-white flex flex-col justify-center items-center">
        <p className="text-4xl font-bold">Let’s Connect Today </p>
        <form
          onSubmit={handlesubmit}
          className="flex flex-col gap-5 w-full"
          action="post"
        >
          <div className="flex gap-5">
            <div>
              <p className="mb-1">Name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus:outline-3 focus:outline-blue-700 h-[40px] pl-3 rounded-sm border-2 border-gray-400 w-[250px]"
                type="text"
                name="name"
              />
            </div>
            <div>
              <p className="mb-1">Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-[40px] focus:outline-3 focus:outline-blue-700 pl-3 rounded-sm border-2 border-gray-400 w-[250px]"
                type="email"
                name="email"
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <p className="mb-1">Phone Number</p>
              <input
                value={phonenumber}
                onChange={(e) => setPhonenumber(e.target.value)}
                required
                className="focus:outline-3 focus:outline-blue-700 h-[40px] pl-3 rounded-sm border-2 border-gray-400 w-[250px]"
                type="text"
                name="phonenumber"
              />
            </div>
            <div>
              <p className="mb-1">Company Name</p>
              <input
                value={companyname}
                onChange={(e) => setCompanyname(e.target.value)}
                required
                className="focus:outline-3 focus:outline-blue-700 h-[40px] pl-3 rounded-sm border-2 border-gray-400 w-[250px]"
                type="text"
                name="companyname"
              />
            </div>
          </div>
          <div>
            <p className="mb-1">Tell us about your requirements</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="focus:outline-3 focus:outline-blue-700 rounded-sm p-3 border-gray-400 border-2 w-full h-[150px]"
              name="comment"
              id="area"
            ></textarea>
          </div>
          <button
            type="submit"
            className="hover:-translate-y-2 rounded-full cursor-pointer hover:shadow-lg w-[170px] m-5 ml-0 h-[50px] border-3 hover:border-purple-500 transition-all duration-300 ease-in-out border-orange-500 bg-orange-500 hover:bg-purple-500 text-white"
          >
            Schedule a Call
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conection;
