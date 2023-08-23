import React, { useEffect, useRef } from 'react';

interface ParallaxProps {
    speed: number;
    swaySpeed: number;
    swayLimit: number;
    children: any;
}

const Parallax: React.FC<ParallaxProps> = ({ speed, swaySpeed, swayLimit, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        let translateX = window.pageYOffset * swaySpeed;
        if(translateX > swayLimit) {
          translateX = swayLimit + (translateX - swayLimit) * -1
        }
        ref.current.style.transform = `translateY(${window.pageYOffset * speed}px) translateX(${translateX}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, swaySpeed, swayLimit]);

  return (
    <div className="relative">
        <div ref={ref} className="absolute w-full h-full top-0 left-0">
            {children}
        </div>
    </div>
  );
};

export default Parallax;
