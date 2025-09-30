"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export interface StructureProps {
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

export default function Structure({
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
      className={` w-full flex flex-col  `}>  
        <div className={`flex items-center${className}`}>
        <div className="w-[60%] flex flex-col gap-5 p-5">
        <p className="text-4xl font-extrabold">{title}</p>
        <p className="text-2xl font-bold text-purple-700">{subtitle}</p>
        <p className="text-gray-600">{description}</p>
        <div>
              {useCases.map((item) => (
                <li key={item} className="flex items-center ">
                  <Check className="w-4 h-4" style={{ color: buttonColor }} />
                  {item}
                </li>
              ))}
          </div>
          <div className="flex mt-4">
            <Link
              href={buttonlink}
              style={{ backgroundColor: buttonColor }}
              className="text-white rounded-lg cursor-pointer px-2 py-2 text-sm"
            >
              <span>{buttonname}</span>
            </Link>
          </div>
        </div>
        <div className="w-[40%]">
        <img src={image}  />
        </div>
      </div>
        <>
          
        </>
    </div>
  );
}
