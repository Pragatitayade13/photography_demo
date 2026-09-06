import React, { useState } from "react";
import { Save } from "lucide-react";
import { HomepageSection } from "../types/homepage.types";

interface CategoriesSectionEditorProps {
  section: HomepageSection;
  onSave: (config: Record<string, any>, isVisible: boolean) => Promise<void>;
  isSaving: boolean;
}

export const CategoriesSectionEditor: React.FC<CategoriesSectionEditorProps> = ({
  section,
  onSave,
  isSaving,
}) => {
  const [config, setConfig] = useState({
    heading: section.configuration.heading || "Photography Disciplines",
    subheading: section.configuration.subheading || "",
    show_counts: section.configuration.show_counts !== undefined ? section.configuration.show_counts : true,
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
          Section Subheading
        </label>
        <input
          type="text"
          value={config.subheading}
          onChange={(e) => setConfig((prev) => ({ ...prev, subheading: e.target.value }))}
          className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
        />
      </div>

      <div className="pt-2 border-t border-surface-border">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.show_counts}
            onChange={(e) => setConfig((prev) => ({ ...prev, show_counts: e.target.checked }))}
            className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
          />
          <div>
            <p className="text-xs font-medium text-primary">Display Photo Counts on Badges</p>
            <p className="text-[10px] text-secondary">Shows how many photographs are cataloged in each category</p>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-surface-border">
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="w-4 h-4 rounded border-surface-border text-accent focus:ring-accent accent-accent"
          />
          <span className="text-xs font-medium text-primary">Display Categories Section</span>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Categories"}</span>
        </button>
      </div>
    </form>
  );
};
