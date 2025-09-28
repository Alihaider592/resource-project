import React, { useState, useEffect } from 'react';


const Technology = () => {
  
  const [animationStep, setAnimationStep] = useState(0);

  
  useEffect(() => {
  
    const cardTimer = setTimeout(() => {
      setAnimationStep(1);
    }, 100);

  
    const textTimer = setTimeout(() => {
      setAnimationStep(2);
    }, 600); 

  
    const featuresTimer = setTimeout(() => {
      setAnimationStep(3);
    }, 1200); 

  
    return () => {
      clearTimeout(cardTimer);
      clearTimeout(textTimer);
      clearTimeout(featuresTimer);
    };
  }, []); 

  
  const features = [
    {
      url: "https://resourceinn.com/wp-content/uploads/2022/12/granular-control-01.webp",
      label: "Granular Control",
      delay: "delay-100", 
    },
    {
      url: "https://resourceinn.com/wp-content/uploads/2022/12/no-code-01.webp",
      label: "No-Code Policy",
      delay: "delay-300",     },
    {
      url: "https://resourceinn.com/wp-content/uploads/2022/12/dynamic-wokflow-01.webp",
      label: "Dynamic Workflow",
      delay: "delay-500",     },
  ];

  
  const fallbackImageUrl = "https://placehold.co/250x250/E5E7EB/333333?text=Image+Error";

  
  const getTransitionClasses = (step: number) => {
    const isVisible = animationStep >= step;
    return `
      transition-all duration-500 ease-out 
      // If visible, set opacity to 100 and position to 0 (default)
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `;
  };


  
  return (
  
    <div className="w-full bg-gray-100 py-28 sm:py-36 rounded-lg shadow-inner flex justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center"> 
          
          <div className="flex justify-center w-full">
            
  
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

           
              <div className={`flex flex-col space-y-4 mb-6 ${getTransitionClasses(2)}`}>
                <div className="w-full">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    <span id="Powered_by_Smart_Flow_Technology">
                      <span className="text-blue-700"> Powered by</span> Smart Flow Technology
                    </span>
                  </h2>
                </div>
              </div>

           
              <div className={`flex flex-col mb-8 max-w-3xl ${getTransitionClasses(2)}`}> 
                <div className="w-full">
                  <p className="mt-2 text-base text-gray-700 leading-relaxed">
                    It gives you precise control over data visibility and flexible policy implementation in your organization with dynamic permission cycles to support any hierarchical&nbsp;structure.
                  </p>
                </div>
              </div>
              
            
              <div className="flex flex-row flex-wrap items-start justify-around gap-6 w-full pt-8 mt-8">
                
            
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
            
                    <div className="elementor-widget-container flex justify-center">
            
                      <img 
                        loading="lazy" 
                        decoding="async" 
                        width="250" 
                        height="250" 
                        src={feature.url} 
                        className="w-full max-w-[150px] h-auto object-contain rounded-full border-4 border-blue-600 hover:border-blue-800 transition duration-300"
                        alt={`Feature icon ${index + 1}`} 
                       
                      />
                    </div>
                    
                    <p className="mt-4 text-sm font-bold text-gray-900">{feature.label}</p>
                  </div>
                ))}
              </div>
            </div> 
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Technology;
