import React, { useState } from "react";
import { Save } from "lucide-react";
import { HomepageSection } from "../types/homepage.types";
import { ImageUploaderInput } from "../../admin/components/ImageUploaderInput";

interface HeroSectionEditorProps {
  section: HomepageSection;
  onSave: (config: Record<string, any>, isVisible: boolean) => Promise<void>;
  isSaving: boolean;
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({
  section,
  onSave,
  isSaving,
}) => {
  const [config, setConfig] = useState({
    headline: section.configuration.headline || "Stories Worth Remembering",
    subheadline: section.configuration.subheadline || "",
    media_type: section.configuration.media_type || "image",
    media_url: section.configuration.media_url || "",
    mobile_media_url: section.configuration.mobile_media_url || "",
    primary_btn_text: section.configuration.primary_btn_text || "Explore Portfolio",
    primary_btn_link: section.configuration.primary_btn_link || "/portfolio",
    secondary_btn_text: section.configuration.secondary_btn_text || "Inquire Booking",
    secondary_btn_link: section.configuration.secondary_btn_link || "/contact",
  });
  const [isVisible, setIsVisible] = useState(section.is_visible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(config, isVisible);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Main Hero Headline <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            required
            value={config.headline}
            onChange={(e) => setConfig((prev) => ({ ...prev, headline: e.target.value }))}
            placeholder="e.g. Stories Worth Remembering"
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-accent font-serif"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Subheadline / Craft Statement
          </label>
          <input
            type="text"
            value={config.subheadline}
            onChange={(e) => setConfig((prev) => ({ ...prev, subheadline: e.target.value }))}
            placeholder="e.g. International Editorial & Destination Wedding Photography"
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Hero Media with System File Upload */}
      <ImageUploaderInput
        label="Hero Backdrop Image"
        required
        value={config.media_url}
        onChange={(url) => setConfig((prev) => ({ ...prev, media_url: url }))}
        helpText="Upload a high-resolution photograph (JPEG, PNG, WebP) from your computer or paste an image URL."
        aspectRatio="aspect-[16/9]"
      />

      {/* Primary & Secondary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-surface-border">
        <div className="space-y-3 p-3 bg-surface-raised/40 rounded-lg border border-surface-border">
          <p className="text-xs font-medium text-primary">Primary Call To Action</p>
          <div className="space-y-2">
            <input
              type="text"
              value={config.primary_btn_text}
              onChange={(e) => setConfig((prev) => ({ ...prev, primary_btn_text: e.target.value }))}
              placeholder="Button Label (e.g. Explore Portfolio)"
              className="w-full bg-surface border border-surface-border rounded px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              value={config.primary_btn_link}
              onChange={(e) => setConfig((prev) => ({ ...prev, primary_btn_link: e.target.value }))}
              placeholder="Link (e.g. /portfolio)"
              className="w-full bg-surface border border-surface-border rounded px-3 py-1.5 text-xs text-primary font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-3 p-3 bg-surface-raised/40 rounded-lg border border-surface-border">
          <p className="text-xs font-medium text-primary">Secondary Call To Action</p>
          <div className="space-y-2">
            <input
              type="text"
              value={config.secondary_btn_text}
              onChange={(e) => setConfig((prev) => ({ ...prev, secondary_btn_text: e.target.value }))}
              placeholder="Button Label (e.g. Inquire Booking)"
              className="w-full bg-surface border border-surface-border rounded px-3 py-1.5 text-xs text-primary focus:outline-none focus:border-accent"
            />
            <input
              type="text"
              value={config.secondary_btn_link}
              onChange={(e) => setConfig((prev) => ({ ...prev, secondary_btn_link: e.target.value }))}
              placeholder="Link (e.g. /contact)"
              className="w-full bg-surface border border-surface-border rounded px-3 py-1.5 text-xs text-primary font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Visibility Toggle & Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
          />
          <span className="text-xs font-medium text-primary">Display Hero Section</span>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md shadow-accent/10"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Hero Settings"}</span>
        </button>
      </div>
    </form>
  );
};
