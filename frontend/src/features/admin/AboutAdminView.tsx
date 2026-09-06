import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  User,
  BookOpen,
  Trash2,
} from "lucide-react";
import { useAboutCMS } from "./about/hooks/useAboutCMS";
import { AboutSection, PhotographerProfile } from "../about/types/about.types";
import { ImageUploaderInput } from "./components/ImageUploaderInput";

export const AboutAdminView: React.FC = () => {
  const {
    profile,
    sections,
    isLoading,
    isSaving,
    error,
    successMessage,
    updateProfile,
    updateSectionConfig,
    toggleVisibility,
    moveSection,
    resetToDefault,
  } = useAboutCMS();

  const [activeTab, setActiveTab] = useState<"profile" | "sections">("profile");
  const [expandedSection, setExpandedSection] = useState<string>("story");

  // Profile form state
  const [profileForm, setProfileForm] = useState<PhotographerProfile | null>(null);

  React.useEffect(() => {
    if (profile) {
      setProfileForm(profile);
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm) return;
    await updateProfile(profileForm);
  };

  const toggleExpand = (sectionKey: string) => {
    setExpandedSection((prev) => (prev === sectionKey ? "" : sectionKey));
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-secondary text-xs uppercase tracking-widest font-mono animate-pulse">
        Loading About CMS settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-accent text-xs uppercase tracking-widest font-mono">
            <span>VS-09 Module</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-primary mt-1">
            About & Profile CMS
          </h2>
          <p className="text-xs text-secondary mt-1">
            Curate photographer biography, artistic philosophy, bespoke services, working process, and verified testimonials.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={resetToDefault}
            disabled={isSaving}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs text-secondary hover:text-danger hover:bg-danger/10 rounded-md transition-colors border border-surface-border"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-surface-raised border border-surface-border hover:border-accent text-primary text-xs rounded-md font-medium transition-all shadow-sm"
          >
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-center space-x-3 text-danger text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-3 text-success text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-surface-border pb-px">
        <button
          onClick={() => setActiveTab("profile")}
          className={`inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-medium border-b-2 transition-all ${
            activeTab === "profile"
              ? "border-accent text-accent bg-accent/5 rounded-t-md"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Photographer Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("sections")}
          className={`inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-medium border-b-2 transition-all ${
            activeTab === "sections"
              ? "border-accent text-accent bg-accent/5 rounded-t-md"
              : "border-transparent text-secondary hover:text-primary"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Story & Sections ({sections.length})</span>
        </button>
      </div>

      {/* Tab 1: Photographer Profile */}
      {activeTab === "profile" && profileForm && (
        <form onSubmit={handleProfileSubmit} className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface p-6 rounded-xl border border-surface-border">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Display Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.display_name}
                onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2.5 text-sm text-primary font-serif focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Professional Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.professional_title}
                onChange={(e) => setProfileForm({ ...profileForm, professional_title: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Studio Location / Base
              </label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Short Bio / Pitch Statement <span className="text-accent">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={profileForm.short_bio}
                onChange={(e) => setProfileForm({ ...profileForm, short_bio: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Years of Experience
              </label>
              <input
                type="number"
                value={profileForm.years_experience}
                onChange={(e) => setProfileForm({ ...profileForm, years_experience: parseInt(e.target.value) || 0 })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Direct Inquiries Email
              </label>
              <input
                type="email"
                value={profileForm.email || ""}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploaderInput
                label="Profile Portrait Photo"
                required
                value={profileForm.profile_image_url}
                onChange={(url) => setProfileForm({ ...profileForm, profile_image_url: url })}
                helpText="Upload a portrait photo from your computer (JPEG, PNG, WebP) or paste an image link."
                aspectRatio="aspect-[3/4]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Profile..." : "Save Profile Changes"}</span>
          </button>
        </form>
      )}

      {/* Tab 2: Story, Philosophy, Services, Process, Testimonials, Social Sections */}
      {activeTab === "sections" && (
        <div className="space-y-4 max-w-4xl">
          {sections.map((section: AboutSection, idx: number) => {
            const isExpanded = expandedSection === section.section_key;

            return (
              <div
                key={section.id}
                className={`bg-surface border rounded-xl overflow-hidden transition-all duration-200 ${
                  isExpanded
                    ? "border-accent/40 shadow-xl"
                    : "border-surface-border hover:border-surface-border/80"
                }`}
              >
                {/* Accordion Bar */}
                <div
                  onClick={() => toggleExpand(section.section_key)}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer select-none bg-surface hover:bg-surface-raised/50"
                >
                  <div className="flex items-center space-x-4">
                    <span className="w-6 h-6 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center text-[10px] font-mono text-secondary">
                      {section.sort_order}
                    </span>

                    <div>
                      <h4 className="font-serif text-base font-normal text-primary">
                        {section.title}
                      </h4>
                      <p className="text-[10px] text-secondary font-mono uppercase tracking-wider">
                        {section.section_key}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                    {/* Move Up/Down */}
                    <div className="flex items-center space-x-1 border-r border-surface-border pr-3">
                      <button
                        type="button"
                        onClick={() => moveSection(section.section_key, "up")}
                        disabled={idx === 0}
                        className="p-1 text-secondary hover:text-primary disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(section.section_key, "down")}
                        disabled={idx === sections.length - 1}
                        className="p-1 text-secondary hover:text-primary disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleVisibility(section.section_key, section.is_visible)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        section.is_visible
                          ? "bg-success/10 text-success"
                          : "bg-surface-raised text-secondary"
                      }`}
                    >
                      {section.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{section.is_visible ? "Visible" : "Hidden"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(section.section_key)}
                      className="text-secondary hover:text-primary p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Section Editor */}
                {isExpanded && (
                  <div className="p-6 border-t border-surface-border bg-surface-raised/20">
                    <SectionEditor
                      section={section}
                      onSave={(cfg, title, vis) =>
                        updateSectionConfig(section.section_key, cfg, title, vis)
                      }
                      isSaving={isSaving}
                    />
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

// Generic / Contextual Section Form
const SectionEditor: React.FC<{
  section: AboutSection;
  onSave: (config: Record<string, any>, title?: string, isVisible?: boolean) => Promise<void>;
  isSaving: boolean;
}> = ({ section, onSave, isSaving }) => {
  const [config, setConfig] = useState<Record<string, any>>({ ...section.configuration });
  const [title, setTitle] = useState(section.title);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(config, title, section.is_visible);
  };

  switch (section.section_key) {
    case "story":
      return (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Section Title (Admin Label)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={config.eyebrow || ""}
                onChange={(e) => setConfig({ ...config, eyebrow: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Story Heading
              </label>
              <input
                type="text"
                value={config.heading || ""}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-serif"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Editorial Narrative Paragraphs
            </label>
            {(config.paragraphs || []).map((p: string, idx: number) => (
              <textarea
                key={idx}
                rows={3}
                value={p}
                onChange={(e) => {
                  const updated = [...(config.paragraphs || [])];
                  updated[idx] = e.target.value;
                  setConfig({ ...config, paragraphs: updated });
                }}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary mb-2"
              />
            ))}
          </div>

          <ImageUploaderInput
            label="Story Feature Photograph"
            value={config.image_url || ""}
            onChange={(url) => setConfig({ ...config, image_url: url })}
            helpText="Upload an editorial photograph from your computer or choose from library."
            aspectRatio="aspect-[3/4]"
          />

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-accent-hover transition-colors"
          >
            Save Story Section
          </button>
        </form>
      );

    case "philosophy":
      return (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Heading
              </label>
              <input
                type="text"
                value={config.heading || ""}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-serif"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                Philosophy Description
              </label>
              <input
                type="text"
                value={config.description || ""}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary"
              />
            </div>
          </div>

          {/* Principles List */}
          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Core Principles ({config.principles?.length || 0})
            </label>
            {(config.principles || []).map((pr: any, idx: number) => (
              <div key={idx} className="p-3 bg-surface rounded border border-surface-border space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-accent">{pr.number}</span>
                  <input
                    type="text"
                    value={pr.title}
                    onChange={(e) => {
                      const updated = [...config.principles];
                      updated[idx].title = e.target.value;
                      setConfig({ ...config, principles: updated });
                    }}
                    className="flex-1 bg-surface-raised border border-surface-border rounded px-2 py-1 text-xs text-primary font-medium"
                  />
                </div>
                <textarea
                  rows={2}
                  value={pr.description}
                  onChange={(e) => {
                    const updated = [...config.principles];
                    updated[idx].description = e.target.value;
                    setConfig({ ...config, principles: updated });
                  }}
                  className="w-full bg-surface-raised border border-surface-border rounded px-2 py-1 text-xs text-secondary"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-accent-hover transition-colors"
          >
            Save Philosophy Principles
          </button>
        </form>
      );

    case "services":
      return (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Services Heading
            </label>
            <input
              type="text"
              value={config.heading || ""}
              onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-serif"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Configured Offerings ({config.services?.length || 0})
            </label>
            {(config.services || []).map((srv: any, idx: number) => (
              <div key={srv.id || idx} className="p-4 bg-surface rounded-lg border border-surface-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-accent font-bold">{srv.number}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = config.services.filter((_: any, i: number) => i !== idx);
                      setConfig({ ...config, services: updated });
                    }}
                    className="text-secondary hover:text-danger p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={srv.title}
                  onChange={(e) => {
                    const updated = [...config.services];
                    updated[idx].title = e.target.value;
                    setConfig({ ...config, services: updated });
                  }}
                  className="w-full bg-surface-raised border border-surface-border rounded px-3 py-1.5 text-xs text-primary font-medium"
                />
                <textarea
                  rows={2}
                  value={srv.short_description}
                  onChange={(e) => {
                    const updated = [...config.services];
                    updated[idx].short_description = e.target.value;
                    setConfig({ ...config, services: updated });
                  }}
                  className="w-full bg-surface-raised border border-surface-border rounded px-3 py-1.5 text-xs text-secondary"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-accent-hover transition-colors"
          >
            Save Services Offerings
          </button>
        </form>
      );

    case "process":
      return (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Process Heading
            </label>
            <input
              type="text"
              value={config.heading || ""}
              onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              className="w-full bg-surface-raised border border-surface-border rounded-md px-4 py-2 text-xs text-primary font-serif"
            />
          </div>

          <div className="space-y-2">
            {(config.steps || []).map((st: any, idx: number) => (
              <div key={idx} className="p-3 bg-surface rounded border border-surface-border flex items-start space-x-3">
                <span className="text-xs font-mono text-accent font-bold pt-1">{st.step}</span>
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => {
                      const updated = [...config.steps];
                      updated[idx].title = e.target.value;
                      setConfig({ ...config, steps: updated });
                    }}
                    className="w-full bg-surface-raised border border-surface-border rounded px-2 py-1 text-xs text-primary font-medium"
                  />
                  <textarea
                    rows={2}
                    value={st.description}
                    onChange={(e) => {
                      const updated = [...config.steps];
                      updated[idx].description = e.target.value;
                      setConfig({ ...config, steps: updated });
                    }}
                    className="w-full bg-surface-raised border border-surface-border rounded px-2 py-1 text-xs text-secondary"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-accent-hover transition-colors"
          >
            Save Process Steps
          </button>
        </form>
      );

    case "testimonials":
      return (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3">
            {(config.testimonials || []).map((t: any, idx: number) => (
              <div key={t.id || idx} className="p-4 bg-surface rounded-lg border border-surface-border space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Client Names (e.g. Sophia & Marc)"
                    value={t.client_names}
                    onChange={(e) => {
                      const updated = [...config.testimonials];
                      updated[idx].client_names = e.target.value;
                      setConfig({ ...config, testimonials: updated });
                    }}
                    className="bg-surface-raised border border-surface-border rounded px-3 py-1.5 text-xs text-primary font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Event or Commission Type"
                    value={t.event_type}
                    onChange={(e) => {
                      const updated = [...config.testimonials];
                      updated[idx].event_type = e.target.value;
                      setConfig({ ...config, testimonials: updated });
                    }}
                    className="bg-surface-raised border border-surface-border rounded px-3 py-1.5 text-xs text-secondary"
                  />
                </div>
                <textarea
                  rows={3}
                  value={t.quote}
                  onChange={(e) => {
                    const updated = [...config.testimonials];
                    updated[idx].quote = e.target.value;
                    setConfig({ ...config, testimonials: updated });
                  }}
                  className="w-full bg-surface-raised border border-surface-border rounded px-3 py-1.5 text-xs text-secondary italic"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-accent-hover transition-colors"
          >
            Save Testimonials
          </button>
        </form>
      );

    case "social":
      return (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            {(config.profiles || []).map((soc: any, idx: number) => (
              <div key={idx} className="p-3 bg-surface rounded border border-surface-border flex items-center space-x-3">
                <span className="text-xs font-medium text-accent w-24">{soc.platform}</span>
                <input
                  type="text"
                  value={soc.label}
                  onChange={(e) => {
                    const updated = [...config.profiles];
                    updated[idx].label = e.target.value;
                    setConfig({ ...config, profiles: updated });
                  }}
                  placeholder="Handle or Label"
                  className="bg-surface-raised border border-surface-border rounded px-2 py-1 text-xs text-primary flex-1"
                />
                <input
                  type="url"
                  value={soc.url}
                  onChange={(e) => {
                    const updated = [...config.profiles];
                    updated[idx].url = e.target.value;
                    setConfig({ ...config, profiles: updated });
                  }}
                  placeholder="https://..."
                  className="bg-surface-raised border border-surface-border rounded px-2 py-1 text-xs text-secondary flex-1 font-mono"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold rounded hover:bg-accent-hover transition-colors"
          >
            Save Social Links
          </button>
        </form>
      );

    default:
      return null;
  }
};
