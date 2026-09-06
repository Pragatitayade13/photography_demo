import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Share2,
  RotateCcw,
} from "lucide-react";
import { Photo } from "../../photos/types/photo.types";

interface FullscreenGalleryViewerProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onShare?: (photo: Photo) => void;
}

export const FullscreenGalleryViewer: React.FC<FullscreenGalleryViewerProps> = ({
  photos,
  initialIndex,
  isOpen,
  onClose,
  onShare,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.5, 2
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Top Controls Bar */}
      <div className="h-16 px-6 sm:px-8 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        {/* Counter and Title */}
        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold tracking-wider text-accent bg-white/10 px-3 py-1 rounded-full border border-white/10">
            {currentIndex + 1} / {photos.length}
          </span>
          <h4 className="text-sm font-medium text-white truncate max-w-xs sm:max-w-md hidden sm:block">
            {currentPhoto?.title || "Monograph Photograph"}
          </h4>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-white/10 rounded-full p-1 border border-white/10">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 text-secondary hover:text-white disabled:opacity-30 rounded-full transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-semibold text-white px-1.5 min-w-[36px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.5}
              className="p-1.5 text-secondary hover:text-white disabled:opacity-30 rounded-full transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-accent hover:text-white rounded-full transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleBrowserFullscreen}
            className="p-2 text-secondary hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10 hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Share trigger */}
          {onShare && (
            <button
              onClick={() => onShare(currentPhoto)}
              className="p-2 text-secondary hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10"
              title="Share Photograph"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-white bg-white/10 hover:bg-danger/80 rounded-full transition-colors border border-white/10"
            title="Close Gallery (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Image Canvas */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 relative flex items-center justify-center overflow-hidden p-4 sm:p-8"
      >
        {/* Navigation Arrow: Prev */}
        {photos.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-accent border border-white/10 backdrop-blur-md transition-all transform hover:scale-110"
            title="Previous Frame (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Display Image */}
        <div
          className="relative max-w-full max-h-full transition-transform duration-200 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={currentPhoto?.image_url}
            alt={currentPhoto?.alt_text || currentPhoto?.title || "Gallery frame"}
            className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl pointer-events-none"
          />
        </div>

        {/* Navigation Arrow: Next */}
        {photos.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white hover:text-accent border border-white/10 backdrop-blur-md transition-all transform hover:scale-110"
            title="Next Frame (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Caption */}
      <div className="z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 space-y-3">
        {currentPhoto?.description && (
          <p className="text-xs text-center text-secondary/90 max-w-2xl mx-auto line-clamp-2">
            {currentPhoto.description}
          </p>
        )}

        {/* Filmstrip */}
        {photos.length > 1 && (
          <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2 max-w-3xl mx-auto scrollbar-thin">
            {photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setZoomLevel(1);
                  setCurrentIndex(idx);
                }}
                className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                  currentIndex === idx
                    ? "border-accent scale-105 shadow-lg shadow-accent/20"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={p.thumbnail_url || p.image_url}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
