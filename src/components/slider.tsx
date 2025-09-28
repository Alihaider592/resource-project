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
        /* Continuous horizontal scroll animation */
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

        /* Single-run animation for entrance from the right */
        @keyframes slideInFromRight {
            0% { 
                transform: translateX(100%); /* Start 100% off-screen to the right */
                opacity: 0;
            }
            100% { 
                transform: translateX(0); /* End in final position */
                opacity: 1;
            }
        }

        .animate-slide-in-right {
            /* Smooth 1s duration, 0.3s delay, runs once */
            animation: slideInFromRight 1s ease-out 0.3s 1 forwards;
            /* Ensure the component is hidden before animation starts */
            opacity: 0; 
        }
    `;

    return (

        <div className='h-[100px] flex'>
            <Cardslider/>
        <div className=" overflow-hidden animate-slide-in-right">
            
            <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />

            <div className="bg-white py-6 overflow-hidden logo-carousel-container border-b border-gray-200 shadow-md w-full">
                
                <div 
                    className="flex logo-carousel-wrapper" 
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
                                    (e.target as HTMLImageElement).src = "https://placehold.co/100x40/374151/f97316?text=Logo"; 
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
