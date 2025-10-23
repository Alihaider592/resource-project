"use client";

import React from "react";
import { motion } from "framer-motion";
import Cmap from "@/app/(frontend)/components/frame/frameCards/cmap/cmap";
const Page = () => {
  const logoLines: string[][] = [
    [
      "https://resourceinn.com/wp-content/uploads/2024/01/aqary-international.jpg",
      "https://resourceinn.com/wp-content/uploads/2024/01/urdu-point.jpg",
      "https://resourceinn.com/wp-content/uploads/2024/01/RLTSquare_logo.png",
      "https://resourceinn.com/wp-content/uploads/2022/12/engine.webp",
      "https://resourceinn.com/wp-content/uploads/2024/01/cheetay.jpg",
    ],
    [
      "https://resourceinn.com/wp-content/uploads/2022/12/xeven.webp",
      "https://resourceinn.com/wp-content/uploads/2024/01/norinco.webp",
      "https://resourceinn.com/wp-content/uploads/2024/01/manafa.webp",
      "https://resourceinn.com/wp-content/uploads/2024/01/aqary-international.jpg",
      "https://resourceinn.com/wp-content/uploads/2024/01/urdu-point.jpg",
    ],
    [
      "https://resourceinn.com/wp-content/uploads/2024/01/RLTSquare_logo.png",
      "https://resourceinn.com/wp-content/uploads/2022/12/engine.webp",
      "https://resourceinn.com/wp-content/uploads/2024/01/cheetay.jpg",
      "https://resourceinn.com/wp-content/uploads/2022/12/xeven.webp",
      "https://resourceinn.com/wp-content/uploads/2024/01/norinco.webp",
    ],
    [
      "https://resourceinn.com/wp-content/uploads/2024/01/manafa.webp",
      "https://resourceinn.com/wp-content/uploads/2024/01/aqary-international.jpg",
      "https://resourceinn.com/wp-content/uploads/2024/01/urdu-point.jpg",
      "https://resourceinn.com/wp-content/uploads/2024/01/RLTSquare_logo.png",
      "https://resourceinn.com/wp-content/uploads/2022/12/engine.webp",
    ],
  ];

  const lineConfigs = [
    { duration: 20, direction: 1 },
    { duration: 25, direction: -1 },
    { duration: 30, direction: 1 },
    { duration: 22, direction: -1 },
  ];

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-20 p-20">
        <div className="flex flex-col md:flex-row items-center justify-center gap-20">
          <div className="w-96 flex flex-col gap-10">
            <p className="text-5xl text-black font-bold">
              Trusted by 500+ Businesses Worldwide
            </p>
            <p>
              We speak what we hear from our clients. A lot of them had similar
              journeys to yours. See what they’re saying!
            </p>
          </div>
          <div>
            <iframe
              className="rounded-3xl"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/bz21zTQ_LWs?si=T74ZQC7-H643SYln"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <img
          src="https://resourceinn.com/wp-content/uploads/2024/02/raiting-client-page-1.png"
          alt=""
        />

        <div className="flex flex-col gap-8 w-full overflow-hidden mt-20">
          {logoLines.map((logos, index) => {
            const { duration, direction } =
              lineConfigs[index % lineConfigs.length];

            const repeatedLogos = [...logos, ...logos];

            return (
              <div key={index} className="overflow-hidden relative w-full h-24">
                <motion.div
                  className="flex gap-8 absolute whitespace-nowrap"
                  animate={{
                    x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"],
                  }}
                  transition={{ repeat: Infinity, duration, ease: "linear" }}
                >
                  {repeatedLogos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-40 h-20 object-contain rounded-lg shadow-md"
                    />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
        <p className="text-4xl font-bold">See How Our Clients Drive Impact ?</p>
        <Cmap />
        <div className="gap-10 relative right-52 flex flex-col ">
          <p className="text-4xl font-bold">Free trial begins now</p>
          <p className="text-md">
            Experience all of the features without limitations. Attendance,
            Leave, Recruitment, and Payroll.
          </p>
          <button className="bg-blue-500 w-40 hover:bg-gray-500 transition-all duration-500 rounded-4xl text-white font-bold p-4">
            Start free trial
          </button>
        </div>
        <img
          src="https://resourceinn.com/wp-content/uploads/2023/01/footer-trial-form-01.webp"
          alt=""
        />
      </div>
    </div>
  );
};

export default Page;
