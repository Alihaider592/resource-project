"use client";
import React from "react";

const services = [
  {
    id: 1,
    title: "Technology & Services",
    description:
      "Transform your recruitment and retention strategies with our agile HRMS solutions, perfectly suited for the fast-paced tech industry.",
    image: "https://resourceinn.com/wp-content/uploads/2023/10/icons-05.webp",
  },
  {
    id: 2,
    title: "Pharma & Manufacturing",
    description:
      "Effortlessly navigate regulatory challenges and optimize staffing with our smart HRMS, designed to simplify compliance in the pharmaceutical industry.",
    image: "https://resourceinn.com/wp-content/uploads/2023/10/icons-04.webp",
  },
  {
    id: 3,
    title: "Retail & Other Industries",
    description:
      "Master multi-location management and streamline payroll with our advanced HRMS, ensuring seamless operations across all your retail outlets.",
    image: "https://resourceinn.com/wp-content/uploads/2023/10/icons-03.webp",
  },
  {
    id: 4,
    title: "Construction & Engineering",
    description:
      "Transform payroll, scheduling, and compliance into smooth operations with our HRMS tools, boosting efficiency in your construction projects.",
    image: "https://resourceinn.com/wp-content/uploads/2023/10/icons-01.webp",
  },
  {
    id: 5,
    title: "NGOs",
    description:
      "Our HRMS supports NGOs by streamlining compliance and handling taxation, ensuring that your organization runs smoothly and effectively.",
    image: "https://resourceinn.com/wp-content/uploads/2023/10/icons-02.webp",
  },
];

export default function Service() {
  return (
    <section className="bg-white md:px-8 flex flex-col justify-center items-center gap-5 mt-20 lg:px-16">
      <p className="text-3xl font-bold">HRM Software for any Industry </p>
      <p className="text-lg text-gray-500">
        We at Resourceinn are serving multiple verticals with industry-ready
        solutions to meet the best market practices.
      </p>
      <div className="max-w-[1440px] mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-center text-center p-4 bg-white shadow-lg rounded-lg transition-transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-24 h-24 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
      <div className="hover:scale-105 transition-all ease-in-out duration-300 mt-10">
        <a className="mt-10" href="https://resourceinn.com/industries/">
          <span className="font-bold text-lg text-teal-500-600 hover:text-orange-500 transition-all ease-in-out duration-300">
            Explore All Industries →
          </span>
        </a>
      </div>
    </section>
  );
}
