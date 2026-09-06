import React, { useState } from "react";
import { ImageOff, RotateCcw } from "lucide-react";

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  srcSet?: Array<{ width: number; url: string }> | string;
  sizes?: string;
  aspectRatio?: number | string; // e.g. 1.5 (3/2) or "16/9"
  className?: string;
  imageClassName?: string;
  priority?: boolean; // If true, loading="eager" & fetchPriority="high"
  objectFit?: "cover" | "contain" | "scale-down" | "none";
  blurPlaceholder?: string;
  onClick?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  srcSet,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  aspectRatio,
  className = "",
  imageClassName = "",
  priority = false,
  objectFit = "cover",
  blurPlaceholder,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Compute formatted srcSet string
  const formattedSrcSet = Array.isArray(srcSet)
    ? srcSet.map((item) => `${item.url} ${item.width}w`).join(", ")
    : srcSet;

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsLoaded(false);
    setRetryKey((prev) => prev + 1);
  };

  const aspectStyle = typeof aspectRatio === "number"
    ? { aspectRatio: `${aspectRatio}` }
    : typeof aspectRatio === "string"
    ? { aspectRatio }
    : undefined;

  return (
    <div
      style={aspectStyle}
      onClick={onClick}
      className={`relative overflow-hidden bg-[#121217] select-none ${className}`}
    >
      {/* Shimmer Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-surface-raised via-white/[0.04] to-surface-raised animate-pulse" />
      )}

      {/* Optional blur data preview */}
      {blurPlaceholder && !isLoaded && !hasError && (
        <img
          src={blurPlaceholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 opacity-60"
        />
      )}

      {/* Error Fallback UI */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-surface-raised/80 border border-white/5 space-y-2">
          <ImageOff className="w-6 h-6 text-secondary/50" />
          <p className="text-[11px] text-secondary font-sans">Unable to load image</p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-accent tracking-wider uppercase font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <img
          key={retryKey}
          src={src}
          srcSet={formattedSrcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full transition-all duration-700 ${
            objectFit === "contain"
              ? "object-contain"
              : objectFit === "scale-down"
              ? "object-scale-down"
              : "object-cover"
          } ${
            isLoaded ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-105 filter blur-sm"
          } ${imageClassName}`}
        />
      )}
    </div>
  );
};
