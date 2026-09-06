import React from "react";
import { X, MapPin, Calendar, Info, Star, ExternalLink } from "lucide-react";
import { Photo } from "../types/photo.types";

interface PhotoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo | null;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  isOpen,
  onClose,
  photo,
}) => {
  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/95 backdrop-blur-md animate-in fade-in">
      {/* Close button top right */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-surface-raised/80 border border-surface-border text-secondary hover:text-primary transition-colors z-20"
        title="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-6xl max-h-[90vh] grid grid-cols-1 lg:grid-cols-12 bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Left: High-Res Image Area */}
        <div className="lg:col-span-8 bg-black flex items-center justify-center p-4 overflow-hidden relative min-h-[350px] lg:min-h-[600px]">
          <img
            src={photo.image_url}
            alt={photo.alt_text}
            className="max-h-[85vh] w-auto max-w-full object-contain rounded"
          />

          {photo.is_featured && (
            <div className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent text-background text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-current" />
              <span>Featured Artwork</span>
            </div>
          )}
        </div>

        {/* Right: Metadata & Specs Sidebar */}
        <div className="lg:col-span-4 p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] space-y-6">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent">
                {photo.category_name || "Uncategorized"}
              </span>
              <h2 className="font-serif text-2xl font-light text-primary tracking-tight">
                {photo.title}
              </h2>
            </div>

            {photo.description && (
              <p className="text-xs text-secondary leading-relaxed">
                {photo.description}
              </p>
            )}

            <div className="p-4 bg-surface-raised rounded-xl border border-surface-border space-y-3">
              <div className="flex items-center space-x-2 text-xs text-primary font-medium">
                <Info className="w-3.5 h-3.5 text-accent" />
                <span>Artwork Specifications</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] text-secondary">
                <div>
                  <span className="text-secondary/60">Dimensions:</span>
                  <p className="text-primary font-medium">{photo.width && photo.height ? `${photo.width} × ${photo.height}` : "Original"}</p>
                </div>
                <div>
                  <span className="text-secondary/60">File Size:</span>
                  <p className="text-primary font-medium">{photo.file_size ? `${(photo.file_size / 1024 / 1024).toFixed(2)} MB` : "Web Media"}</p>
                </div>
                <div>
                  <span className="text-secondary/60">Status:</span>
                  <p className="text-success font-medium">{photo.is_published ? "Published Live" : "Draft"}</p>
                </div>
                <div>
                  <span className="text-secondary/60">Format:</span>
                  <p className="text-primary font-medium uppercase">{photo.mime_type?.split("/")[1] || "JPEG"}</p>
                </div>
              </div>
            </div>

            {/* Context & Location */}
            <div className="space-y-2 text-xs text-secondary">
              {photo.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>{photo.location}</span>
                </div>
              )}
              {photo.photo_date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>Captured: {new Date(photo.photo_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Alt Text Information */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-secondary/60 font-semibold">
                Accessibility Alt Text
              </span>
              <p className="text-[11px] text-secondary italic bg-surface-raised/50 p-2 rounded border border-surface-border/50">
                "{photo.alt_text}"
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border flex items-center justify-between">
            <a
              href={photo.image_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-accent hover:text-accent-hover transition-colors font-medium"
            >
              <span>Open Raw Image Asset</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-surface-raised border border-surface-border rounded text-xs text-secondary hover:text-primary transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
