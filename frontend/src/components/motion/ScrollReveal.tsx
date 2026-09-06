import React from "react";
import { motion, Variants } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "mask" | "fade-up" | "fade-in" | "scale-up" | "fade-left" | "fade-right";
  delay?: number;
  duration?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  className = "",
  viewportMargin = "0px",
  once = true,
}) => {
  const luxuryEase = [0.16, 1, 0.3, 1]; // Premium cubic-bezier

  const variants: Record<string, Variants> = {
    mask: {
      hidden: {
        opacity: 0,
        y: 24,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: luxuryEase,
        },
      },
    },
    "fade-up": {
      hidden: {
        opacity: 0,
        y: 28,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: luxuryEase,
        },
      },
    },
    "fade-in": {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: luxuryEase,
        },
      },
    },
    "scale-up": {
      hidden: {
        opacity: 0,
        scale: 0.96,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: luxuryEase,
        },
      },
    },
    "fade-left": {
      hidden: {
        opacity: 0,
        x: -28,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: luxuryEase,
        },
      },
    },
    "fade-right": {
      hidden: {
        opacity: 0,
        x: 28,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: luxuryEase,
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin, amount: 0.05 }}
      variants={variants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
};
