"use client";

import { TypeAnimation } from "react-type-animation";

const Typewriter = () => {
  return (
    <TypeAnimation
      className="text-typing"
      sequence={[
        "Empowering Businesses Smartly", 
        2000,                            
        "",                              
        500,                           
      ]}
      wrapper="span"
      speed={80} 
      style={{ fontSize: "40px", display: "inline-block" }}
      repeat={Infinity} 
    />
  );
};

export default Typewriter;
