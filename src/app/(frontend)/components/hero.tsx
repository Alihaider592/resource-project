"use client";

import { motion } from "framer-motion";
import Typewriter from "./typewritter";
import Button from "./buttons";

export default function Hero() {
  return (
    <div className="text-white">
      <motion.img
        className="z-10 relative"
        src="https://resourceinn.com/wp-content/uploads/2022/12/header-cover.webp"
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <div className="flex justify-between">
        <motion.div
          className="w-[50%]  h-[555px] p-8 z-30  absolute top-[30px]"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className=" text-7xl font-extrabold"> Redefine Your</div>
          <div className="text-7xl font-extrabold">HR Potential</div>
          <Typewriter />
          <div className="w-[70%] text-lg">
            <p>
              Optimize every stage of your growth by building a progressive
              culture with All in one HR solution from Resourceinn.
            </p>
          </div>
          <div></div>
          <a href="https://resourceinn.com/free-trial/">
          <Button
            text="↓Free Trial"
            textColor=" text-white hover:text-white"
            bgColor="bg-orange-500 hover:bg-purple-500 transition-all duration-300 ease-in-out"
            className=" hover:-translate-y-2 cursor-pointer hover:shadow-lg w-[130px] m-5 ml-0 h-[50px]  border-3 hover:border-purple-500 transition-all duration-300 ease-in-out border-orange-500"
          />
          </a>
          <a href="#demo-form-footer">
          <Button
            text="Get Free Consultation"
            textColor=" text-white hover:text-white"
            bgColor=" hover:-translate-y-2 hover:shadow-lg bg-prple-500  transition-all duration-300 ease-in-out"
            className=" w-[210px] cursor-pointer m-5 ml-0 h-[50px] border-3 transition-all  duration-300 ease-in-out border-white-500"
          /></a>
          <p>* No credit  card required</p>
        </motion.div>

        <motion.div
          className="w-[50%] right-0 h-[555px] z-30  absolute top-[2px]"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            className="z-20 w-[55%] h-[555px] right-32 absolute"
            src="https://resourceinn.com/wp-content/uploads/2022/12/header-image-side.webp"
            alt=""
          />
        </motion.div>
      </div>
    </div>
  );
}
