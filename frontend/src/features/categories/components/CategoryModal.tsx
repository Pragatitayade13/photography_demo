import React, { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { Category, CategoryFormData } from "../types/category.types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
}) => {
  const isEditing = Boolean(category);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    cover_image_url: "",
    is_active: true,
    is_visible: true,
  });

  const [slugModifiedManually, setSlugModifiedManually] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/&/g, "-and-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        cover_image_url: category.cover_image_url || "",
        is_active: category.is_active,
        is_visible: category.is_visible,
      });
      setSlugModifiedManually(true);
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        cover_image_url: "",
        is_active: true,
        is_visible: true,
      });
      setSlugModifiedManually(false);
    }
    setErrorMessage(null);
  }, [category, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: slugModifiedManually ? prev.slug : slugify(val),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugModifiedManually(true);
    setFormData((prev) => ({
      ...prev,
      slug: slugify(e.target.value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Category name is required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit({
        ...formData,
        slug: formData.slug || slugify(formData.name),
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.error?.message || err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-lg font-medium text-primary">
              {isEditing ? "Edit Category" : "Create New Category"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-md text-danger text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Category Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Fine Art & Architecture"
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                URL Slug
              </label>
              <span className="text-[10px] text-secondary/60">
                /portfolio/{formData.slug || "category-slug"}
              </span>
            </div>
            <input
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="e.g. fine-art-and-architecture"
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-mono focus:outline-none focus:border-accent"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Description (Optional)
              </label>
              <span className="text-[10px] text-secondary/60">
                {formData.description.length} / 500
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief summary of this photography genre for SEO and public story previews..."
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Cover Image URL Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Cover Image URL (Optional)
            </label>
            <input
              type="text"
              value={formData.cover_image_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, cover_image_url: e.target.value }))}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Active & Visible Toggles */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-surface-border/60">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <div>
                <p className="text-xs font-medium text-primary">Active in CMS</p>
                <p className="text-[10px] text-secondary">Can assign new photos</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_visible: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <div>
                <p className="text-xs font-medium text-primary">Publicly Visible</p>
                <p className="text-[10px] text-secondary">Shown on showcase filters</p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-surface-border rounded text-xs uppercase tracking-widest text-secondary hover:text-primary hover:border-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md shadow-accent/10"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
