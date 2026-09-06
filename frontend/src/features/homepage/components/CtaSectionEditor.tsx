import React, { useState } from "react";
import { Save } from "lucide-react";
import { HomepageSection } from "../types/homepage.types";
import { ImageUploaderInput } from "../../admin/components/ImageUploaderInput";

interface CtaSectionEditorProps {
  section: HomepageSection;
  onSave: (config: Record<string, any>, isVisible: boolean) => Promise<void>;
  isSaving: boolean;
}

export const CtaSectionEditor: React.FC<CtaSectionEditorProps> = ({
  section,
  onSave,
  isSaving,
}) => {
  const [config, setConfig] = useState({
    heading: section.configuration.heading || "Let's Create Something Timeless Together",
    subheading: section.configuration.subheading || "",
    button_text: section.configuration.button_text || "Begin The Conversation",
    button_link: section.configuration.button_link || "/contact",
    bg_image_url: section.configuration.bg_image_url || "",
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
          Call to Action Heading <span className="text-accent">*</span>
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
          Subheading / Invitation Note
        </label>
        <textarea
          rows={2}
          value={config.subheading}
          onChange={(e) => setConfig((prev) => ({ ...prev, subheading: e.target.value }))}
          className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Button Label
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
            Button Link
          </label>
          <input
            type="text"
            value={config.button_link}
            onChange={(e) => setConfig((prev) => ({ ...prev, button_link: e.target.value }))}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-mono focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Background Ambient Backdrop with File Upload */}
      <ImageUploaderInput
        label="Background Ambient Backdrop Image"
        value={config.bg_image_url}
        onChange={(url) => setConfig((prev) => ({ ...prev, bg_image_url: url }))}
        helpText="Upload an ambient background image from your computer or paste an image URL."
        aspectRatio="aspect-[16/9]"
      />

      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
          />
          <span className="text-xs font-medium text-primary">Display CTA Section</span>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Call to Action"}</span>
        </button>
      </div>
    </form>
  );
};
