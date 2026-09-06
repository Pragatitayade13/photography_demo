import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
  direction?: "vertical" | "horizontal";
}

export const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({
  children,
  offset = 50,
  className = "",
  direction = "vertical",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const x = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={direction === "vertical" ? { y } : { x }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
