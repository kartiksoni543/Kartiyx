"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, textarea, .glass-panel")) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleHoverStart);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleHoverStart);
    };
  }, []);

  return (
    <>
      {/* Main Glowing Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#00E5FF] mix-blend-difference"
        animate={{
          x: mousePosition.x - (isHovered ? 20 : 6),
          y: mousePosition.y - (isHovered ? 20 : 6),
          width: isHovered ? 40 : 12,
          height: isHovered ? 40 : 12,
          opacity: isHovered ? 0.8 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      {/* Outer Cyan Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-[#00E5FF]/40 shadow-[0_0_15px_#00E5FF]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          width: 48,
          height: 48,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      />
    </>
  );
}
