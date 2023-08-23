import React, { useEffect, useState } from "react";

const FlashingHeader = () => {
  const [selectedHeader, setSelectedHeader] = useState(0);
  const [animateOut, setAnimateOut] = useState(false);

  const headerOptions = [
    {
      name: "Fast",
      style:
        "text-transparent bg-clip-text bg-gradient-to-r from-red-600 from-40% via-orange-500 via-80% to-orange-300",
    },
    {
      name: "Great",
      style:
        "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 from-40% via-orange-300 via-80% to-orange-200",
    },
    {
        name: "Simple",
        style: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 from-40% via-yellow-300 via-80% to-yellow-50",
    },
    {
        name: "Fun",
        style: "text-transparent bg-clip-text bg-gradient-to-r from-green-500 from-40% via-lime-400 via-80% to-green-200",
    },
    {
        name: "Smart",
        style: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 from-40% via-cyan-400 via-80% to-cyan-200",
    },

    
  ];

  useEffect(() => {
    if (animateOut) {
      const timer = setTimeout(() => {
        setSelectedHeader((selectedHeader + 1) % headerOptions.length);
        setAnimateOut(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setAnimateOut(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animateOut, selectedHeader]);

  return (
    <div className="text-5xl 2xl:text-9xl md:text-8xl pt-8 text-center text-white font-bold mb-12 mt-8">
      Really
      {headerOptions.map((headerOption, index) => (
        <span
          key={index}
          className={`inline-block -mb-1.5 md:-mb-2.5 transition-all duration-1000 overflow-hidden ${
            selectedHeader === index
              ? animateOut
                ? "opacity-0 max-w-0"
                : "opacity-100 max-w-full"
              : "opacity-0 max-w-0"
          }`}
        >
          <span className={headerOption.style}>{headerOption.name}</span>
        </span>
      ))}
      Mail
    </div>
  );
};

export default FlashingHeader;
