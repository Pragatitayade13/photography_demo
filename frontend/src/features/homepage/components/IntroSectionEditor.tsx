import React, { useState } from "react";
import { Save } from "lucide-react";
import { HomepageSection } from "../types/homepage.types";
import { ImageUploaderInput } from "../../admin/components/ImageUploaderInput";

interface IntroSectionEditorProps {
  section: HomepageSection;
  onSave: (config: Record<string, any>, isVisible: boolean) => Promise<void>;
  isSaving: boolean;
}

export const IntroSectionEditor: React.FC<IntroSectionEditorProps> = ({
  section,
  onSave,
  isSaving,
}) => {
  const [config, setConfig] = useState({
    eyebrow: section.configuration.eyebrow || "THE ARTISTIC VISION",
    heading: section.configuration.heading || "",
    description: section.configuration.description || "",
    image_url: section.configuration.image_url || "",
    button_text: section.configuration.button_text || "Discover The Story",
    button_link: section.configuration.button_link || "/about",
  });
  const [isVisible, setIsVisible] = useState(section.is_visible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(config, isVisible);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
          Eyebrow Tagline
        </label>
        <input
          type="text"
          value={config.eyebrow}
          onChange={(e) => setConfig((prev) => ({ ...prev, eyebrow: e.target.value }))}
          className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
          Philosophy Statement / Headline <span className="text-accent">*</span>
        </label>
        <textarea
          rows={2}
          required
          value={config.heading}
          onChange={(e) => setConfig((prev) => ({ ...prev, heading: e.target.value }))}
          className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent font-serif"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
          Narrative Description <span className="text-accent">*</span>
        </label>
        <textarea
          rows={3}
          required
          value={config.description}
          onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
        />
      </div>

      {/* Featured Introduction Photo with File Upload */}
      <ImageUploaderInput
        label="Featured Studio Portrait / Visual"
        value={config.image_url}
        onChange={(url) => setConfig((prev) => ({ ...prev, image_url: url }))}
        helpText="Upload a portrait photo from your computer or select an existing frame."
        aspectRatio="aspect-[4/5]"
      />

      {/* Button configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Link Button Label
          </label>
          <input
            type="text"
            value={config.button_text}
            onChange={(e) => setConfig((prev) => ({ ...prev, button_text: e.target.value }))}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Link Destination
          </label>
          <input
            type="text"
            value={config.button_link}
            onChange={(e) => setConfig((prev) => ({ ...prev, button_link: e.target.value }))}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-mono focus:outline-none focus:border-accent"
          />
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
          <span className="text-xs font-medium text-primary">Display Intro Section</span>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Intro"}</span>
        </button>
      </div>
    </form>
  );
};
