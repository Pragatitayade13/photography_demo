import React, { useState, useRef, useEffect, useCallback } from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { ProjectComparison } from "../../projects/types/project.types";

interface BeforeAfterSliderProps {
  comparison: ProjectComparison;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ comparison }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const newPos = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
      setSliderPos(newPos);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging, handleMove]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="space-y-4">
      {/* Title and Description */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-accent text-xs uppercase tracking-widest font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Color Grading & Retouching Study</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-primary font-light">
            {comparison.title}
          </h3>
        </div>

        {/* Preset Percentage Buttons */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-surface-raised/80 border border-surface-border p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setSliderPos(100)}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium ${
              sliderPos === 100
                ? "bg-accent text-black font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            {comparison.before_label || "Before"}
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium ${
              sliderPos === 50
                ? "bg-accent text-black font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            50% Split
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(0)}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium ${
              sliderPos === 0
                ? "bg-accent text-black font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            {comparison.after_label || "After"}
          </button>
        </div>
      </div>

      {comparison.description && (
        <p className="text-xs text-secondary leading-relaxed max-w-3xl">
          {comparison.description}
        </p>
      )}

      {/* Comparison Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPos)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after image comparison slider"
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {/* Layer 1: AFTER image (base background) */}
        <img
          src={comparison.after_image_url}
          alt={comparison.after_label || "After Master"}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="lazy"
        />

        {/* After Label */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] uppercase tracking-wider font-semibold">
          {comparison.after_label || "After"}
        </div>

        {/* Layer 2: BEFORE image (clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={comparison.before_image_url}
            alt={comparison.before_label || "Before Capture"}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%" }}
            loading="lazy"
          />

          {/* Before Label */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-accent text-[11px] uppercase tracking-wider font-semibold">
            {comparison.before_label || "Before"}
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center -ml-[1px]"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical line */}
          <div className="w-0.5 h-full bg-accent shadow-[0_0_10px_rgba(212,175,55,0.8)]" />

          {/* Center Drag Grip */}
          <div className="absolute w-10 h-10 rounded-full bg-surface border-2 border-accent text-accent shadow-xl flex items-center justify-center transform transition-transform hover:scale-110">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
