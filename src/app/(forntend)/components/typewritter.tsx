"use client";

import { TypeAnimation } from "react-type-animation";

const Typewriter = () => {
  return (
    <TypeAnimation
      className="m-3 non-blinking-cursor font-bold ml-1"
      sequence={[
        "Empowering Businesses Smartly",
        1000,  
        "",    
        100,   
      ]}
      wrapper="span"
      speed={85}          
      deletionSpeed={85}  
      style={{ fontSize: "32px", display: "inline-block" }}
      repeat={Infinity}   
    />
  );
};

export default Typewriter;
