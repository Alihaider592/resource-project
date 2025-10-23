import React from 'react';
import Cardslider from './cardslider';
import { div } from 'framer-motion/client';

const Slider = () => {
  const clientLogos = [
    "https://resourceinn.com/wp-content/uploads/2022/12/apricart.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/engine.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/educative.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/Edward-malt2.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/consoli-ads.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/dialysiscare.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/enablers.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/extreme-ecommerce.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/glowgo.webp",
    "https://resourceinn.com/wp-content/uploads/2022/12/haball.webp",
  ];

  const logos = [...clientLogos, ...clientLogos];
  const slideWidthRem = 10;
  const wrapperWidth = logos.length * slideWidthRem;

  const carouselStyles = `
    @keyframes scroll-logos {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
    }

    .logo-carousel-wrapper {
        animation: scroll-logos 40s linear infinite;
        will-change: transform;
    }

    .logo-carousel-container:hover .logo-carousel-wrapper {
        animation-play-state: paused;
    }

    @keyframes slideInFromRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }

    .animate-slide-in-right {
        animation: slideInFromRight 1s ease-out 0.3s 1 forwards;
        opacity: 0;
    }
  `;

  return (
    <div className="flex items-center justify-between w-full bg-white overflow-hidden">
      {/* Left Section - Card Slider */}
      <div className="flex-shrink-0 w-[35%] h-[210px] flex items-center justify-center border-r border-gray-200 overflow-hidden">
        <Cardslider />
      </div>

      {/* Right Section - Logos */}
      <div className="flex-1 overflow-hidden animate-slide-in-right h-[100px] flex items-center">
        <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />
        <div className="logo-carousel-container w-full overflow-hidden">
          <div
            className="flex logo-carousel-wrapper items-center"
            style={{ width: `${wrapperWidth}rem` }}
          >
            {logos.map((src, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 h-16 flex items-center justify-center px-4"
              >
                <img
                  src={src}
                  alt={`Client Logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x40/374151/f97316?text=Logo";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
