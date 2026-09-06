import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string>("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "text" | "hidden">("default");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor followers
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch device or reduced motion
    const checkFinePointer = window.matchMedia("(pointer: fine)").matches;
    const checkReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!checkFinePointer || checkReducedMotion) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleElementOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "VIEW";
        setCursorText(text);
        setCursorVariant("text");
        return;
      }

      const interactive = target.closest("button, a, input, select, textarea, [role='button']");
      if (interactive) {
        setCursorText("");
        setCursorVariant("hover");
        return;
      }

      setCursorText("");
      setCursorVariant("default");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleElementOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleElementOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Outer Luxury Ring / Badge */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: cursorVariant === "text" ? 80 : cursorVariant === "hover" ? 44 : 26,
          height: cursorVariant === "text" ? 80 : cursorVariant === "hover" ? 44 : 26,
          backgroundColor:
            cursorVariant === "text"
              ? "rgba(182, 151, 99, 0.88)"
              : cursorVariant === "hover"
              ? "rgba(212, 175, 55, 0.12)"
              : "rgba(255, 255, 255, 0.04)",
          borderColor:
            cursorVariant === "text"
              ? "rgba(255, 255, 255, 0.4)"
              : cursorVariant === "hover"
              ? "rgba(212, 175, 55, 0.7)"
              : "rgba(255, 255, 255, 0.25)",
          borderWidth: cursorVariant === "text" ? 0 : 1,
          backdropFilter: cursorVariant === "text" ? "blur(8px)" : "none",
        }}
        transition={{
          type: "spring",
          damping: 24,
          stiffness: 300,
          mass: 0.6,
        }}
      >
        {cursorVariant === "text" && cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-[#141210] select-none"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Tiny precise center dot */}
      {cursorVariant !== "text" && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_6px_rgba(212,175,55,0.8)]"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: cursorVariant === "hover" ? 0 : 1,
            opacity: cursorVariant === "hover" ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      )}
    </>
  );
};
