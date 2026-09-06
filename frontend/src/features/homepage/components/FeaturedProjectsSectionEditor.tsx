import React, { useState } from "react";
import { Save, Check } from "lucide-react";
import { HomepageSection } from "../types/homepage.types";
import { useProjects } from "../../projects/hooks/useProjects";

interface FeaturedProjectsSectionEditorProps {
  section: HomepageSection;
  onSave: (config: Record<string, any>, isVisible: boolean) => Promise<void>;
  isSaving: boolean;
}

export const FeaturedProjectsSectionEditor: React.FC<FeaturedProjectsSectionEditorProps> = ({
  section,
  onSave,
  isSaving,
}) => {
  const { projects } = useProjects();
  const [config, setConfig] = useState({
    heading: section.configuration.heading || "Selected Stories",
    subheading: section.configuration.subheading || "",
    project_ids: (section.configuration.project_ids as string[]) || [],
    max_display: section.configuration.max_display || 3,
  });
  const [isVisible, setIsVisible] = useState(section.is_visible);

  const toggleProject = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      project_ids: prev.project_ids.includes(id)
        ? prev.project_ids.filter((item) => item !== id)
        : [...prev.project_ids, id],
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
            Display Limit (Max Stories)
          </label>
          <input
            type="number"
            min={1}
            max={8}
            value={config.max_display}
            onChange={(e) => setConfig((prev) => ({ ...prev, max_display: parseInt(e.target.value) || 3 }))}
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

      {/* Select Projects checklist */}
      <div className="space-y-2 pt-2 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
            Select Stories to Feature ({config.project_ids.length} selected)
          </label>
          <span className="text-[10px] text-secondary">
            Unselected defaults to all top featured stories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
          {projects.map((proj) => {
            const isSelected = config.project_ids.includes(proj.id);
            return (
              <div
                key={proj.id}
                onClick={() => toggleProject(proj.id)}
                className={`p-3 rounded-lg border flex items-center space-x-3 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-accent/10 border-accent text-primary ring-1 ring-accent"
                    : "bg-surface-raised/60 border-surface-border hover:border-secondary"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded shrink-0 flex items-center justify-center transition-colors ${
                    isSelected ? "bg-accent text-background" : "border border-surface-border"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <div className="truncate text-xs">
                  <p className="font-medium truncate">{proj.title}</p>
                  <p className="text-[10px] text-accent truncate">{proj.category_name || "Uncategorized"}</p>
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
          <span className="text-xs font-medium text-primary">Display Featured Projects Section</span>
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Featured Projects"}</span>
        </button>
      </div>
    </form>
  );
};
