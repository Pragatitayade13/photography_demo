import React from "react";
import { motion } from "framer-motion";

interface TextSplitRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "lines" | "words";
  delay?: number;
  staggerDelay?: number;
}

export const TextSplitReveal: React.FC<TextSplitRevealProps> = ({
  text,
  className = "",
  as: Component = "h2",
  splitBy = "words",
  delay = 0.05,
  staggerDelay = 0.04,
}) => {
  const luxuryEase = [0.16, 1, 0.3, 1];

  if (!text) return null;

  const items = splitBy === "lines" ? text.split("\n") : text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.65,
        ease: luxuryEase,
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        className="inline-block w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={containerVariants}
      >
        {items.map((segment, idx) => (
          <span key={idx} className="inline-block align-top leading-tight mr-[0.25em]">
            <motion.span className="inline-block" variants={itemVariants}>
              {segment}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
};
