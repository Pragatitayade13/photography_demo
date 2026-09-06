import React, { useState } from "react";
import { Save, Check } from "lucide-react";
import { HomepageSection } from "../types/homepage.types";
import { usePhotos } from "../../photos/hooks/usePhotos";

interface SelectedWorkSectionEditorProps {
  section: HomepageSection;
  onSave: (config: Record<string, any>, isVisible: boolean) => Promise<void>;
  isSaving: boolean;
}

export const SelectedWorkSectionEditor: React.FC<SelectedWorkSectionEditorProps> = ({
  section,
  onSave,
  isSaving,
}) => {
  const { photos } = usePhotos();
  const [config, setConfig] = useState({
    heading: section.configuration.heading || "Curated Artworks",
    subheading: section.configuration.subheading || "",
    photo_ids: (section.configuration.photo_ids as string[]) || [],
    max_display: section.configuration.max_display || 4,
  });
  const [isVisible, setIsVisible] = useState(section.is_visible);

  const togglePhoto = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      photo_ids: prev.photo_ids.includes(id)
        ? prev.photo_ids.filter((item) => item !== id)
        : [...prev.photo_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(config, isVisible);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Section Heading <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            required
            value={config.heading}
            onChange={(e) => setConfig((prev) => ({ ...prev, heading: e.target.value }))}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent font-serif"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Display Limit (Max Photographs)
          </label>
          <input
            type="number"
            min={1}
            max={12}
            value={config.max_display}
            onChange={(e) => setConfig((prev) => ({ ...prev, max_display: parseInt(e.target.value) || 4 }))}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Section Subheading
          </label>
          <input
            type="text"
            value={config.subheading}
            onChange={(e) => setConfig((prev) => ({ ...prev, subheading: e.target.value }))}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Select Photos checklist */}
      <div className="space-y-2 pt-2 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Select Artworks to Showcase ({config.photo_ids.length} selected)
          </label>
          <span className="text-[10px] text-secondary">
            Unselected defaults to all top featured photos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
          {photos.map((photo) => {
            const isSelected = config.photo_ids.includes(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => togglePhoto(photo.id)}
                className={`relative aspect-[4/5] rounded-lg overflow-hidden border cursor-pointer transition-all ${
                  isSelected
                    ? "border-accent ring-2 ring-accent shadow-md"
                    : "border-surface-border opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.alt_text}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      isSelected ? "bg-accent text-background" : "bg-background/80 border border-surface-border text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-background/85 p-1.5 text-[9px] text-primary truncate">
                  {photo.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
          />
          <span className="text-xs font-medium text-primary">Display Selected Work Section</span>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Selected Work"}</span>
        </button>
      </div>
    </form>
  );
};
