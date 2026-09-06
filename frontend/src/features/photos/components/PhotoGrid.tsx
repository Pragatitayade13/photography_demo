import React from "react";
import { Photo } from "../types/photo.types";
import { PhotoCard } from "./PhotoCard";
import { Image, Star, Edit2, Trash2, Eye } from "lucide-react";

interface PhotoGridProps {
  photos: Photo[];
  isLoading: boolean;
  viewMode: "grid" | "table";
  onPreview: (photo: Photo) => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
  onToggleStatus: (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ) => Promise<void>;
  onOpenUpload: () => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  isLoading,
  viewMode,
  onPreview,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenUpload,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="aspect-[4/5] bg-surface rounded-xl border border-surface-border"
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="p-16 bg-surface border border-surface-border rounded-xl text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-surface-raised border border-surface-border text-accent">
          <Image className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-medium text-primary">
          No Photographs Found
        </h3>
        <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
          No photographs match your current filter criteria. Upload your high-resolution captures or clear existing filters.
        </p>
        <button
          onClick={onOpenUpload}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors"
        >
          <span>Upload First Photo</span>
        </button>
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised border-b border-surface-border text-[10px] uppercase tracking-widest text-secondary font-semibold">
              <tr>
                <th className="py-3.5 px-6">Photo</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Featured</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Dimensions</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {photos.map((photo) => (
                <tr key={photo.id} className="hover:bg-surface-raised/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded bg-surface-raised border border-surface-border overflow-hidden shrink-0 cursor-pointer"
                        onClick={() => onPreview(photo)}
                      >
                        <img
                          src={photo.thumbnail_url || photo.image_url}
                          alt={photo.alt_text}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-primary text-xs truncate max-w-xs">
                          {photo.title}
                        </p>
                        <p className="text-[10px] text-secondary/70 truncate max-w-xs mt-0.5">
                          {photo.alt_text}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-accent font-medium">{photo.category_name || "—"}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => onToggleStatus(photo.id, { is_featured: !photo.is_featured })}
                      className={`p-1.5 rounded transition-colors ${
                        photo.is_featured ? "text-accent" : "text-secondary/40 hover:text-secondary"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => onToggleStatus(photo.id, { is_published: !photo.is_published })}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        photo.is_published
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-surface-raised text-secondary border border-surface-border"
                      }`}
                    >
                      {photo.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3.5 px-6 text-secondary text-[11px]">
                    {photo.width && photo.height ? `${photo.width} × ${photo.height}` : "HD"}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onPreview(photo)}
                        className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-accent transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(photo)}
                        className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-accent transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(photo)}
                        className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};
