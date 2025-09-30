"use client";
import { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { cardname } from "../cData/cData";
import Cardstructure from "../cstructure/cstructure";

export default function Cmap() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardname.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x < -50) {
      // swipe left next
      setActiveIndex((prev) => (prev + 1) % cardname.length);
    } else if (info.offset.x > 50) {
      // swipe right prev
      setActiveIndex((prev) =>
        prev === 0 ? cardname.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pt-10 bg-white">
       {/* slider */}
      <div className="overflow-hidden relative h-64">
        <motion.div
          className="flex"
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {cardname.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0 px-4">
              <Cardstructure {...item} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {cardname.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full ${
              activeIndex === index ? "bg-purple-600" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
