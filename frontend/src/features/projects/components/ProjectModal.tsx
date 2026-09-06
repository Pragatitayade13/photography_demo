import React, { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import { Project, ProjectFormData } from "../types/project.types";
import { useCategories } from "../../categories/hooks/useCategories";
import { ImageUploaderInput } from "../../admin/components/ImageUploaderInput";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  project?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const isEditing = Boolean(project);
  const { categories } = useCategories();

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    cover_image_url: "",
    category_id: "",
    location: "",
    project_date: new Date().toISOString().split("T")[0],
    is_published: true,
    is_featured: false,
    is_visible: true,
    featured_order: 0,
    tags: [],
    show_in_search: true,
    show_related_projects: true,
    enable_gallery: true,
    enable_before_after: true,
    show_enquiry_cta: true,
    allow_sharing: true,
  });

  const [tagInput, setTagInput] = useState<string>("");
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
    if (project) {
      setFormData({
        title: project.title,
        slug: project.slug,
        short_description: project.short_description || "",
        description: project.description || "",
        cover_image_url: project.cover_image_url || "",
        category_id: project.category_id || "",
        location: project.location || "",
        project_date: project.project_date ? project.project_date.split("T")[0] : "",
        is_published: project.is_published,
        is_featured: project.is_featured,
        is_visible: project.is_visible,
        featured_order: project.featured_order ?? 0,
        tags: project.tags || [],
        show_in_search: project.show_in_search ?? true,
        show_related_projects: project.show_related_projects ?? true,
        enable_gallery: project.enable_gallery ?? true,
        enable_before_after: project.enable_before_after ?? true,
        show_enquiry_cta: project.show_enquiry_cta ?? true,
        allow_sharing: project.allow_sharing ?? true,
      });
      setTagInput((project.tags || []).join(", "));
    } else {
      setFormData({
        title: "",
        slug: "",
        short_description: "",
        description: "",
        cover_image_url: "",
        category_id: "",
        location: "",
        project_date: new Date().toISOString().split("T")[0],
        is_published: true,
        is_featured: false,
        is_visible: true,
        featured_order: 0,
        tags: [],
        show_in_search: true,
        show_related_projects: true,
        enable_gallery: true,
        enable_before_after: true,
        show_enquiry_cta: true,
        allow_sharing: true,
      });
      setTagInput("");
    }
    setErrorMessage(null);
  }, [project, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage("Project title is required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        ...formData,
        slug: formData.slug || slugify(formData.title),
        category_id: formData.category_id || undefined,
        tags: parsedTags,
        featured_order: Number(formData.featured_order) || 0,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.error?.message || err.message || "Failed to save project story");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-lg font-medium text-primary">
              {isEditing ? "Edit Project Story" : "Create New Project Story"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-md text-danger text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Project Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Royal Wedding — Mumbai"
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
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slug & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  URL Slug
                </label>
                <span className="text-[10px] text-secondary/60">
                  /projects/{formData.slug || "project-slug"}
                </span>
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="editorial, luxury, destination, black-and-white"
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Cover Image with System File Upload */}
          <ImageUploaderInput
            label="Project Cover Image"
            value={formData.cover_image_url || ""}
            onChange={(url) => setFormData((prev) => ({ ...prev, cover_image_url: url }))}
            helpText="Upload a high-resolution cover photo from your system (JPEG, PNG, WebP) or choose from library."
            aspectRatio="aspect-[16/10]"
          />

          {/* Short Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Short Description (Story Hook)
              </label>
              <span className="text-[10px] text-secondary/60">
                {formData.short_description?.length || 0} / 300
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={300}
              value={formData.short_description || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
              placeholder="A brief editorial summary for portfolio project cards..."
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Location & Date & Featured Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Milan, Italy"
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Project Date
              </label>
              <input
                type="date"
                value={formData.project_date || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, project_date: e.target.value }))}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Featured Order (0 = Default)
              </label>
              <input
                type="number"
                min={0}
                max={999}
                value={formData.featured_order ?? 0}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured_order: parseInt(e.target.value, 10) || 0 }))}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Status Switches */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-surface-border">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs font-medium text-primary">Published</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs font-medium text-primary">Featured</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_in_search}
                onChange={(e) => setFormData((prev) => ({ ...prev, show_in_search: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs font-medium text-primary">Searchable</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enable_before_after}
                onChange={(e) => setFormData((prev) => ({ ...prev, enable_before_after: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs font-medium text-primary">Before/After</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-surface-border/50">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enable_gallery}
                onChange={(e) => setFormData((prev) => ({ ...prev, enable_gallery: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs text-secondary">Fullscreen Zoom</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_related_projects}
                onChange={(e) => setFormData((prev) => ({ ...prev, show_related_projects: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs text-secondary">Related Stories</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_enquiry_cta}
                onChange={(e) => setFormData((prev) => ({ ...prev, show_enquiry_cta: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs text-secondary">Inquiry CTA</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-surface-border">
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
              className="px-6 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md shadow-accent/10"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Project Story" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
