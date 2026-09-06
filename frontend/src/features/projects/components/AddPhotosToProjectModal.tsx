import React, { useState } from "react";
import { X, Search, Check, Plus, AlertCircle } from "lucide-react";
import { usePhotos } from "../../photos/hooks/usePhotos";
import { useCategories } from "../../categories/hooks/useCategories";

interface AddPhotosToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhotos: (photoIds: string[]) => Promise<void>;
  existingPhotoIds?: string[];
}

export const AddPhotosToProjectModal: React.FC<AddPhotosToProjectModalProps> = ({
  isOpen,
  onClose,
  onAddPhotos,
  existingPhotoIds = [],
}) => {
  const { photos, isLoading } = usePhotos();
  const { categories } = useCategories();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredPhotos = photos.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.alt_text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onAddPhotos(selectedIds);
      setSelectedIds([]);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.error?.message || err.message || "Failed to add photos");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif text-lg font-medium text-primary">
              Add Photographs to Project
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Select photos from your media library to include in this curated story.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-surface-border bg-surface-raised/40 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-secondary absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full bg-surface border border-surface-border rounded-md pl-9 pr-3 py-1.5 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-md px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="m-4 p-3 bg-danger/10 border border-danger/20 rounded-md text-danger text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Photo Selection Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-secondary animate-pulse">
              Loading library photos...
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="p-12 text-center text-xs text-secondary">
              No matching photographs found in media library.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => {
                const isAlreadyInProject = existingPhotoIds.includes(photo.id);
                const isSelected = selectedIds.includes(photo.id);

                return (
                  <div
                    key={photo.id}
                    onClick={() => !isAlreadyInProject && toggleSelect(photo.id)}
                    className={`group relative aspect-[4/5] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      isAlreadyInProject
                        ? "opacity-40 cursor-not-allowed border-surface-border"
                        : isSelected
                        ? "border-accent ring-2 ring-accent shadow-md"
                        : "border-surface-border hover:border-accent/60"
                    }`}
                  >
                    <img
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.alt_text}
                      className="w-full h-full object-cover"
                    />

                    {/* Checkbox indicator */}
                    <div className="absolute top-2 right-2 z-10">
                      {isAlreadyInProject ? (
                        <span className="px-1.5 py-0.5 rounded bg-background/80 text-[9px] uppercase font-bold text-secondary">
                          Added
                        </span>
                      ) : (
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-accent text-background"
                              : "bg-background/80 border border-surface-border text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Title bar */}
                    <div className="absolute inset-x-0 bottom-0 bg-background/85 backdrop-blur-sm p-2 text-[10px]">
                      <p className="text-primary font-medium truncate">{photo.title}</p>
                      <p className="text-accent truncate">{photo.category_name || "Uncategorized"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-surface-border flex items-center justify-between shrink-0 bg-surface">
          <span className="text-xs text-secondary">
            <strong className="text-accent font-semibold">{selectedIds.length}</strong> photo(s) selected
          </span>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-surface-border rounded text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0 || isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Adding..." : "Add to Project"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
