import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  LayoutTemplate,
} from "lucide-react";
import { useHomepageCMS } from "../homepage/hooks/useHomepageCMS";
import { HomepageSection } from "../homepage/types/homepage.types";
import { HeroSectionEditor } from "../homepage/components/HeroSectionEditor";
import { IntroSectionEditor } from "../homepage/components/IntroSectionEditor";
import { FeaturedProjectsSectionEditor } from "../homepage/components/FeaturedProjectsSectionEditor";
import { CategoriesSectionEditor } from "../homepage/components/CategoriesSectionEditor";
import { SelectedWorkSectionEditor } from "../homepage/components/SelectedWorkSectionEditor";
import { AboutSectionEditor } from "../homepage/components/AboutSectionEditor";
import { CtaSectionEditor } from "../homepage/components/CtaSectionEditor";

export const HomepageView: React.FC = () => {
  const {
    sections,
    isLoading,
    isSaving,
    error,
    successMessage,
    updateSectionConfig,
    toggleVisibility,
    moveSection,
    resetToDefault,
  } = useHomepageCMS();

  const [expandedSection, setExpandedSection] = useState<string>("hero");

  const toggleExpand = (sectionKey: string) => {
    setExpandedSection((prev) => (prev === sectionKey ? "" : sectionKey));
  };

  const renderSectionEditor = (section: HomepageSection) => {
    switch (section.section_key) {
      case "hero":
        return (
          <HeroSectionEditor
            section={section}
            onSave={(cfg, isVis) => updateSectionConfig(section.section_key, cfg, section.title, isVis)}
            isSaving={isSaving}
          />
        );
      case "intro":
        return (
          <IntroSectionEditor
            section={section}
            onSave={(cfg, isVis) => updateSectionConfig(section.section_key, cfg, section.title, isVis)}
            isSaving={isSaving}
          />
        );
      case "featured_projects":
        return (
          <FeaturedProjectsSectionEditor
            section={section}
            onSave={(cfg, isVis) => updateSectionConfig(section.section_key, cfg, section.title, isVis)}
            isSaving={isSaving}
          />
        );
      case "categories":
        return (
          <CategoriesSectionEditor
            section={section}
            onSave={(cfg, isVis) => updateSectionConfig(section.section_key, cfg, section.title, isVis)}
            isSaving={isSaving}
          />
        );
      case "selected_work":
        return (
          <SelectedWorkSectionEditor
            section={section}
            onSave={(cfg, isVis) => updateSectionConfig(section.section_key, cfg, section.title, isVis)}
            isSaving={isSaving}
          />
        );
      case "about_preview":
        return (
          <AboutSectionEditor
            section={section}
            onSave={(cfg, isVis) => updateSectionConfig(section.section_key, cfg, section.title, isVis)}
            isSaving={isSaving}
          />
        );
      case "cta":
        return (
          <CtaSectionEditor
            section={section}
            onSave={(cfg, isVis) => updateSectionConfig(section.section_key, cfg, section.title, isVis)}
            isSaving={isSaving}
          />
        );
      default:
        return <p className="text-xs text-secondary">Section settings</p>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-accent">
            <LayoutTemplate className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Visual Homepage Builder
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light text-primary tracking-tight mt-1">
            Homepage Content Management
          </h2>
          <p className="text-xs text-secondary mt-1">
            Reorder sections, adjust storytelling copy, toggle visibility, and curate artwork displayed on your landing page.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-center">
          <button
            onClick={resetToDefault}
            disabled={isSaving}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-surface border border-surface-border rounded-md text-xs text-secondary hover:text-primary transition-colors disabled:opacity-50"
            title="Reset to default editorial preset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Layout</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors shadow-lg shadow-accent/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Homepage</span>
          </a>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 bg-success/10 border border-success/20 rounded-lg text-success text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-danger/10 border border-danger/20 rounded-lg text-danger text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Section List Accordion */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-16 bg-surface rounded-xl border border-surface-border" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => {
            const isExpanded = expandedSection === section.section_key;

            return (
              <div
                key={section.id || section.section_key}
                className={`bg-surface border rounded-xl overflow-hidden transition-all shadow-sm ${
                  isExpanded ? "border-accent/40 shadow-md" : "border-surface-border hover:border-secondary/40"
                }`}
              >
                {/* Accordion Row Bar */}
                <div className="px-6 py-4 flex items-center justify-between gap-4 select-none">
                  <div className="flex items-center space-x-4 min-w-0">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, "up");
                        }}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-surface-raised text-secondary hover:text-accent disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, "down");
                        }}
                        disabled={index === sections.length - 1}
                        className="p-1 rounded hover:bg-surface-raised text-secondary hover:text-accent disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-secondary/60">#{index + 1}</span>
                        <h4 className="font-serif text-base text-primary font-medium truncate">
                          {section.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-secondary/70 truncate">
                        Section key: <span className="font-mono">{section.section_key}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {/* Live Visibility Button */}
                    <button
                      onClick={() => toggleVisibility(section.section_key, !section.is_visible)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                        section.is_visible
                          ? "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
                          : "bg-surface-raised text-secondary/60 border border-surface-border hover:text-secondary"
                      }`}
                    >
                      {section.is_visible ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpand(section.section_key)}
                      className="p-2 rounded-md hover:bg-surface-raised text-secondary hover:text-primary transition-colors"
                      title={isExpanded ? "Collapse settings" : "Edit section settings"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-accent" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Form Drawer */}
                {isExpanded && (
                  <div className="px-6 py-6 border-t border-surface-border bg-surface-raised/20 animate-in fade-in duration-200">
                    {renderSectionEditor(section)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
