import React, { useEffect, useCallback, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Share2, Check, MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "../../photos/types/photo.types";

interface PublicLightboxProps {
  isOpen: boolean;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PublicLightbox: React.FC<PublicLightboxProps> = ({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentPhoto = photos[currentIndex];

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch Swipe Gesture Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // pixels

    if (diff > minSwipeDistance) {
      // Swiped Left -> Next
      handleNext();
    } else if (diff < -minSwipeDistance) {
      // Swiped Right -> Prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709]/98 backdrop-blur-2xl select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Controls Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-20 bg-gradient-to-b from-[#070709]/90 to-transparent"
          >
            <div className="flex items-center space-x-3 text-xs">
              <span className="font-mono text-accent font-semibold text-sm">
                {String(currentIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </span>
              <span className="text-secondary/60">•</span>
              <span className="text-secondary uppercase tracking-widest text-[10px] font-semibold">
                {currentPhoto.category_name || "Visual Gallery"}
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2.5 rounded-full bg-surface-raised/80 border border-surface-border text-secondary hover:text-primary transition-colors hidden sm:flex items-center justify-center"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4 text-accent" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-surface-raised/80 border border-surface-border text-secondary hover:text-primary transition-colors flex items-center space-x-1.5 text-xs"
                title="Copy Page Link"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-medium">
                  {copied ? "Link Copied" : "Share"}
                </span>
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-surface-raised/80 border border-surface-border text-secondary hover:text-primary transition-colors"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Main Image View */}
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 lg:p-20 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto.id || currentIndex}
                initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                animate={{
                  opacity: 1,
                  scale: isZoomed ? 1.35 : 1,
                  filter: "blur(0px)",
                }}
                exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setIsZoomed(!isZoomed)}
                data-cursor={isZoomed ? "ZOOM OUT" : "ZOOM IN"}
                className="cursor-zoom-in max-h-[82vh] max-w-[92vw] flex items-center justify-center"
              >
                <img
                  src={currentPhoto.image_url}
                  alt={currentPhoto.alt_text}
                  className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain rounded-sm shadow-2xl transition-all duration-300"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-surface/80 border border-surface-border text-primary hover:text-accent hover:border-accent backdrop-blur-md transition-transform hover:scale-110 shadow-xl"
                  title="Previous Photograph (←)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-surface/80 border border-surface-border text-primary hover:text-accent hover:border-accent backdrop-blur-md transition-transform hover:scale-110 shadow-xl"
                  title="Next Photograph (→)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Caption Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-center sm:text-left z-20"
          >
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-light text-primary tracking-tight">
                {currentPhoto.title}
              </h3>
              {currentPhoto.location && (
                <p className="text-xs text-secondary/80 flex items-center justify-center sm:justify-start space-x-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-accent" />
                  <span>{currentPhoto.location}</span>
                </p>
              )}
            </div>

            {currentPhoto.description && (
              <p className="text-xs text-secondary max-w-md line-clamp-2 italic font-light">
                "{currentPhoto.description}"
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
