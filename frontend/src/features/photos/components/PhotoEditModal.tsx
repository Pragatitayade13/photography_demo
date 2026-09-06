import React, { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { Photo, PhotoFormData } from "../types/photo.types";
import { useCategories } from "../../categories/hooks/useCategories";

interface PhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<PhotoFormData>) => Promise<void>;
  photo: Photo | null;
}

export const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  photo,
}) => {
  const { categories } = useCategories();

  const [formData, setFormData] = useState<PhotoFormData>({
    title: "",
    alt_text: "",
    description: "",
    image_url: "",
    category_id: "",
    location: "",
    photo_date: "",
    is_published: true,
    is_featured: false,
    is_visible: true,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (photo) {
      setFormData({
        title: photo.title,
        alt_text: photo.alt_text,
        description: photo.description || "",
        image_url: photo.image_url,
        category_id: photo.category_id || "",
        location: photo.location || "",
        photo_date: photo.photo_date ? photo.photo_date.split("T")[0] : "",
        is_published: photo.is_published,
        is_featured: photo.is_featured,
        is_visible: photo.is_visible,
      });
    }
    setErrorMessage(null);
  }, [photo, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;
    if (!formData.title.trim()) {
      setErrorMessage("Photo title is required");
      return;
    }
    if (!formData.alt_text.trim()) {
      setErrorMessage("Alt text is required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit(photo.id, {
        ...formData,
        category_id: formData.category_id || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.error?.message || err.message || "Failed to update photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-lg font-medium text-primary">
              Edit Photograph Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-md text-danger text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Thumbnail preview banner */}
          <div className="flex items-center space-x-4 p-3 bg-surface-raised rounded-lg border border-surface-border">
            <div className="w-16 h-16 rounded overflow-hidden bg-background shrink-0 border border-surface-border">
              <img
                src={photo.thumbnail_url || photo.image_url}
                alt={photo.alt_text}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs space-y-0.5 truncate">
              <p className="text-primary font-medium truncate">{photo.title}</p>
              <p className="text-secondary text-[11px] truncate">
                {photo.width && photo.height ? `${photo.width} × ${photo.height} px • ` : ""}
                {photo.file_size ? `${(photo.file_size / 1024 / 1024).toFixed(2)} MB` : "Digital Image"}
              </p>
              <span className="text-accent text-[10px] uppercase tracking-wider font-semibold">
                {photo.category_name || "Uncategorized"}
              </span>
            </div>
          </div>

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Photo Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="">Unassigned</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alt Text */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Alt Text (SEO & Accessibility) <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.alt_text}
              onChange={(e) => setFormData((prev) => ({ ...prev, alt_text: e.target.value }))}
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Artistic concept or background notes..."
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Venice, Italy"
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Photo Date
              </label>
              <input
                type="date"
                value={formData.photo_date || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, photo_date: e.target.value }))}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Status Switches */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-surface-border">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs text-primary font-medium">Published</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs text-primary font-medium">Featured</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_visible: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs text-primary font-medium">Visible</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-surface-border rounded text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Update Photograph"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
