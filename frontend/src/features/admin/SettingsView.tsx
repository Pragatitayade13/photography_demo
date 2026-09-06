import React, { useState, useEffect } from "react";
import {
  Settings,
  Sparkles,
  Mail,
  Compass,
  Share2,
  Layout,
  Search,
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Camera,
  RefreshCw,
  Lock,
} from "lucide-react";
import { settingsApi } from "../../services/settingsApi";
import {
  AllAdminSettings,
  GeneralSettings,
  BrandingSettings,
  ContactSettings,
  AdvancedSettings,
  NavigationItem,
  SocialLink,
  FooterSettings,
  SeoSettings,
} from "../../types/settings";

type TabKey =
  | "general"
  | "branding"
  | "contact"
  | "navigation"
  | "social"
  | "footer"
  | "seo"
  | "advanced";

interface SettingsViewProps {
  initialTab?: TabKey;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab = "general" }) => {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form States
  const [general, setGeneral] = useState<GeneralSettings>({
    site_name: "",
    photographer_name: "",
    tagline: "",
    description: "",
    website_status: "ACTIVE",
    default_cta_text: "",
    default_cta_url: "",
    location: "",
    timezone: "Europe/Paris",
  });

  const [branding, setBranding] = useState<BrandingSettings>({
    brand_name: "",
    brand_tagline: "",
    logo_url: "",
    logo_dark_url: "",
    logo_light_url: "",
    favicon_url: "",
    og_image_url: "",
  });

  const [contact, setContact] = useState<ContactSettings>({
    public_email: "",
    public_phone: "",
    whatsapp_number: "",
    location: "",
    availability_text: "",
    response_time_text: "",
    business_hours: "",
  });

  const [advanced, setAdvanced] = useState<AdvancedSettings>({
    website_status: "ACTIVE",
    maintenance_message: "",
    analytics_id: "",
    enable_public_enquiries: true,
  });

  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const [footer, setFooter] = useState<FooterSettings>({
    description: "",
    copyright_text: "",
    show_social_links: true,
    show_contact: true,
    show_navigation: true,
  });

  const [seo, setSeo] = useState<SeoSettings>({
    site_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image_url: "",
    twitter_title: "",
    twitter_description: "",
    robots_index: true,
    robots_follow: true,
  });

  // Modal / Item Add States
  const [newNavItem, setNewNavItem] = useState({
    label: "",
    url: "",
    type: "INTERNAL" as "INTERNAL" | "EXTERNAL" | "ANCHOR",
    open_new_tab: false,
    is_visible: true,
  });
  const [showAddNav, setShowAddNav] = useState(false);

  const [newSocialItem, setNewSocialItem] = useState({
    platform: "Instagram",
    label: "",
    url: "",
    icon: "instagram",
    is_visible: true,
  });
  const [showAddSocial, setShowAddSocial] = useState(false);

  // Load All Settings
  const loadSettings = async () => {
    try {
      setLoading(true);
      const data: AllAdminSettings = await settingsApi.getAllAdminSettings();
      if (data) {
        setGeneral(data.general);
        setBranding(data.branding);
        setContact(data.contact);
        setAdvanced(data.advanced);
        setNavigation(data.navigation || []);
        setSocialLinks(data.social_links || []);
        setFooter(data.footer);
        setSeo(data.seo);
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err?.message || "Failed to load studio settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Save Handlers
  const handleSaveGeneral = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.updateGeneralSettings(general);
      showToast("success", "General settings successfully updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update general settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBranding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.updateBrandingSettings(branding);
      showToast("success", "Branding assets & visual identity updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update branding settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.updateContactSettings(contact);
      showToast("success", "Contact & representation parameters updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update contact settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFooter = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.updateFooterSettings(footer);
      showToast("success", "Footer layout & copyright settings updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update footer settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.updateSeoSettings(seo);
      showToast("success", "SEO & Open Graph metadata updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update SEO settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAdvanced = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await settingsApi.updateAdvancedSettings(advanced);
      showToast("success", "Advanced & maintenance settings updated.");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update advanced settings.");
    } finally {
      setSaving(false);
    }
  };

  // Navigation Item Actions
  const handleAddNav = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNavItem.label || !newNavItem.url) return;
    try {
      setSaving(true);
      const created = await settingsApi.createNavigationItem({
        ...newNavItem,
        sort_order: navigation.length + 1,
      });
      setNavigation([...navigation, created]);
      setNewNavItem({
        label: "",
        url: "",
        type: "INTERNAL",
        open_new_tab: false,
        is_visible: true,
      });
      setShowAddNav(false);
      showToast("success", `Navigation item '${created.label}' created.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to create navigation item.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNavVisibility = async (item: NavigationItem) => {
    try {
      const updated = await settingsApi.updateNavigationItem(item.id, {
        is_visible: !item.is_visible,
      });
      setNavigation(navigation.map((n) => (n.id === item.id ? updated : n)));
      showToast("success", `Updated '${item.label}' visibility.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update visibility.");
    }
  };

  const handleDeleteNav = async (id: string, label: string) => {
    if (!window.confirm(`Are you sure you want to delete '${label}' from navigation?`)) return;
    try {
      await settingsApi.deleteNavigationItem(id);
      setNavigation(navigation.filter((n) => n.id !== id));
      showToast("success", `Removed '${label}' from navigation.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete navigation item.");
    }
  };

  const handleMoveNav = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navigation.length) return;

    const newItems = [...navigation];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reorderPayload = newItems.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1,
    }));

    try {
      const reordered = await settingsApi.reorderNavigation(reorderPayload);
      setNavigation(reordered);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to reorder navigation.");
    }
  };

  // Social Links Actions
  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialItem.label || !newSocialItem.url) return;
    try {
      setSaving(true);
      const created = await settingsApi.createSocialLink({
        ...newSocialItem,
        sort_order: socialLinks.length + 1,
      });
      setSocialLinks([...socialLinks, created]);
      setNewSocialItem({
        platform: "Instagram",
        label: "",
        url: "",
        icon: "instagram",
        is_visible: true,
      });
      setShowAddSocial(false);
      showToast("success", `Social link '${created.platform}' added.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to add social link.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSocialVisibility = async (item: SocialLink) => {
    try {
      const updated = await settingsApi.updateSocialLink(item.id, {
        is_visible: !item.is_visible,
      });
      setSocialLinks(socialLinks.map((s) => (s.id === item.id ? updated : s)));
      showToast("success", `Updated '${item.platform}' visibility.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update social link.");
    }
  };

  const handleDeleteSocial = async (id: string, platform: string) => {
    if (!window.confirm(`Delete social link for '${platform}'?`)) return;
    try {
      await settingsApi.deleteSocialLink(id);
      setSocialLinks(socialLinks.filter((s) => s.id !== id));
      showToast("success", `Deleted '${platform}' link.`);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to delete social link.");
    }
  };

  const handleMoveSocial = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;

    const newItems = [...socialLinks];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reorderPayload = newItems.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1,
    }));

    try {
      const reordered = await settingsApi.reorderSocialLinks(reorderPayload);
      setSocialLinks(reordered);
    } catch (err: any) {
      showToast("error", err?.message || "Failed to reorder social links.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
        <p className="text-xs uppercase tracking-widest text-secondary font-mono">
          Loading Global Studio Configuration...
        </p>
      </div>
    );
  }

  const tabs: Array<{ key: TabKey; label: string; icon: any }> = [
    { key: "general", label: "General", icon: Sliders },
    { key: "branding", label: "Branding", icon: Sparkles },
    { key: "contact", label: "Contact", icon: Mail },
    { key: "navigation", label: "Navigation", icon: Compass },
    { key: "social", label: "Social Media", icon: Share2 },
    { key: "footer", label: "Footer", icon: Layout },
    { key: "seo", label: "SEO & Social", icon: Search },
    { key: "advanced", label: "Advanced", icon: Lock },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
        <div>
          <div className="flex items-center space-x-2 text-accent text-xs uppercase tracking-[0.25em] font-mono">
            <Settings className="w-3.5 h-3.5" />
            <span>VS-11 Global Content Management</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-primary mt-1">
            Site Settings & Global Branding
          </h1>
          <p className="text-xs text-secondary mt-1">
            Centralized control plane for visual identity, studio representation, navigation, social channels, and search engine discovery.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-surface border border-surface-border text-xs uppercase tracking-wider text-secondary hover:text-accent hover:border-accent/40 transition-all shadow-sm"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => {
              if (activeTab === "general") handleSaveGeneral();
              if (activeTab === "branding") handleSaveBranding();
              if (activeTab === "contact") handleSaveContact();
              if (activeTab === "footer") handleSaveFooter();
              if (activeTab === "seo") handleSaveSeo();
              if (activeTab === "advanced") handleSaveAdvanced();
            }}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-accent text-background text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
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

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-surface border border-surface-border rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
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

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="text-base font-serif font-medium text-primary">
                General Website Identity
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Core studio title, photographer legal credentials, and website status.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Website / Studio Name *
                </label>
                <input
                  type="text"
                  value={general.site_name}
                  onChange={(e) => setGeneral({ ...general, site_name: e.target.value })}
                  placeholder="e.g. Alex Mercer Photography"
                  required
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Photographer Artist Name *
                </label>
                <input
                  type="text"
                  value={general.photographer_name}
                  onChange={(e) => setGeneral({ ...general, photographer_name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  required
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Studio Tagline / Artistic Motto
                </label>
                <input
                  type="text"
                  value={general.tagline}
                  onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                  placeholder="e.g. Visual Narratives & Editorial Chiaroscuro"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Short Studio Description
                </label>
                <textarea
                  rows={3}
                  value={general.description}
                  onChange={(e) => setGeneral({ ...general, description: e.target.value })}
                  placeholder="Bespoke fine art, architectural monograph, and high-fashion photography..."
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Global CTA Button Label
                </label>
                <input
                  type="text"
                  value={general.default_cta_text}
                  onChange={(e) => setGeneral({ ...general, default_cta_text: e.target.value })}
                  placeholder="Inquire Commission"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Global CTA Destination Link
                </label>
                <input
                  type="text"
                  value={general.default_cta_url}
                  onChange={(e) => setGeneral({ ...general, default_cta_url: e.target.value })}
                  placeholder="/contact"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Primary Operating Base / Cities
                </label>
                <input
                  type="text"
                  value={general.location}
                  onChange={(e) => setGeneral({ ...general, location: e.target.value })}
                  placeholder="Paris · Lake Como · New York"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Operating Timezone
                </label>
                <input
                  type="text"
                  value={general.timezone}
                  onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                  placeholder="Europe/Paris"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: BRANDING & VISUAL IDENTITY */}
      {activeTab === "branding" && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          {/* Live Header & Brand Preview */}
          <div className="bg-surface border border-accent/30 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-mono font-bold">
                Live Visual Identity Preview
              </span>
              <span className="text-[10px] text-secondary">
                Rendered with current settings
              </span>
            </div>

            <div className="mt-6 p-6 rounded-xl bg-[#0c0c10] border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  {branding.logo_url ? (
                    <img
                      src={branding.logo_url}
                      alt="Logo"
                      className="h-9 w-auto object-contain rounded"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-surface-raised border border-white/10 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <div>
                    <span className="font-serif text-lg uppercase tracking-[0.18em] font-light text-primary">
                      {branding.brand_name || general.photographer_name || "Alex Mercer"}
                    </span>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-secondary/70 font-mono -mt-0.5">
                      {branding.brand_tagline || "Studio Atelier"}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center space-x-6 text-[11px] uppercase tracking-[0.2em] text-secondary font-medium">
                  <span className="text-primary font-bold">Portfolio</span>
                  <span>About</span>
                  <span>Contact</span>
                  <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px]">
                    {general.default_cta_text || "Inquire"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="text-base font-serif font-medium text-primary">
                Brand Identity Assets
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Manage logos, favicons, brand titles, and default social cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Brand Name Display
                </label>
                <input
                  type="text"
                  value={branding.brand_name}
                  onChange={(e) => setBranding({ ...branding, brand_name: e.target.value })}
                  placeholder="Alex Mercer Studio Atelier"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Brand Subtitle / Monograph Mark
                </label>
                <input
                  type="text"
                  value={branding.brand_tagline}
                  onChange={(e) => setBranding({ ...branding, brand_tagline: e.target.value })}
                  placeholder="Studio Atelier & Archive"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Primary Logo Image URL (Transparent PNG/SVG)
                </label>
                <input
                  type="url"
                  value={branding.logo_url}
                  onChange={(e) => setBranding({ ...branding, logo_url: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /logo.png"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Favicon Image URL (32x32 or 64x64 PNG/ICO)
                </label>
                <input
                  type="url"
                  value={branding.favicon_url}
                  onChange={(e) => setBranding({ ...branding, favicon_url: e.target.value })}
                  placeholder="https://.../favicon.png"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Logo (Dark Variant)
                </label>
                <input
                  type="url"
                  value={branding.logo_dark_url}
                  onChange={(e) => setBranding({ ...branding, logo_dark_url: e.target.value })}
                  placeholder="URL to dark monochrome logo"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Logo (Light Variant)
                </label>
                <input
                  type="url"
                  value={branding.logo_light_url}
                  onChange={(e) => setBranding({ ...branding, logo_light_url: e.target.value })}
                  placeholder="URL to light monochrome logo"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Default Social Share Image (1200x630 OG Banner)
                </label>
                <input
                  type="url"
                  value={branding.og_image_url}
                  onChange={(e) => setBranding({ ...branding, og_image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: CONTACT INFORMATION */}
      {activeTab === "contact" && (
        <form onSubmit={handleSaveContact} className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="text-base font-serif font-medium text-primary">
                Studio Representation & Contact Parameters
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                These credentials populate the Contact page, Footer, and Direct Booking buttons.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Public Studio Email *
                </label>
                <input
                  type="email"
                  value={contact.public_email}
                  onChange={(e) => setContact({ ...contact, public_email: e.target.value })}
                  placeholder="studio@alexmercer.com"
                  required
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Direct Line / Studio Phone
                </label>
                <input
                  type="tel"
                  value={contact.public_phone}
                  onChange={(e) => setContact({ ...contact, public_phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  WhatsApp VIP Number
                </label>
                <input
                  type="tel"
                  value={contact.whatsapp_number}
                  onChange={(e) => setContact({ ...contact, whatsapp_number: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Location / Base
                </label>
                <input
                  type="text"
                  value={contact.location}
                  onChange={(e) => setContact({ ...contact, location: e.target.value })}
                  placeholder="Paris · Lake Como · Milan · Tokyo"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Booking Availability Status
                </label>
                <input
                  type="text"
                  value={contact.availability_text}
                  onChange={(e) => setContact({ ...contact, availability_text: e.target.value })}
                  placeholder="Accepting 2026/2027 Commissions Worldwide"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Standard Response Time Notice
                </label>
                <input
                  type="text"
                  value={contact.response_time_text}
                  onChange={(e) => setContact({ ...contact, response_time_text: e.target.value })}
                  placeholder="Inquiries responded within 24 business hours"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Studio Atelier Business Hours
                </label>
                <input
                  type="text"
                  value={contact.business_hours}
                  onChange={(e) => setContact({ ...contact, business_hours: e.target.value })}
                  placeholder="Mon - Fri: 09:00 - 18:00 CET"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: NAVIGATION BUILDER */}
      {activeTab === "navigation" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-medium text-primary">
                Header Navigation Menu CMS
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Configure menu items, reorder links, and manage external/internal destinations.
              </p>
            </div>
            <button
              onClick={() => setShowAddNav(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-accent text-background text-xs uppercase tracking-wider font-semibold hover:bg-accent-hover transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Link</span>
            </button>
          </div>

          {/* Add Nav Modal / Drawer */}
          {showAddNav && (
            <form
              onSubmit={handleAddNav}
              className="bg-surface border border-accent/40 rounded-xl p-6 space-y-4 shadow-xl"
            >
              <h4 className="text-xs font-serif uppercase tracking-widest text-accent font-bold">
                New Navigation Link
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-secondary mb-1">Menu Label *</label>
                  <input
                    type="text"
                    value={newNavItem.label}
                    onChange={(e) => setNewNavItem({ ...newNavItem, label: e.target.value })}
                    placeholder="e.g. Exhibitions"
                    required
                    className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1">Destination Route / URL *</label>
                  <input
                    type="text"
                    value={newNavItem.url}
                    onChange={(e) => setNewNavItem({ ...newNavItem, url: e.target.value })}
                    placeholder="e.g. /portfolio or https://..."
                    required
                    className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1">Link Type</label>
                  <select
                    value={newNavItem.type}
                    onChange={(e: any) => setNewNavItem({ ...newNavItem, type: e.target.value })}
                    className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="INTERNAL">Internal Page (/path)</option>
                    <option value="EXTERNAL">External URL (https://...)</option>
                    <option value="ANCHOR">Page Anchor (#section)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 text-xs text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNavItem.open_new_tab}
                    onChange={(e) => setNewNavItem({ ...newNavItem, open_new_tab: e.target.checked })}
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Open link in new browser tab</span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNav(false)}
                    className="px-4 py-1.5 rounded-lg border border-surface-border text-xs text-secondary hover:text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 rounded-lg bg-accent text-background text-xs font-semibold hover:bg-accent-hover"
                  >
                    Create Item
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Nav Items List */}
          <div className="bg-surface border border-surface-border rounded-xl divide-y divide-surface-border overflow-hidden">
            {navigation.map((item, index) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveNav(index, "up")}
                      disabled={index === 0}
                      className="text-secondary hover:text-accent disabled:opacity-20 p-0.5"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveNav(index, "down")}
                      disabled={index === navigation.length - 1}
                      className="text-secondary hover:text-accent disabled:opacity-20 p-0.5"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary">{item.label}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface-raised border border-surface-border text-secondary">
                        {item.type}
                      </span>
                      {item.open_new_tab && (
                        <span className="text-[9px] uppercase tracking-wider text-accent font-mono">
                          New Tab
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-secondary font-mono">{item.url}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleNavVisibility(item)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                      item.is_visible
                        ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                        : "bg-surface-raised text-secondary border border-surface-border"
                    }`}
                  >
                    {item.is_visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteNav(item.id, item.label)}
                    className="p-1.5 text-secondary hover:text-rose-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SOCIAL MEDIA CHANNELS */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-medium text-primary">
                Social Media Links CMS
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Add and curate social media icons shown across footer, contact, and header areas.
              </p>
            </div>
            <button
              onClick={() => setShowAddSocial(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-accent text-background text-xs uppercase tracking-wider font-semibold hover:bg-accent-hover transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Social Channel</span>
            </button>
          </div>

          {/* Add Social Modal / Drawer */}
          {showAddSocial && (
            <form
              onSubmit={handleAddSocial}
              className="bg-surface border border-accent/40 rounded-xl p-6 space-y-4 shadow-xl"
            >
              <h4 className="text-xs font-serif uppercase tracking-widest text-accent font-bold">
                New Social Channel
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-secondary mb-1">Platform *</label>
                  <input
                    type="text"
                    value={newSocialItem.platform}
                    onChange={(e) =>
                      setNewSocialItem({ ...newSocialItem, platform: e.target.value })
                    }
                    placeholder="Instagram, Behance, YouTube, etc."
                    required
                    className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1">Display Label *</label>
                  <input
                    type="text"
                    value={newSocialItem.label}
                    onChange={(e) =>
                      setNewSocialItem({ ...newSocialItem, label: e.target.value })
                    }
                    placeholder="e.g. @alexmercer.atelier"
                    required
                    className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary mb-1">Full URL *</label>
                  <input
                    type="url"
                    value={newSocialItem.url}
                    onChange={(e) =>
                      setNewSocialItem({ ...newSocialItem, url: e.target.value })
                    }
                    placeholder="https://instagram.com/..."
                    required
                    className="w-full bg-background border border-surface-border rounded-lg px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSocial(false)}
                  className="px-4 py-1.5 rounded-lg border border-surface-border text-xs text-secondary hover:text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-accent text-background text-xs font-semibold hover:bg-accent-hover"
                >
                  Save Link
                </button>
              </div>
            </form>
          )}

          {/* Social Items List */}
          <div className="bg-surface border border-surface-border rounded-xl divide-y divide-surface-border overflow-hidden">
            {socialLinks.map((item, index) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveSocial(index, "up")}
                      disabled={index === 0}
                      className="text-secondary hover:text-accent disabled:opacity-20 p-0.5"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSocial(index, "down")}
                      disabled={index === socialLinks.length - 1}
                      className="text-secondary hover:text-accent disabled:opacity-20 p-0.5"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary">{item.platform}</span>
                      <span className="text-xs text-secondary">({item.label})</span>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent/80 hover:underline flex items-center space-x-1"
                    >
                      <span>{item.url}</span>
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleSocialVisibility(item)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs transition-colors ${
                      item.is_visible
                        ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                        : "bg-surface-raised text-secondary border border-surface-border"
                    }`}
                  >
                    {item.is_visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteSocial(item.id, item.platform)}
                    className="p-1.5 text-secondary hover:text-rose-400 transition-colors"
                    title="Delete channel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FOOTER CMS */}
      {activeTab === "footer" && (
        <form onSubmit={handleSaveFooter} className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="text-base font-serif font-medium text-primary">
                Footer Layout & Legal Content
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Customize copyright statement, studio description, and footer column toggles.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Footer Studio Summary
                </label>
                <textarea
                  rows={3}
                  value={footer.description}
                  onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                  placeholder="Fine art & editorial photography dedicated to capturing monumental form..."
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Copyright Notice Text
                </label>
                <input
                  type="text"
                  value={footer.copyright_text}
                  onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
                  placeholder="Alex Mercer Studio Atelier. All rights reserved."
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="border-t border-surface-border pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2.5 p-3 rounded-lg bg-background border border-surface-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footer.show_navigation}
                    onChange={(e) =>
                      setFooter({ ...footer, show_navigation: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span className="text-xs text-primary">Show Quick Links Column</span>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-lg bg-background border border-surface-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footer.show_contact}
                    onChange={(e) =>
                      setFooter({ ...footer, show_contact: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span className="text-xs text-primary">Show Inquiries / Email</span>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-lg bg-background border border-surface-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footer.show_social_links}
                    onChange={(e) =>
                      setFooter({ ...footer, show_social_links: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span className="text-xs text-primary">Show Social Channels</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 7: SEO & METADATA */}
      {activeTab === "seo" && (
        <form onSubmit={handleSaveSeo} className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="text-base font-serif font-medium text-primary">
                Global Search Engine Optimization (SEO) & Social Cards
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Control how your photography portfolio ranks on Google, Bing, and previews on iMessage, Twitter/X, and Facebook.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Global Site Title Tag *
                </label>
                <input
                  type="text"
                  value={seo.site_title}
                  onChange={(e) => setSeo({ ...seo, site_title: e.target.value })}
                  placeholder="Alex Mercer — Luxury Editorial & Destination Wedding Photography"
                  required
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-secondary">
                    Meta Description (Recommended: 120-160 characters)
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      seo.meta_description.length > 160
                        ? "text-amber-400 font-bold"
                        : "text-secondary"
                    }`}
                  >
                    {seo.meta_description.length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seo.meta_description}
                  onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
                  placeholder="Bespoke fine art, architectural monograph, and high-fashion wedding photography based in Paris..."
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Meta Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={seo.meta_keywords}
                  onChange={(e) => setSeo({ ...seo, meta_keywords: e.target.value })}
                  placeholder="luxury photography, lake como, editorial wedding"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Canonical Base URL
                </label>
                <input
                  type="url"
                  value={seo.canonical_url}
                  onChange={(e) => setSeo({ ...seo, canonical_url: e.target.value })}
                  placeholder="https://alexmercer.photography"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  OpenGraph Title (Social Share)
                </label>
                <input
                  type="text"
                  value={seo.og_title}
                  onChange={(e) => setSeo({ ...seo, og_title: e.target.value })}
                  placeholder="Alex Mercer Studio Atelier — Fine Art Photography"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Twitter / X Card Title
                </label>
                <input
                  type="text"
                  value={seo.twitter_title}
                  onChange={(e) => setSeo({ ...seo, twitter_title: e.target.value })}
                  placeholder="Alex Mercer Photography"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 border-t border-surface-border pt-4 flex items-center space-x-6">
                <label className="flex items-center space-x-2.5 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seo.robots_index}
                    onChange={(e) => setSeo({ ...seo, robots_index: e.target.checked })}
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Allow Search Engines to Index Site (robots: index)</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seo.robots_follow}
                    onChange={(e) => setSeo({ ...seo, robots_follow: e.target.checked })}
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Follow Links on Pages (robots: follow)</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 8: ADVANCED & MAINTENANCE MODE */}
      {activeTab === "advanced" && (
        <form onSubmit={handleSaveAdvanced} className="space-y-6">
          <div className="bg-surface border border-surface-border rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-surface-border pb-4">
              <h3 className="text-base font-serif font-medium text-primary">
                Advanced Operations & Maintenance Mode
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Configure privacy controls, temporary maintenance exhibition page, and analytics IDs.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Website Public Status
                </label>
                <select
                  value={advanced.website_status}
                  onChange={(e: any) =>
                    setAdvanced({ ...advanced, website_status: e.target.value })
                  }
                  className="w-full sm:w-72 bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                >
                  <option value="ACTIVE">Active (Publicly Live)</option>
                  <option value="MAINTENANCE">Maintenance Mode (Exhibition Curation)</option>
                  <option value="PRIVATE">Private Preview</option>
                </select>
                {advanced.website_status === "MAINTENANCE" && (
                  <p className="text-xs text-amber-400 mt-2">
                    Note: In Maintenance Mode, public visitors will see a luxury maintenance page while you maintain full access to the Admin CMS.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Maintenance Screen Notice Message
                </label>
                <textarea
                  rows={3}
                  value={advanced.maintenance_message}
                  onChange={(e) =>
                    setAdvanced({ ...advanced, maintenance_message: e.target.value })
                  }
                  placeholder="The studio atelier is currently undergoing curation..."
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-secondary mb-2">
                  Google Analytics / Plausible Tracking ID
                </label>
                <input
                  type="text"
                  value={advanced.analytics_id}
                  onChange={(e) =>
                    setAdvanced({ ...advanced, analytics_id: e.target.value })
                  }
                  placeholder="e.g. G-XXXXXXXXXX"
                  className="w-full bg-background border border-surface-border rounded-lg px-4 py-2.5 text-xs text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="border-t border-surface-border pt-4">
                <label className="flex items-center space-x-2.5 text-xs text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advanced.enable_public_enquiries}
                    onChange={(e) =>
                      setAdvanced({ ...advanced, enable_public_enquiries: e.target.checked })
                    }
                    className="rounded border-surface-border text-accent focus:ring-accent"
                  />
                  <span>Enable Public Enquiry & Contact Forms</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
