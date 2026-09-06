import React, { useState, useEffect } from "react";
import {
  Search,
  Globe,
  FileText,
  FolderKanban,
  Eye,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Share2,
} from "lucide-react";
import { seoApi } from "../../../services/seoApi";
import { projectService } from "../../projects/services/projectService";
import { GlobalSeoConfig, PageSeoEntity, ProjectSeoEntity } from "../../../types/seo";
import { Project } from "../../projects/types/project.types";

type SeoTab = "global" | "pages" | "projects" | "preview" | "sitemap";

export const SeoAdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SeoTab>("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Global SEO State
  const [globalSeo, setGlobalSeo] = useState<GlobalSeoConfig>({
    site_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    default_og_title: "",
    default_og_description: "",
    default_og_image_url: "",
    twitter_card_type: "summary_large_image",
    robots_index: true,
    robots_follow: true,
    google_verification_code: "",
    bing_verification_code: "",
  });

  // Pages SEO State
  const [pageSeoList, setPageSeoList] = useState<PageSeoEntity[]>([]);
  const [selectedPageKey, setSelectedPageKey] = useState<string>("home");

  // Projects SEO State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [currentProjectSeo, setCurrentProjectSeo] = useState<ProjectSeoEntity | null>(null);

  // Sitemap & Robots info
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [globalData, pagesData, projsData] = await Promise.all([
        seoApi.getGlobalSeo(),
        seoApi.getAllPageSeo(),
        projectService.getProjects(),
      ]);

      setGlobalSeo(globalData);
      setPageSeoList(pagesData);
      setProjects(projsData);

      if (projsData.length > 0) {
        setSelectedProjectId(projsData[0].id);
        const projSeo = await seoApi.getProjectSeo(projsData[0].id);
        setCurrentProjectSeo(projSeo);
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Failed to load SEO configuration.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Switch selected project
  const handleSelectProject = async (id: string) => {
    setSelectedProjectId(id);
    try {
      const projSeo = await seoApi.getProjectSeo(id);
      setCurrentProjectSeo(projSeo);
    } catch {
      // Handled
    }
  };

  // Save Global SEO
  const handleSaveGlobal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const updated = await seoApi.updateGlobalSeo(globalSeo);
      setGlobalSeo(updated);
      showToast("success", "Global search & discovery metadata successfully updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update global SEO.");
    } finally {
      setSaving(false);
    }
  };

  // Save Page SEO
  const handleSavePageSeo = async (page: PageSeoEntity) => {
    try {
      setSaving(true);
      const updated = await seoApi.updatePageSeo(page.page_key, page);
      setPageSeoList(pageSeoList.map((p) => (p.page_key === page.page_key ? updated : p)));
      showToast("success", `SEO for '${page.page_name || page.page_key}' saved.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update page SEO.");
    } finally {
      setSaving(false);
    }
  };

  // Save Project SEO
  const handleSaveProjectSeo = async () => {
    if (!currentProjectSeo || !selectedProjectId) return;
    try {
      setSaving(true);
      const updated = await seoApi.updateProjectSeo(selectedProjectId, currentProjectSeo);
      setCurrentProjectSeo(updated);
      showToast("success", "Project story metadata updated successfully.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update project SEO.");
    } finally {
      setSaving(false);
    }
  };

  const getTitleStatus = (length: number) => {
    if (length === 0) return { label: "Empty", color: "text-rose-400" };
    if (length < 30) return { label: "Too Short (Min 30)", color: "text-amber-400" };
    if (length > 60) return { label: "Long (Max 60)", color: "text-amber-400" };
    return { label: "Optimal Length", color: "text-emerald-400" };
  };

  const getDescriptionStatus = (length: number) => {
    if (length === 0) return { label: "Empty", color: "text-rose-400" };
    if (length < 100) return { label: "Short (Min 120)", color: "text-amber-400" };
    if (length > 160) return { label: "Too Long (Max 160)", color: "text-amber-400" };
    return { label: "Optimal Length", color: "text-emerald-400" };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-secondary font-mono">
          Loading SEO & Discovery Engine...
        </p>
      </div>
    );
  }

  const selectedPage =
    pageSeoList.find((p) => p.page_key === selectedPageKey) || pageSeoList[0];

  const previewTitle =
    activeTab === "pages" && selectedPage
      ? selectedPage.seo_title || globalSeo.site_title
      : activeTab === "projects" && currentProjectSeo
      ? currentProjectSeo.seo_title || globalSeo.site_title
      : globalSeo.site_title;

  const previewDescription =
    activeTab === "pages" && selectedPage
      ? selectedPage.meta_description || globalSeo.meta_description
      : activeTab === "projects" && currentProjectSeo
      ? currentProjectSeo.meta_description || globalSeo.meta_description
      : globalSeo.meta_description;

  const previewImage =
    activeTab === "projects" && currentProjectSeo?.og_image_url
      ? currentProjectSeo.og_image_url
      : globalSeo.default_og_image_url;

  const previewUrl =
    activeTab === "pages" && selectedPage
      ? `${globalSeo.canonical_url || "https://alexmercer.photography"}/${selectedPage.page_key === "home" ? "" : selectedPage.page_key}`
      : activeTab === "projects" && currentProjectSeo?.project_slug
      ? `${globalSeo.canonical_url || "https://alexmercer.photography"}/portfolio/${currentProjectSeo.project_slug}`
      : globalSeo.canonical_url || "https://alexmercer.photography";

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 text-accent text-xs uppercase tracking-[0.25em] font-mono">
            <Search className="w-3.5 h-3.5" />
            <span>VS-12 Search Engine & Social Optimization</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-primary mt-1">
            SEO, Social Cards & Sitemap
          </h1>
          <p className="text-xs text-secondary mt-1">
            Configure metadata, structured schemas, Google snippets, OpenGraph previews, and search engine crawlers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (activeTab === "global") handleSaveGlobal();
              if (activeTab === "pages" && selectedPage) handleSavePageSeo(selectedPage);
              if (activeTab === "projects") handleSaveProjectSeo();
            }}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-accent text-background text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-3 text-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/40 border border-rose-500/30 text-rose-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-surface border border-surface-border rounded-xl">
        {[
          { key: "global" as SeoTab, label: "Global SEO", icon: Globe },
          { key: "pages" as SeoTab, label: "Page SEO", icon: FileText },
          { key: "projects" as SeoTab, label: "Project SEO", icon: FolderKanban },
          { key: "preview" as SeoTab, label: "SERP & Social Preview", icon: Eye },
          { key: "sitemap" as SeoTab, label: "Sitemap & Robots", icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-accent/15 text-accent border border-accent/30 font-semibold shadow-sm"
                  : "text-secondary hover:text-primary hover:bg-white/[0.03]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GLOBAL SEO */}
      {activeTab === "global" && (
        <form onSubmit={handleSaveGlobal} className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="text-base font-serif font-medium text-primary">
                Global Website Search Identity
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Default metadata tags used when individual pages or projects do not specify overrides.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-secondary">
                    Global Site Title Tag *
                  </label>
                  <span className={`text-[10px] font-mono ${getTitleStatus(globalSeo.site_title.length).color}`}>
                    {globalSeo.site_title.length} chars — {getTitleStatus(globalSeo.site_title.length).label}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={globalSeo.site_title}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, site_title: e.target.value })}
                  placeholder="Alex Mercer — Luxury Editorial & Destination Wedding Photography"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-secondary">
                    Global Meta Description *
                  </label>
                  <span className={`text-[10px] font-mono ${getDescriptionStatus(globalSeo.meta_description.length).color}`}>
                    {globalSeo.meta_description.length} chars — {getDescriptionStatus(globalSeo.meta_description.length).label}
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={globalSeo.meta_description}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, meta_description: e.target.value })}
                  placeholder="Bespoke fine art, architectural monograph, and high-fashion photography based in Paris..."
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Canonical Website Base URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={globalSeo.canonical_url}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, canonical_url: e.target.value })}
                    placeholder="https://alexmercer.photography"
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Meta Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={globalSeo.meta_keywords}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, meta_keywords: e.target.value })}
                    placeholder="luxury photography, editorial, lake como wedding"
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Default OG Title (Social Share)
                  </label>
                  <input
                    type="text"
                    value={globalSeo.default_og_title}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, default_og_title: e.target.value })}
                    placeholder="Alex Mercer Studio Atelier — Fine Art Photography"
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Default OG Image URL (1200x630)
                  </label>
                  <input
                    type="url"
                    value={globalSeo.default_og_image_url}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, default_og_image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Google Site Verification Code
                  </label>
                  <input
                    type="text"
                    value={globalSeo.google_verification_code || ""}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, google_verification_code: e.target.value })}
                    placeholder="google-site-verification=xxxxxx"
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Bing Webmaster Verification Code
                  </label>
                  <input
                    type="text"
                    value={globalSeo.bing_verification_code || ""}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, bing_verification_code: e.target.value })}
                    placeholder="msvalidate.01=xxxxxx"
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="border-t border-surface-border pt-4 flex flex-wrap items-center gap-6">
                <label className="flex items-center space-x-2 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={globalSeo.robots_index}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, robots_index: e.target.checked })}
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Allow Search Engines to Index (robots: index)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={globalSeo.robots_follow}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, robots_follow: e.target.checked })}
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Follow Internal Links (robots: follow)</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: PAGE SPECIFIC SEO */}
      {activeTab === "pages" && selectedPage && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {pageSeoList.map((p) => (
              <button
                key={p.page_key}
                onClick={() => setSelectedPageKey(p.page_key)}
                className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                  selectedPageKey === p.page_key
                    ? "bg-accent text-background font-semibold"
                    : "bg-surface border border-surface-border text-secondary hover:text-primary"
                }`}
              >
                {p.page_name || p.page_key}
              </button>
            ))}
          </div>

          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-medium text-primary">
                  {selectedPage.page_name || selectedPage.page_key} — Page Metadata
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Route: /{selectedPage.page_key === "home" ? "" : selectedPage.page_key}
                </p>
              </div>
              <button
                onClick={() => handleSavePageSeo(selectedPage)}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-accent text-background text-xs font-semibold uppercase tracking-wider hover:bg-accent-hover transition-all"
              >
                Save Page SEO
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-secondary">
                    Page SEO Title Tag *
                  </label>
                  <span className={`text-[10px] font-mono ${getTitleStatus(selectedPage.seo_title.length).color}`}>
                    {selectedPage.seo_title.length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={selectedPage.seo_title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPageSeoList(
                      pageSeoList.map((p) =>
                        p.page_key === selectedPage.page_key ? { ...p, seo_title: val } : p
                      )
                    );
                  }}
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-secondary">
                    Meta Description
                  </label>
                  <span className={`text-[10px] font-mono ${getDescriptionStatus(selectedPage.meta_description.length).color}`}>
                    {selectedPage.meta_description.length} chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={selectedPage.meta_description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPageSeoList(
                      pageSeoList.map((p) =>
                        p.page_key === selectedPage.page_key ? { ...p, meta_description: val } : p
                      )
                    );
                  }}
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Open Graph Title
                  </label>
                  <input
                    type="text"
                    value={selectedPage.og_title || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPageSeoList(
                        pageSeoList.map((p) =>
                          p.page_key === selectedPage.page_key ? { ...p, og_title: val } : p
                        )
                      );
                    }}
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                    Open Graph Image URL
                  </label>
                  <input
                    type="url"
                    value={selectedPage.og_image_url || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPageSeoList(
                        pageSeoList.map((p) =>
                          p.page_key === selectedPage.page_key ? { ...p, og_image_url: val } : p
                        )
                      );
                    }}
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT SPECIFIC SEO */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border pb-4 gap-4">
              <div>
                <h3 className="text-base font-serif font-medium text-primary">
                  Project Story SEO & Social Curation
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Select any visual monograph to customize how it previews when shared.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="bg-background border border-surface-border rounded-lg px-4 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} ({proj.slug})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSaveProjectSeo}
                  disabled={saving || !currentProjectSeo}
                  className="px-4 py-2 rounded-lg bg-accent text-background text-xs font-semibold uppercase tracking-wider hover:bg-accent-hover transition-all"
                >
                  Save Project SEO
                </button>
              </div>
            </div>

            {currentProjectSeo ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-secondary">
                      Project Story Title Tag
                    </label>
                    <span className={`text-[10px] font-mono ${getTitleStatus(currentProjectSeo.seo_title?.length || 0).color}`}>
                      {currentProjectSeo.seo_title?.length || 0} chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentProjectSeo.seo_title || ""}
                    onChange={(e) =>
                      setCurrentProjectSeo({ ...currentProjectSeo, seo_title: e.target.value })
                    }
                    placeholder="e.g. Lake Como Celebrations — Visual Story | Alex Mercer"
                    className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-secondary">
                      Project Story Meta Description
                    </label>
                    <span className={`text-[10px] font-mono ${getDescriptionStatus(currentProjectSeo.meta_description?.length || 0).color}`}>
                      {currentProjectSeo.meta_description?.length || 0} chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={currentProjectSeo.meta_description || ""}
                    onChange={(e) =>
                      setCurrentProjectSeo({ ...currentProjectSeo, meta_description: e.target.value })
                    }
                    placeholder="Bespoke wedding monograph capturing monumental architectural form and emotional storytelling..."
                    className="w-full bg-background border border-surface-border rounded-lg p-3 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                      Social Card Image URL (OG Image)
                    </label>
                    <input
                      type="url"
                      value={currentProjectSeo.og_image_url || ""}
                      onChange={(e) =>
                        setCurrentProjectSeo({ ...currentProjectSeo, og_image_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                      Canonical Target URL
                    </label>
                    <input
                      type="url"
                      value={currentProjectSeo.canonical_url || ""}
                      onChange={(e) =>
                        setCurrentProjectSeo({ ...currentProjectSeo, canonical_url: e.target.value })
                      }
                      placeholder="https://alexmercer.photography/portfolio/..."
                      className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-surface-border pt-4">
                  <label className="flex items-center space-x-2 text-xs text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProjectSeo.robots_index}
                      onChange={(e) =>
                        setCurrentProjectSeo({ ...currentProjectSeo, robots_index: e.target.checked })
                      }
                      className="rounded border-surface-border text-accent focus:ring-accent"
                    />
                    <span>Allow Google to index this project in public search results</span>
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-xs text-secondary py-8 text-center">Select a project to configure SEO.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PREVIEWS */}
      {activeTab === "preview" && (
        <div className="space-y-8">
          {/* Google SERP Snippet Preview */}
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">
                Google Search Result Preview
              </span>
              <span className="text-[10px] text-secondary font-mono">Desktop & Mobile SERP</span>
            </div>

            <div className="p-6 rounded-xl bg-[#202124] text-left max-w-2xl font-sans space-y-1.5 shadow-xl border border-white/5">
              <div className="flex items-center space-x-2 text-xs text-[#bdc1c6]">
                <div className="w-4 h-4 rounded-full bg-surface-raised flex items-center justify-center text-[9px] text-[#9aa0a6]">
                  A
                </div>
                <span className="truncate">{previewUrl}</span>
              </div>
              <h4 className="text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                {previewTitle || "Alex Mercer — Luxury Photography"}
              </h4>
              <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
                {previewDescription ||
                  "Bespoke fine art, architectural monograph, and high-fashion wedding photography available for worldwide commissions."}
              </p>
            </div>
          </div>

          {/* Social Share / OpenGraph Card Preview */}
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent font-bold">
                Social Media Card (iMessage, X/Twitter, Facebook, LinkedIn)
              </span>
              <span className="text-[10px] text-secondary font-mono">1200 x 630 Ratio</span>
            </div>

            <div className="max-w-lg rounded-2xl bg-[#0c0c10] border border-white/10 overflow-hidden shadow-2xl">
              <div className="aspect-[1.91/1] w-full bg-surface-raised relative overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Social Card" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
                    No image configured
                  </div>
                )}
              </div>
              <div className="p-5 space-y-1.5 bg-[#14141a]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-secondary/70">
                  {new URL(previewUrl).hostname}
                </span>
                <h4 className="font-serif text-base text-primary font-medium truncate">
                  {previewTitle}
                </h4>
                <p className="text-xs text-secondary line-clamp-2 leading-relaxed font-light">
                  {previewDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SITEMAP & ROBOTS */}
      {activeTab === "sitemap" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sitemap Card */}
          <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="font-serif text-base text-primary">Dynamic XML Sitemap</h3>
              </div>
              <a
                href="/sitemap.xml"
                target="_blank"
                className="text-xs text-accent hover:underline flex items-center space-x-1"
              >
                <span>Live /sitemap.xml</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Automatically generates and serves XML index of all published, indexable portfolio stories, curated about pages, and services for Google search bots.
            </p>

            <div className="p-3.5 bg-background rounded-lg border border-surface-border text-xs font-mono text-secondary space-y-1">
              <p>• Automatically includes: Home, Portfolio, About, Contact</p>
              <p>• Automatically includes: {projects.filter((p) => p.is_published).length} Published Projects</p>
              <p>• Excludes: /admin/*, draft stories, hidden client galleries</p>
            </div>

            <button
              onClick={async () => {
                await navigator.clipboard.writeText(`${window.location.origin}/sitemap.xml`);
                setCopiedSitemap(true);
                setTimeout(() => setCopiedSitemap(false), 2000);
              }}
              className="w-full py-2.5 rounded-lg bg-surface-raised border border-surface-border hover:border-accent/40 text-xs font-medium text-primary flex items-center justify-center space-x-2 transition-colors"
            >
              {copiedSitemap ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSitemap ? "Sitemap URL Copied" : "Copy Sitemap Link for Google Console"}</span>
            </button>
          </div>

          {/* Robots.txt Card */}
          <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-accent" />
                <h3 className="font-serif text-base text-primary">Robots.txt Directives</h3>
              </div>
              <a
                href="/robots.txt"
                target="_blank"
                className="text-xs text-accent hover:underline flex items-center space-x-1"
              >
                <span>Live /robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Provides search crawler indexing directives, protects private API endpoints and admin directories, and points bots to your sitemap.
            </p>

            <pre className="p-3.5 bg-background rounded-lg border border-surface-border text-[11px] font-mono text-emerald-400/90 overflow-x-auto leading-relaxed">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${globalSeo.canonical_url || "https://alexmercer.photography"}/sitemap.xml`}
            </pre>

            <button
              onClick={async () => {
                await navigator.clipboard.writeText(`${window.location.origin}/robots.txt`);
                setCopiedRobots(true);
                setTimeout(() => setCopiedRobots(false), 2000);
              }}
              className="w-full py-2.5 rounded-lg bg-surface-raised border border-surface-border hover:border-accent/40 text-xs font-medium text-primary flex items-center justify-center space-x-2 transition-colors"
            >
              {copiedRobots ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRobots ? "Robots URL Copied" : "Copy Robots.txt URL"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
