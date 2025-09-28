import React, { useState, useEffect } from 'react';

// Tailwind CSS is assumed to be configured in the Next.js project.

/**
 * A responsive feature card component that reveals content in a simple,
 * step-by-step animation sequence (Card -> Text -> Icons).
 */
const Technology = () => {
  // === 1. STATE MANAGEMENT ===
  // We use state to control which part of the component should be visible.
  // 0: Everything is hidden initially.
  // 1: The main card wrapper is visible.
  // 2: The Title and Description text are visible.
  // 3: The three Feature Icons are visible (this triggers the staggered entry).
  const [animationStep, setAnimationStep] = useState(0);

  // === 2. ANIMATION LOGIC (RUNS ONCE) ===
  // The useEffect hook runs when the component first loads and sets up the timers
  // for the sequential animation.
  useEffect(() => {
    // 1. Show the main card wrapper after a tiny delay (100ms)
    const cardTimer = setTimeout(() => {
      setAnimationStep(1);
    }, 100);

    // 2. Show the text (Title and Description) 500ms after the card appears
    const textTimer = setTimeout(() => {
      setAnimationStep(2);
    }, 600); 

    // 3. Show the features (icons) 600ms after the text appears
    const featuresTimer = setTimeout(() => {
      setAnimationStep(3);
    }, 1200); 

    // Cleanup function: important for stopping the timers if the component is removed
    return () => {
      clearTimeout(cardTimer);
      clearTimeout(textTimer);
      clearTimeout(featuresTimer);
    };
  }, []); // Empty array means this runs only once on mount

  // === 3. DATA FOR FEATURES ===
  const features = [
    {
      url: "https://resourceinn.com/wp-content/uploads/2022/12/granular-control-01.webp",
      label: "Granular Control",
      delay: "delay-100", // Controls when this specific icon appears
    },
    {
      url: "https://resourceinn.com/wp-content/uploads/2022/12/no-code-01.webp",
      label: "No-Code Policy",
      delay: "delay-300", // Appears after the first icon
    },
    {
      url: "https://resourceinn.com/wp-content/uploads/2022/12/dynamic-wokflow-01.webp",
      label: "Dynamic Workflow",
      delay: "delay-500", // Appears after the second icon
    },
  ];

  // Fallback image URL for broken links
  const fallbackImageUrl = "https://placehold.co/250x250/E5E7EB/333333?text=Image+Error";

  // === 4. HELPER FUNCTION FOR TRANSITIONS ===
  // This function returns the correct Tailwind classes (hidden/visible) based on the current animation step.
  // The 'step' parameter is now explicitly typed as 'number' to fix the TypeScript warning.
  const getTransitionClasses = (step: number) => {
    const isVisible = animationStep >= step;
    return `
      transition-all duration-500 ease-out 
      // If visible, set opacity to 100 and position to 0 (default)
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `;
  };


  // === 5. COMPONENT RENDER (JSX) ===
  return (
    // Outer Container: Sets background color, padding, and centers the content
    <div className="w-full bg-gray-100 py-28 sm:py-36 rounded-lg shadow-inner flex justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center"> 
          
          <div className="flex justify-center w-full">
            
            {/* === THE SINGLE BIG CARD WRAPPER (Animated by Step 1) === */}
            <div className={`
                p-8 md:p-12 
                bg-white 
                shadow-3xl shadow-blue-500/20 
                rounded-[2rem] 
                border border-blue-100 
                w-full max-w-7xl 
                flex flex-col items-center text-center 
                transition duration-700 
                hover:shadow-blue-500/40 hover:scale-[1.01]
                ${getTransitionClasses(1)} // Applies animation based on step 1
            `}> 

              {/* 1. Title Container Group (Animated by Step 2) */}
              <div className={`flex flex-col space-y-4 mb-6 ${getTransitionClasses(2)}`}>
                <div className="w-full">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    <span id="Powered_by_Smart_Flow_Technology">
                      <span className="text-blue-700"> Powered by</span> Smart Flow Technology
                    </span>
                  </h2>
                </div>
              </div>

              {/* 2. Description Container Group (Animated by Step 2) */}
              <div className={`flex flex-col mb-8 max-w-3xl ${getTransitionClasses(2)}`}> 
                <div className="w-full">
                  <p className="mt-2 text-base text-gray-700 leading-relaxed">
                    It gives you precise control over data visibility and flexible policy implementation in your organization with dynamic permission cycles to support any hierarchical&nbsp;structure.
                  </p>
                </div>
              </div>
              
              {/* 3. Image layout container: Horizontal alignment for the three features. */}
              <div className="flex flex-row flex-wrap items-start justify-around gap-6 w-full pt-8 mt-8">
                
                {/* Loop through the feature data to render each icon and its label */}
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`
                      flex flex-col items-center p-4 text-center 
                      w-full max-w-[30%] min-w-[150px] 
                      transition duration-500 ease-out 
                      // This is the staggered animation: checks step 3 AND applies the specific delay class
                      ${animationStep >= 3 ? `opacity-100 translate-y-0 ${feature.delay}` : 'opacity-0 translate-y-8'}
                      hover:scale-[1.03]
                    `}
                  > 
                    {/* Feature Image */}
                    <div className="elementor-widget-container flex justify-center">
                      {/* NOTE on Next.js Linting: We use the standard <img> tag here for simplicity and 
                        to keep this file self-contained. For optimal performance in a production Next.js 
                        project, you should replace this with <Image src="..." alt="..." /> from 'next/image'. 
                      */}
                      <img 
                        loading="lazy" 
                        decoding="async" 
                        width="250" 
                        height="250" 
                        src={feature.url} 
                        className="w-full max-w-[150px] h-auto object-contain rounded-full border-4 border-blue-600 hover:border-blue-800 transition duration-300"
                        alt={`Feature icon ${index + 1}`} 
                        // Error handling: Fixes TypeScript error by casting target to HTMLImageElement.
                      />
                    </div>
                    {/* Feature Label */}
                    <p className="mt-4 text-sm font-bold text-gray-900">{feature.label}</p>
                  </div>
                ))}
              </div>
            </div> {/* End Single Big Card Wrapper */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Technology;
