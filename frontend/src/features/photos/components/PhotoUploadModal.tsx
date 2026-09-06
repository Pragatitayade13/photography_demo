import React, { useState } from "react";
import { X, UploadCloud, AlertCircle, Sparkles } from "lucide-react";
import { photoService } from "../services/photoService";
import { useCategories } from "../../categories/hooks/useCategories";
import { PhotoFormData } from "../types/photo.types";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { categories } = useCategories();

  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [formData, setFormData] = useState<PhotoFormData>({
    title: "",
    alt_text: "",
    description: "",
    image_url: "",
    category_id: "",
    location: "",
    photo_date: new Date().toISOString().split("T")[0],
    is_published: true,
    is_featured: false,
    is_visible: true,
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (JPEG, PNG, WebP)");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);

      // Auto-populate title from filename if empty
      if (!formData.title) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        setFormData((prev) => ({
          ...prev,
          title: cleanName,
          alt_text: prev.alt_text || cleanName,
        }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);

      if (!formData.title) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        setFormData((prev) => ({
          ...prev,
          title: cleanName,
          alt_text: prev.alt_text || cleanName,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage("Photo title is required");
      return;
    }
    if (!formData.alt_text.trim()) {
      setErrorMessage("Alt text is required for accessibility and SEO");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setErrorMessage(null);

    try {
      let finalImageUrl = formData.image_url;

      if (uploadMode === "file" && selectedFile) {
        setUploadProgress(50);
        const uploadRes = await photoService.uploadImage(selectedFile);
        finalImageUrl = uploadRes.image_url;
        setUploadProgress(80);
      }

      if (!finalImageUrl) {
        setErrorMessage("Please upload an image file or provide an image URL");
        setIsUploading(false);
        return;
      }

      await photoService.createPhoto({
        ...formData,
        image_url: finalImageUrl,
        thumbnail_url: finalImageUrl,
        category_id: formData.category_id || undefined,
      });

      setUploadProgress(100);
      await onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.error?.message || err.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-serif text-lg font-medium text-primary">
              Upload Photograph to Gallery
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

          {/* Upload Method Switch */}
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  uploadMode === "file"
                    ? "bg-accent text-background font-semibold"
                    : "text-secondary hover:text-primary"
                }`}
              >
                Upload Local File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("url")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  uploadMode === "url"
                    ? "bg-accent text-background font-semibold"
                    : "text-secondary hover:text-primary"
                }`}
              >
                Direct Image URL
              </button>
            </div>
            <span className="text-[11px] text-secondary">
              JPG, PNG, WebP up to 20MB
            </span>
          </div>

          {/* Media Drop Zone or URL Input */}
          {uploadMode === "file" ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                previewUrl
                  ? "border-accent/40 bg-surface-raised/40"
                  : "border-surface-border hover:border-secondary bg-surface-raised/20"
              }`}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-36 h-36 rounded-lg overflow-hidden border border-surface-border shadow-md">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-primary">
                      {selectedFile?.name} ({(selectedFile?.size ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0)} MB)
                    </p>
                    <label className="text-[11px] text-accent hover:underline cursor-pointer">
                      Choose a different photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-3 py-4">
                  <div className="p-3 bg-surface-raised rounded-full text-accent border border-surface-border">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary">
                      Drag & drop your photograph here, or <span className="text-accent underline">browse</span>
                    </p>
                    <p className="text-[10px] text-secondary mt-1">
                      High-resolution images will be preserved and optimized automatically
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Direct Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, image_url: e.target.value }));
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>
          )}

          {/* Form Fields Grid */}
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
                placeholder="e.g. Desert Solitude at Dusk"
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Portfolio Category
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

          {/* Alt Text (SEO & Accessibility) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Alt Text (Accessibility & SEO) <span className="text-accent">*</span>
              </label>
              <span className="text-[10px] text-secondary/60">
                Describe the photo for search engines & screen readers
              </span>
            </div>
            <input
              type="text"
              required
              value={formData.alt_text}
              onChange={(e) => setFormData((prev) => ({ ...prev, alt_text: e.target.value }))}
              placeholder="e.g. Bride wearing silk veil standing beside ancient stone cathedral pillars"
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Description & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Shoot Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Lake Como, Italy"
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Capture Date
              </label>
              <input
                type="date"
                value={formData.photo_date || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, photo_date: e.target.value }))}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-surface-border">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <div>
                <p className="text-xs font-medium text-primary">Publish Immediately</p>
                <p className="text-[10px] text-secondary">Visible on live portfolio</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
              />
              <div>
                <p className="text-xs font-medium text-primary">Mark as Featured</p>
                <p className="text-[10px] text-secondary">Highlighted on homepage showcase</p>
              </div>
            </label>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-secondary">
                <span>Uploading high-resolution image...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-surface-raised rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-accent h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-surface-border rounded text-xs uppercase tracking-widest text-secondary hover:text-primary hover:border-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md shadow-accent/10"
            >
              {isUploading ? "Uploading..." : "Save Photograph"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
