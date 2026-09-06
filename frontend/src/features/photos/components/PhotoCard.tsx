import React from "react";
import { Star, Eye, Edit2, Trash2, MapPin } from "lucide-react";
import { Photo } from "../types/photo.types";

interface PhotoCardProps {
  photo: Photo;
  onPreview: (photo: Photo) => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
  onToggleStatus: (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ) => Promise<void>;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onPreview,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="group relative bg-surface border border-surface-border rounded-xl overflow-hidden shadow-sm hover:border-accent/40 transition-all flex flex-col">
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[4/5] bg-surface-raised overflow-hidden cursor-pointer" onClick={() => onPreview(photo)}>
        <img
          src={photo.thumbnail_url || photo.image_url}
          alt={photo.alt_text}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 z-10 pointer-events-none group-hover:pointer-events-auto">
          {/* Top Quick Badges / Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(photo.id, { is_featured: !photo.is_featured });
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-transform hover:scale-110 ${
                photo.is_featured
                  ? "bg-accent text-background shadow-lg shadow-accent/20"
                  : "bg-surface/80 text-secondary hover:text-accent border border-surface-border"
              }`}
              title={photo.is_featured ? "Featured Photo" : "Mark as Featured"}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(photo.id, { is_published: !photo.is_published });
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${
                photo.is_published
                  ? "bg-success/20 text-success border-success/30"
                  : "bg-surface/80 text-secondary border-surface-border"
              }`}
            >
              {photo.is_published ? "Published" : "Draft"}
            </button>
          </div>

          {/* Bottom Hover Action Buttons */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(photo);
              }}
              className="p-2.5 bg-surface border border-surface-border rounded-lg text-secondary hover:text-accent hover:border-accent transition-colors"
              title="Preview High-Res"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(photo);
              }}
              className="p-2.5 bg-surface border border-surface-border rounded-lg text-secondary hover:text-accent hover:border-accent transition-colors"
              title="Edit Metadata"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo);
              }}
              className="p-2.5 bg-surface border border-surface-border rounded-lg text-secondary hover:text-danger hover:border-danger transition-colors"
              title="Delete Photograph"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Persistent Corner Badges */}
        {photo.is_featured && (
          <div className="absolute top-3 left-3 z-0 group-hover:opacity-0 transition-opacity">
            <span className="p-1.5 rounded-full bg-accent/90 text-background inline-flex shadow">
              <Star className="w-3 h-3 fill-current" />
            </span>
          </div>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider">
            <span className="text-accent truncate">
              {photo.category_name || "Uncategorized"}
            </span>
            {photo.location && (
              <span className="text-secondary/70 flex items-center space-x-0.5 truncate ml-2">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{photo.location}</span>
              </span>
            )}
          </div>
          <h4 className="font-serif text-sm text-primary font-medium truncate mt-1">
            {photo.title}
          </h4>
        </div>

        <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between text-[11px] text-secondary">
          <span className="inline-flex items-center space-x-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                photo.is_published ? "bg-success" : "bg-secondary/40"
              }`}
            />
            <span>{photo.is_published ? "Live Online" : "Draft"}</span>
          </span>
          <span className="text-[10px] text-secondary/60">
            {photo.width && photo.height ? `${photo.width}×${photo.height}` : "HD"}
          </span>
        </div>
      </div>
    </div>
  );
};
