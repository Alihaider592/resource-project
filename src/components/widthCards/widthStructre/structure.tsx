"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface StructureProps {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description?: string;
  useCases: string[];
  buttonname: string;
  buttonlink: string;
  className?: string;
  buttonColor: string;
}

export default function structure({
  image,
  title,
  description,
  subtitle,
  useCases,
  buttonname,
  buttonlink,
  className = "",
  buttonColor,
}: StructureProps) {

  return (
    <div
      className={` w-full p-6 rounded-xl shadow-lg transition-all ease-in-out duration-500 flex flex-col ${className} `}>  
        <div className="flex items-center gap-3 mb-3">
        <div>

        <img src={image} width={200} height={200} />
        </div>
        <p>{title}</p>
        <p>{subtitle}</p>
        <p>{description}</p>
        <p>{useCases}</p>
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      </div>

      {/* Expanded Content */}
      {/* <p className="text-gray-600 text-sm mt-2">{description}</p>
      {subDescription && (
        <p className="text-black font-semibold text-sm mt-1">
          {subDescription}
        </p>
      )} */}
      
        <>
          <div>
            {/* <ul className="mt-2 space-y-1 text-sm"> */}
              {useCases.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: buttonColor }} />
                  {item}
                </li>
              ))}
            {/* </ul> */}
          </div>
          <div className="flex gap-3 mt-4">
            <Link
              href={buttonlink}
              style={{ backgroundColor: buttonColor }}
              className="text-white rounded-lg cursor-pointer flex items-center gap-2 px-2 py-2 text-sm"
            >
              <span>{buttonname}</span>
            </Link>
          </div>
        </>
    </div>
  );
}
