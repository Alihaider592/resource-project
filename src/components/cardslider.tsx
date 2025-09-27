import React, { useState, useEffect } from 'react';

const FeatureAlert = () => {
    // State to track the currently visible slide index (1-based for easy display)
    const [activeSlide, setActiveSlide] = useState(1);

    // Data structure for the two slides
    const slides = [
        {
            id: 1,
            title: "New Feature Alert",
            icon: "🔔",
            subTitle: "Facial Recognition Attendance ✨",
            details: "Manage attendance with advanced face recognition technology combined with geofencing to ensure location-based accuracy 📍.",
            link: "https://resourceinn.com/face-recognition-resourceinn-mobile-app/",
            linkText: "Learn More",
        },
        // The data for this second card already matches your request:
        {
            id: 2,
            title: "Resourceinn v9.0!", 
            icon: "🔔",
            subTitle: "Resourceinn v9.0 is live", // This acts as the main description
            details: "", // Kept empty as the content is brief
            link: "https://resourceinn.com/offers/resourceinn-9.0",
            linkText: "Get Free Trial!",
        }
    ];
    
    // Function to handle changing the slide when a pagination button is clicked (manual control)
    // FIX: Explicitly typed 'slideId' as 'number' to resolve TypeScript error 7006.
    const handleSlideChange = (slideId: number) => {
        if (slideId !== activeSlide) {
            setActiveSlide(slideId);
        }
    };

    // ---------------------------------------------------------------------
    // Automatic Slide Switching Logic
    // ---------------------------------------------------------------------
    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveSlide(prevSlide => {
                // If at the last slide, go to 1, otherwise advance
                const nextSlideId = prevSlide % slides.length === 0 ? 1 : prevSlide + 1;
                return nextSlideId;
            });
        }, 5000); // Change slide every 5 seconds (5000 milliseconds)

        // Cleanup function: Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [slides.length]); 

    // Calculate the translation percentage for the scroll effect.
    const transformStyle = {
        transform: `translateY(-${(activeSlide - 1) * (100 / slides.length)}%)`,
    };

    // Define the custom CSS for the animations
    const animationStyles = `
        /* Continuous, subtle tilt and float animation for the whole card (circular-like movement) */
        @keyframes circularTilt {
            0% { 
                transform: translateY(0) rotateZ(0deg); 
            }
            50% { 
                transform: translateY(-8px) rotateZ(0.5deg); /* Slight lift and tilt */
            }
            100% { 
                transform: translateY(0) rotateZ(0deg); 
            }
        }

        .animate-circular-tilt {
            animation: circularTilt 8s ease-in-out infinite alternate;
        }
        
        /* Removed instantFadeIn as it's no longer needed with smooth scrolling */

        /* Styling for the pagination dots */
        .pagination-item {
            cursor: pointer;
            transition: all 0.3s ease;
            width: 2.5rem; /* Wider touch area */
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px; /* Full rounded/circle */
            font-weight: 600;
        }

        .pagination-item.is-current {
            background-color: #7c3aed; /* Tailwind purple-600 */
            color: #ffffff; /* White text for contrast */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }
    `;

    return (
        <div className="w-full max-w-5xl mx-auto py-12 md:py-20 px-4">
            <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

            {/* Main Slide Container - Changed background and text color, kept animation and overflow-hidden */}
            <div className="slideshow-slide-caption bg-white text-gray-900 rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-16 animate-circular-tilt overflow-hidden h-64 md:h-72 lg:h-80">
                
                {/* Scrollable Track: ADDED smooth transition classes */}
                <div 
                    className={`h-[200%] transition-transform duration-500 ease-in-out`}
                    style={transformStyle}
                >
                    {slides.map((slide) => (
                        // Individual Slide Content Block: Takes up half the track height (100% of the visible container).
                        <div key={slide.id} className="h-1/2 shrink-0">
                            {/* Inner Content Container: Removed the key and instant fade classes */}
                            <div className="slideshow-slide-caption-text text-center flex flex-col justify-center h-full">
                                {/* Title Section */}
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                                    <span id={`slide-title-${slide.id}`} className="inline-flex items-center space-x-3">
                                        {slide.title} 
                                        <span className="text-yellow-500 text-4xl leading-none">
                                            {slide.icon}
                                        </span>
                                    </span>
                                </h2>

                                {/* Description Section */}
                                <div className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mb-8">
                                    {/* Changed text-orange-400 to text-purple-600 */}
                                    <p className={`font-bold text-xl sm:text-2xl text-purple-600 mb-4 ${slide.details ? '' : 'mb-0'}`}>
                                        {slide.subTitle} 
                                    </p>
                                    
                                    {slide.details && (
                                         <p>
                                            {slide.details}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Call to Action Link - Changed background to purple and text to white */}
                                <a 
                                    className="inline-block px-8 py-3 text-lg font-medium text-white bg-purple-600 rounded-full transition duration-300 ease-in-out hover:bg-purple-700 shadow-lg transform hover:scale-105" 
                                    href={slide.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="slideshow-slide-caption-subtitle-label">{slide.linkText}</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Buttons (Still available for manual override) */}
            <div className="flex justify-center mt-8">
                <div className="pagination">
                    <div className="container flex space-x-4">
                        {slides.map(slide => (
                            <span 
                                key={slide.id}
                                // Adjusted text color for non-current item to contrast against white background
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

export default FeatureAlert;
