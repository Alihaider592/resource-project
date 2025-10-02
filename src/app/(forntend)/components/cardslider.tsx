'use client';

import React, { useState, useEffect } from 'react';

interface Slide {
    id: number;
    title: string;
    icon: string;
    subTitle: string;
    details?: string;
    link: string;
    linkText: string;
}

const Cardslider: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(1);

    const slides: Slide[] = [
        {
            id: 1,
            title: "New Feature Alert",
            icon: "🔔",
            subTitle: "Facial Recognition Attendance ✨",
            details: "Manage attendance with advanced face recognition technology combined with geofencing to ensure location-based accuracy 📍.",
            link: "https://resourceinn.com/face-recognition-resourceinn-mobile-app/",
            linkText: "Learn More",
        },
        {
            id: 2,
            title: "Resourceinn v9.0!",
            icon: "🔔",
            subTitle: "Resourceinn v9.0 is live",
            link: "https://resourceinn.com/offers/resourceinn-9.0",
            linkText: "Get Free Trial!",
        },
    ];

    const handleSlideChange = (slideId: number) => {
        if (slideId !== activeSlide) {
            setActiveSlide(slideId);
        }
    };

    useEffect(() => {
        if (slides.length <= 1) return;

        const intervalId = setInterval(() => {
            setActiveSlide((prev) => (prev === slides.length ? 1 : prev + 1));
        }, 5000);

        return () => clearInterval(intervalId);
    }, [slides.length]);

    const transformStyle = {
        transform: `translateY(-${(activeSlide - 1) * (100 / slides.length)}%)`,
    };

    const animationStyles = `
        @keyframes slideInFromLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in {
            animation: slideInFromLeft 1s ease-out 0.3s 1 forwards; 
        }

        .pagination-item {
            cursor: pointer;
            transition: all 0.3s ease;
            width: 1.5rem; 
            height: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px; 
            font-weight: 500; 
            font-size: 0.75rem; 
        }

        .pagination-item.is-current {
            background-color: #7c3aed; 
            color: #ffffff; 
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    `;

    return (
        <div className="w-full max-w-sm mx-auto py-2 px-2">
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

            <div className="slideshow-slide-caption bg-white text-gray-900 overflow-hidden h-40 md:h-44 opacity-0 rounded-b-3xl animate-slide-in">
                <div className="h-[200%] transition-transform duration-500 ease-in-out" style={transformStyle}>
                    {slides.map((slide) => (
                        <div key={slide.id} className="h-1/2 shrink-0">
                            <div className="slideshow-slide-caption-text text-center flex flex-col justify-center h-full p-2">
                                <h2 className="text-xl font-extrabold mb-1">
                                    <span id={`slide-title-${slide.id}`} className="inline-flex items-center space-x-1">
                                        {slide.title} 
                                        <span className="text-yellow-500 text-xl leading-none">{slide.icon}</span>
                                    </span>
                                </h2>

                                <div className="text-xs text-gray-700 max-w-xs mx-auto mb-3">
                                    <p className={`font-bold text-sm text-purple-600 ${slide.details ? 'mb-1' : 'mb-0'}`}>
                                        {slide.subTitle}
                                    </p>
                                    {slide.details && <p>{slide.details}</p>}
                                </div>

                                <a
                                    className="inline-block px-4 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-full transition duration-300 ease-in-out hover:bg-purple-700 shadow-md transform hover:scale-105"
                                    href={slide.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {slide.linkText}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-3">
                <div className="pagination">
                    <div className="container flex space-x-2">
                        {slides.map((slide) => (
                            <span
                                key={slide.id}
                                className={`pagination-item ${activeSlide === slide.id ? 'is-current' : 'text-gray-500 hover:text-gray-600'}`}
                                onClick={() => handleSlideChange(slide.id)}
                                data-slide={slide.id}
                            >
                                {slide.id}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cardslider;
