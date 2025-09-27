import React from 'react';
import Cardslider from './cardslider';

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

    // Duplicates list for seamless infinite scroll
    const logos = [...clientLogos, ...clientLogos];
    
    const slideWidthRem = 10; // w-40 = 10rem
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
    `;

    return (
        <div className="w-full flex">
            <style dangerouslySetInnerHTML={{ __html: carouselStyles }} />

            <div className="bg-white py-6 overflow-hidden logo-carousel-container border-b border-gray-200 shadow-md">
                
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
                                // Explicitly type the event for robust error handling in TypeScript
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                                    (e.target as HTMLImageElement).onerror = null; 
                                    (e.target as HTMLImageElement).src = "https://placehold.co/100x40/374151/f97316?text=Logo"; 
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Cardslider/>
        </div>
    );
};

export default Slider;
