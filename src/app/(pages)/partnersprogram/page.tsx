import Image from 'next/image';
import React from 'react';
import Button from '@/app/(forntend)/components/buttons';
const CirclesImage = () => {
  return (
    <div className="elementor-element elementor-widget elementor-widget-image">
        <div>
            <div className="relative w-full h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://resourceinn.com/wp-content/uploads/2022/12/header-cover.webp')",
          filter: "brightness(1.5)", 
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-purple-300 to-gray-300 opacity-60"></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-10 h-full">
        <div className='items-center justify-center flex flex-col'>
        <h1 className="text-white text-5xl font-extrabold">Join & Grow with Resourceinns Partners </h1>
        <h1 className="text-white text-5xl font-extrabold">Program</h1>
        </div>
        <div className='items-center justify-center flex flex-col'>
        <h1 className='text-white text-lg w-[800px]'>Let’s join together and help growing SMEs and enterprises make employment easier than ever before. Resourceinn simplifies HR and lets businesses adapt to changes in their needs as they </h1>
        <h1 className='text-white text-lg'>grow. It’s a win-win for you, us, and the customers.</h1>
        </div>
        <Button
                    text="↓Become a Partner"
                    textColor=" text-white hover:text-white"
                    bgColor="bg-orange-500 hover:bg-purple-500 transition-all duration-300 ease-in-out"
                    className=" hover:-translate-y-2 cursor-pointer hover:shadow-lg w-[170px] m-5 ml-0 h-[50px]  border-3 hover:border-purple-500 transition-all duration-500 ease-in-out border-orange-500"
                  />
      </div>
    </div>
        </div>
        
      <div className="elementor-widget-container">
        <Image
          src="https://resourceinn.com/wp-content/uploads/2020/02/circles_bg.png"
          alt="Circles Background"
          width={1146}
          height={1146}
          sizes="(max-width: 1146px) 100vw, 1146px"
          priority 
        />
      </div>
    </div>
  );
};

export default CirclesImage;
