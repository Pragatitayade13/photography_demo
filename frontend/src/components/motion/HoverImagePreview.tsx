import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HoverImagePreviewProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
  className?: string;
  previewWidth?: number;
  previewHeight?: number;
}

export const HoverImagePreview: React.FC<HoverImagePreviewProps> = ({
  imageSrc,
  imageAlt,
  children,
  className = "",
  previewWidth = 240,
  previewHeight = 320,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left + 20,
      y: e.clientY - rect.top - previewHeight / 2,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative ${className}`}
    >
      {children}
      <AnimatePresence>
        {isHovered && imageSrc && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: pos.x,
              y: pos.y,
            }}
            exit={{ opacity: 0, scale: 0.85, rotate: -3 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: previewWidth,
              height: previewHeight,
              pointerEvents: "none",
              zIndex: 50,
            }}
            className="hidden md:block overflow-hidden rounded-lg shadow-2xl shadow-black/80 border border-white/20 bg-[#121110]"
          >
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
