import React, { useState, useEffect } from 'react';


const features = [
  {
    title: "Maximize your workforce efficiency",
    url: "https://resourceinn.com/wp-content/uploads/2022/11/work-force.webp",

    delay: "delay-300", 
  },
  {
    title: "Analyze data and construct strategic decisions",
    url: "https://resourceinn.com/wp-content/uploads/2022/11/data-analyze.webp",

    delay: "delay-500",
  },
  {
    title: "Increase Employee Engagement",
    url: "https://resourceinn.com/wp-content/uploads/2022/11/fight-anomalies.webp",

    delay: "delay-700",
  },
];


const fallbackImageUrl = "https://placehold.co/250x250/E5E7EB/333333?text=Image+Error";


const SmartFlowFeature = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100); 

    return () => clearTimeout(timer);
  }, []); 
  
  
  const baseTransitionClasses = 'transition-all duration-700 ease-out transform';
  
  const animationStateClasses = isAnimated 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8';


  
  const FeatureCard = ({ title, url, delay }: { title: string, url: string, delay: string }) => {
    return (
      <div 
        className={`
          flex items-center space-x-4 p-4 rounded-xl bg-white shadow-md border border-gray-100 
          ${baseTransitionClasses} 
          ${delay} 
          ${animationStateClasses}
          hover:shadow-lg hover:scale-[1.02]
          w-full 
        `}
      >
  
        <div className="flex-shrink-0 w-1/4 max-w-[50px] sm:max-w-[70px]">
          <img 
            loading="lazy" 
            decoding="async" 
            width="150" 
            height="150" 
            src={url} 
            className="w-full h-auto object-contain"
            alt={`Feature icon for ${title}`} 
            onError={(e) => { 
  
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = fallbackImageUrl;
            }}
          />
        </div>
        
        <div className="w-3/4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-snug">{title}</h3>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-100 py-28 sm:py-36 flex justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          
          <div className="col-span-1 space-y-8">
            
            <div className={`${baseTransitionClasses} ${animationStateClasses} delay-100`}>
              <h2 className="text-xs  font-semibold tracking-tight text-gray-900 sm:text-4xl mb-4">
                <span id="Bringing_HR_Business_Goals_Together_to_Drive_an_Impact">
                  Bringing <span className="text-purple-700">HR &amp; Business</span> Goals Together to <span className="text-purple-700">Drive an Impact</span>
                </span>
              </h2>
            </div>
            
  
            <div className="space-y-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index} 
                  title={feature.title} 
                  url={feature.url} 
                  delay={feature.delay} 
                />
              ))}
            </div>
            
          </div>
          
          <div className={`lg:col-span-2 flex space-y-6 lg:space-y-8 p-6 lg:p-12 rounded-[2rem] bg-white shadow-3xl shadow-blue-500/20 border border-blue-100 
            ${baseTransitionClasses} ${animationStateClasses} delay-[1000ms]`}> 
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                More Power to You
              </h2>
              <h3 className="text-xl font-semibold text-gray-600">
                Achieve the great with resourceinn
              </h3>
              <p className="text-base text-gray-700 leading-relaxed max-w-xl">
                We believe in hearing the voice of the business community. It is the reflection of your experiences and answers to your HR &amp; Payroll related problems to help you scale at full potential.
              </p>
            </div>

            

            <div className={`hidden lg:block w-full text-right ${baseTransitionClasses} ${animationStateClasses} delay-[1300ms]`}>
                <img 
                    loading="lazy" 
                    decoding="async" 
                    width="669" 
                    height="967" 
                    src="https://resourceinn.com/wp-content/uploads/2022/11/Asset-1.webp" 
                    className="w-full max-w-[200px] h-auto object-contain mx-auto lg:mr-0 rounded-xl"
                    alt="Happy businesswoman celebrating business growth with Resourceinn HR software." 
                    onError={(e) => { 
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; 
                      target.src = fallbackImageUrl;
                    }}
                />
                <div className={`pt-4 relative right-[30rem] ${baseTransitionClasses} ${animationStateClasses} delay-[1200ms]`}>
              <a 
                href="#demo-form-footer" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 13l-7 7m0 0l-7-7m7 7V3"></path></svg>
                Book a Demo
              </a>
            </div>
            </div>

          </div>
          
          
        </div>
        
      </div>
      
    </div>
  );
};

export default SmartFlowFeature;
