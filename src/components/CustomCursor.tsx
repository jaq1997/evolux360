import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useSpring(0, { damping: 20, stiffness: 250 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 250 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white pointer-events-none z-[9999] hidden md:block mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
    />
  );
};
