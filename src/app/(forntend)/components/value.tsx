"use client"

import React from "react"
import Image from "next/image"

const VideoSection = () => {
  return (
    <section className="w-full bg-white py-10">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
        <div>
            <h1>You don’t only have to take our word for it. Hear what hundreds of our esteemed customers say.</h1>
        </div>
        {/* Left Side - Video */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-xl aspect-video">
            <iframe
              className="w-full h-full rounded-xl"
              src="https://www.youtube.com/embed/bz21zTQ_LWs?controls=1&rel=0"
              title="Client Review 2022 | HRM Software | Resourceinn"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Middle Image */}
        <div className="w-full md:w-1/4 flex justify-center relative">
          <Image
            src="https://resourceinn.com/wp-content/uploads/2022/09/web-pic.png"
            alt="Website Preview"
            width={845}
            height={776}
            className="rounded-lg object-contain"
          />
        </div>

        {/* Right Decorative Image */}
        <div className="hidden md:flex w-1/4 justify-center relative">
          <Image
            src="https://resourceinn.com/wp-content/uploads/2020/02/dot_pattern-e1586412100453.png"
            alt="Dot Pattern"
            width={220}
            height={220}
            className="absolute top-0 right-0 opacity-70"
          />
        </div>
      </div>
    </section>
  )
}

export default VideoSection
