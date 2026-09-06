import React from "react";
import { motion } from "framer-motion";

interface FloatingPolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  initialRotate?: number;
  floatDistance?: number;
  duration?: number;
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
  dataCursor?: string;
}

export const FloatingPolaroid: React.FC<FloatingPolaroidProps> = ({
  src,
  alt,
  caption,
  initialRotate = -2,
  floatDistance = 6,
  duration = 7,
  className = "",
  imageClassName = "w-48 h-60 sm:w-56 sm:h-72",
  onClick,
  dataCursor = "VIEW",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative inline-block ${className}`}
    >
      <motion.div
        animate={{
          y: [-floatDistance, floatDistance, -floatDistance],
          rotate: [initialRotate - 0.75, initialRotate + 0.75, initialRotate - 0.75],
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration,
            ease: "easeInOut",
          },
          rotate: {
            repeat: Infinity,
            duration: duration * 1.25,
            ease: "easeInOut",
          },
        }}
        whileHover={{
          scale: 1.06,
          rotate: 0,
          zIndex: 40,
          y: -8,
          transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        }}
        onClick={onClick}
        data-cursor={dataCursor}
        className="relative bg-[#F7F2EA] p-3 pb-6 rounded-sm shadow-2xl shadow-black/60 border border-white/20 cursor-pointer transition-shadow hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
      >
        <div className={`overflow-hidden bg-[#1a1714] ${imageClassName}`}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>
        {caption && (
          <div className="mt-2 text-center">
            <p className="text-[10px] font-mono tracking-widest text-[#4A4038] uppercase truncate">
              {caption}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
