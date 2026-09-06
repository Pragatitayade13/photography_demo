import React, { useState } from "react";
import { Save } from "lucide-react";
import { HomepageSection } from "../types/homepage.types";
import { ImageUploaderInput } from "../../admin/components/ImageUploaderInput";

interface AboutSectionEditorProps {
  section: HomepageSection;
  onSave: (config: Record<string, any>, isVisible: boolean) => Promise<void>;
  isSaving: boolean;
}

export const AboutSectionEditor: React.FC<AboutSectionEditorProps> = ({
  section,
  onSave,
  isSaving,
}) => {
  const [config, setConfig] = useState({
    eyebrow: section.configuration.eyebrow || "BACKGROUND & ACCOLADES",
    heading: section.configuration.heading || "Alex Mercer — Principal Visual Artist",
    bio_paragraphs: (section.configuration.bio_paragraphs as string[]) || [
      "With over a decade behind the lens, I combine high-fashion aesthetics with documentary truth to capture moments that endure.",
      "Featured in Vogue Weddings, Harper's Bazaar, and Architectural Digest. Available for commissions worldwide.",
    ],
    portrait_image_url: section.configuration.portrait_image_url || "",
    cta_text: section.configuration.cta_text || "Read Biography & Press",
    cta_link: section.configuration.cta_link || "/about",
  });
  const [isVisible, setIsVisible] = useState(section.is_visible);

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...config.bio_paragraphs];
    updated[index] = val;
    setConfig((prev) => ({ ...prev, bio_paragraphs: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(config, isVisible);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
          Eyebrow Header
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
          Main Artist Heading <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          required
          value={config.heading}
          onChange={(e) => setConfig((prev) => ({ ...prev, heading: e.target.value }))}
          className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent font-serif"
        />
      </div>

      <div className="space-y-3">
        <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
          Biography Excerpts
        </label>
        {config.bio_paragraphs.map((p, idx) => (
          <textarea
            key={idx}
            rows={2}
            value={p}
            onChange={(e) => handleParagraphChange(idx, e.target.value)}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            placeholder={`Biography paragraph ${idx + 1}...`}
          />
        ))}
      </div>

      {/* Photographer Portrait with File Upload */}
      <ImageUploaderInput
        label="Photographer Portrait Photo"
        value={config.portrait_image_url}
        onChange={(url) => setConfig((prev) => ({ ...prev, portrait_image_url: url }))}
        helpText="Upload a portrait photo from your computer (JPEG, PNG, WebP) or paste an image link."
        aspectRatio="aspect-[3/4]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            CTA Button Text
          </label>
          <input
            type="text"
            value={config.cta_text}
            onChange={(e) => setConfig((prev) => ({ ...prev, cta_text: e.target.value }))}
            className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            CTA Target Link
          </label>
          <input
            type="text"
            value={config.cta_link}
            onChange={(e) => setConfig((prev) => ({ ...prev, cta_link: e.target.value }))}
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
          <span className="text-xs font-medium text-primary">Display About Preview Section</span>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save About Settings"}</span>
        </button>
      </div>
    </form>
  );
};
