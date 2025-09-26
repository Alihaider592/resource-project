import React from "react";

const Button = ({
  text = "Click Me",
  textColor = "text-white",
  bgColor = "bg-blue-500",
  width = "w-28",
  height = "h-10",
  className = "",
  //   onClick
}) => {
  return (
    <button
      //   onClick={onClick}
      className={`font-bold  rounded-full p-2 ${textColor} ${bgColor} ${width} ${height} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
