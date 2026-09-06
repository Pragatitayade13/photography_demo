import { query } from "../../database/db.js";
import {
  GeneralSettings,
  BrandingSettings,
  ContactSettings,
  AdvancedSettings,
  NavigationItem,
  SocialLink,
  FooterSettings,
  SeoSettings,
  AllAdminSettings,
  PublicSiteConfig,
} from "./settings.types.js";

// In-Memory Data Store (Default state & Fallback)
let inMemoryGeneral: GeneralSettings = {
  site_name: "Alex Mercer Photography",
  photographer_name: "Alex Mercer",
  tagline: "Visual Narratives & Editorial Chiaroscuro",
  description:
    "Fine art & editorial photography dedicated to capturing monumental architectural form, high-fashion storytelling, and destination celebrations across Europe and Asia.",
  website_status: "ACTIVE",
  default_cta_text: "Inquire Commission",
  default_cta_url: "/contact",
  location: "Paris · Lake Como · Milan · Tokyo · New York",
  timezone: "Europe/Paris",
};

let inMemoryBranding: BrandingSettings = {
  brand_name: "Alex Mercer Studio Atelier",
  brand_tagline: "Studio Atelier & Monograph Archive",
  logo_url: "",
  logo_dark_url: "",
  logo_light_url: "",
  favicon_url: "",
  og_image_url: "/uploads/wedding_arch.jpg",
};

let inMemoryContact: ContactSettings = {
  public_email: "studio@alexmercer.com",
  public_phone: "+1 (555) 019-2834",
  whatsapp_number: "+1 (555) 019-2834",
  location: "Paris · Lake Como · Milan · Tokyo · New York",
  availability_text: "Accepting 2026/2027 Commissions Worldwide",
  response_time_text: "Inquiries responded within 24 business hours",
  business_hours: "Mon - Fri: 09:00 - 18:00 CET",
};

let inMemoryAdvanced: AdvancedSettings = {
  website_status: "ACTIVE",
  maintenance_message:
    "The studio atelier is currently undergoing curation. For urgent commissions, please contact studio@alexmercer.com.",
  analytics_id: "",
  enable_public_enquiries: true,
};

let inMemoryNavigation: NavigationItem[] = [
  {
    id: "nav-1",
    label: "Portfolio",
    url: "/portfolio",
    type: "INTERNAL",
    sort_order: 1,
    is_visible: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "nav-2",
    label: "About",
    url: "/about",
    type: "INTERNAL",
    sort_order: 2,
    is_visible: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "nav-3",
    label: "Contact",
    url: "/contact",
    type: "INTERNAL",
    sort_order: 3,
    is_visible: true,
    open_new_tab: false,
    created_at: new Date().toISOString(),
  },
];

let inMemorySocialLinks: SocialLink[] = [
  {
    id: "soc-1",
    platform: "Instagram",
    label: "@alexmercer.atelier",
    url: "https://instagram.com/alexmercer",
    icon: "instagram",
    sort_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "soc-2",
    platform: "Behance",
    label: "Alex Mercer Monograph",
    url: "https://behance.net/alexmercer",
    icon: "palette",
    sort_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "soc-3",
    platform: "YouTube",
    label: "Cinematic Documentary",
    url: "https://youtube.com/@alexmercer",
    icon: "video",
    sort_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "soc-4",
    platform: "WhatsApp",
    label: "Direct Studio Atelier Line",
    url: "https://wa.me/15550192834",
    icon: "message-circle",
    sort_order: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
];

let inMemoryFooter: FooterSettings = {
  description:
    "Fine art & editorial photography dedicated to capturing monumental architectural form, high-fashion storytelling, and destination celebrations across Europe and Asia.",
  copyright_text:
    "Alex Mercer Studio Atelier. All rights reserved. Photographs protected by international copyright law.",
  show_social_links: true,
  show_contact: true,
  show_navigation: true,
};

let inMemorySeo: SeoSettings = {
  site_title: "Alex Mercer — Luxury Editorial & Destination Wedding Photography",
  meta_description:
    "Bespoke fine art, architectural monograph, and high-fashion wedding photography based in Paris and Lake Como. Available for worldwide commissions.",
  meta_keywords:
    "luxury photography, editorial wedding, lake como photographer, architectural photography, alex mercer",
  canonical_url: "https://alexmercer.photography",
  og_title: "Alex Mercer Studio Atelier — Fine Art Photography",
  og_description:
    "Award-winning medium format visual stories, architectural forms, and editorial wedding documentation.",
  og_image_url:
    "/uploads/wedding_arch.jpg",
  twitter_title: "Alex Mercer Photography",
  twitter_description: "Visual stories and fine art monographs by Alex Mercer.",
  robots_index: true,
  robots_follow: true,
};

// Caching layer
let cachedPublicConfig: PublicSiteConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export class SettingsRepository {
  private invalidateCache(): void {
    cachedPublicConfig = null;
    cacheTimestamp = 0;
  }

  // --- GET ALL ADMIN SETTINGS ---
  async getAllAdminSettings(): Promise<AllAdminSettings> {
    try {
      const res = await query("SELECT * FROM site_settings LIMIT 1");
      if (res.rows.length > 0) {
        const row = res.rows[0];
        inMemoryGeneral = {
          site_name: row.site_name || inMemoryGeneral.site_name,
          photographer_name: row.photographer_name || inMemoryGeneral.photographer_name,
          tagline: row.tagline || inMemoryGeneral.tagline,
          description: row.description || inMemoryGeneral.description,
          website_status: row.website_status || inMemoryGeneral.website_status,
          default_cta_text: row.default_cta_text || inMemoryGeneral.default_cta_text,
          default_cta_url: row.default_cta_url || inMemoryGeneral.default_cta_url,
          location: row.location || inMemoryGeneral.location,
          timezone: row.timezone || inMemoryGeneral.timezone,
        };

        inMemoryBranding = {
          brand_name: row.brand_name || inMemoryBranding.brand_name,
          brand_tagline: row.brand_tagline || inMemoryBranding.brand_tagline,
          logo_url: row.logo_url || "",
          logo_dark_url: row.logo_dark_url || "",
          logo_light_url: row.logo_light_url || "",
          favicon_url: row.favicon_url || "",
          og_image_url: row.og_image_url || inMemoryBranding.og_image_url,
        };

        inMemoryContact = {
          public_email: row.public_email || inMemoryContact.public_email,
          public_phone: row.public_phone || inMemoryContact.public_phone,
          whatsapp_number: row.whatsapp_number || inMemoryContact.whatsapp_number,
          location: row.location || inMemoryContact.location,
          availability_text: row.availability_text || inMemoryContact.availability_text,
          response_time_text: row.response_time_text || inMemoryContact.response_time_text,
          business_hours: row.business_hours || inMemoryContact.business_hours,
        };

        inMemoryAdvanced = {
          website_status: row.website_status || inMemoryAdvanced.website_status,
          maintenance_message: row.maintenance_message || inMemoryAdvanced.maintenance_message,
          analytics_id: row.analytics_id || "",
          enable_public_enquiries: row.enable_public_enquiries ?? true,
        };
      }
    } catch {
      // Postgres query failed; continue with in-memory
    }

    // Try fetching nav from DB
    try {
      const navRes = await query("SELECT * FROM navigation_items ORDER BY sort_order ASC");
      if (navRes.rows.length > 0) {
        inMemoryNavigation = navRes.rows.map((r) => ({
          id: r.id,
          label: r.label,
          url: r.url,
          type: r.type,
          sort_order: r.sort_order,
          is_visible: r.is_visible,
          open_new_tab: r.open_new_tab,
          created_at: r.created_at,
          updated_at: r.updated_at,
        }));
      }
    } catch {
      // Fallback in-memory
    }

    // Try fetching social links from DB
    try {
      const socRes = await query("SELECT * FROM social_links ORDER BY sort_order ASC");
      if (socRes.rows.length > 0) {
        inMemorySocialLinks = socRes.rows.map((r) => ({
          id: r.id,
          platform: r.platform,
          label: r.label,
          url: r.url,
          icon: r.icon,
          sort_order: r.sort_order,
          is_visible: r.is_visible,
          created_at: r.created_at,
          updated_at: r.updated_at,
        }));
      }
    } catch {
      // Fallback in-memory
    }

    // Try fetching footer from DB
    try {
      const footRes = await query("SELECT * FROM footer_settings LIMIT 1");
      if (footRes.rows.length > 0) {
        const r = footRes.rows[0];
        inMemoryFooter = {
          description: r.description || inMemoryFooter.description,
          copyright_text: r.copyright_text || inMemoryFooter.copyright_text,
          show_social_links: r.show_social_links ?? true,
          show_contact: r.show_contact ?? true,
          show_navigation: r.show_navigation ?? true,
        };
      }
    } catch {
      // Fallback in-memory
    }

    // Try fetching SEO from DB
    try {
      const seoRes = await query("SELECT * FROM seo_settings LIMIT 1");
      if (seoRes.rows.length > 0) {
        const r = seoRes.rows[0];
        inMemorySeo = {
          site_title: r.site_title || inMemorySeo.site_title,
          meta_description: r.meta_description || inMemorySeo.meta_description,
          meta_keywords: r.meta_keywords || inMemorySeo.meta_keywords,
          canonical_url: r.canonical_url || inMemorySeo.canonical_url,
          og_title: r.og_title || inMemorySeo.og_title,
          og_description: r.og_description || inMemorySeo.og_description,
          og_image_url: r.og_image_url || inMemorySeo.og_image_url,
          twitter_title: r.twitter_title || inMemorySeo.twitter_title,
          twitter_description: r.twitter_description || inMemorySeo.twitter_description,
          robots_index: r.robots_index ?? true,
          robots_follow: r.robots_follow ?? true,
        };
      }
    } catch {
      // Fallback in-memory
    }

    return {
      general: inMemoryGeneral,
      branding: inMemoryBranding,
      contact: inMemoryContact,
      advanced: inMemoryAdvanced,
      footer: inMemoryFooter,
      seo: inMemorySeo,
      navigation: inMemoryNavigation,
      social_links: inMemorySocialLinks,
      updated_at: new Date().toISOString(),
    };
  }

  // --- GENERAL SETTINGS ---
  async updateGeneralSettings(data: Partial<GeneralSettings>): Promise<GeneralSettings> {
    inMemoryGeneral = { ...inMemoryGeneral, ...data };
    if (data.website_status) {
      inMemoryAdvanced.website_status = data.website_status;
    }
    this.invalidateCache();

    try {
      await query(
        `UPDATE site_settings SET 
          site_name = COALESCE($1, site_name),
          photographer_name = COALESCE($2, photographer_name),
          tagline = COALESCE($3, tagline),
          description = COALESCE($4, description),
          website_status = COALESCE($5, website_status),
          default_cta_text = COALESCE($6, default_cta_text),
          default_cta_url = COALESCE($7, default_cta_url),
          location = COALESCE($8, location),
          timezone = COALESCE($9, timezone),
          updated_at = NOW()`,
        [
          data.site_name,
          data.photographer_name,
          data.tagline,
          data.description,
          data.website_status,
          data.default_cta_text,
          data.default_cta_url,
          data.location,
          data.timezone,
        ]
      );
    } catch {
      // In-memory update succeeded
    }

    return inMemoryGeneral;
  }

  // --- BRANDING SETTINGS ---
  async updateBrandingSettings(data: Partial<BrandingSettings>): Promise<BrandingSettings> {
    inMemoryBranding = { ...inMemoryBranding, ...data };
    this.invalidateCache();

    try {
      await query(
        `UPDATE site_settings SET 
          brand_name = COALESCE($1, brand_name),
          brand_tagline = COALESCE($2, brand_tagline),
          logo_url = COALESCE($3, logo_url),
          logo_dark_url = COALESCE($4, logo_dark_url),
          logo_light_url = COALESCE($5, logo_light_url),
          favicon_url = COALESCE($6, favicon_url),
          og_image_url = COALESCE($7, og_image_url),
          updated_at = NOW()`,
        [
          data.brand_name,
          data.brand_tagline,
          data.logo_url,
          data.logo_dark_url,
          data.logo_light_url,
          data.favicon_url,
          data.og_image_url,
        ]
      );
    } catch {
      // In-memory update succeeded
    }

    return inMemoryBranding;
  }

  // --- CONTACT SETTINGS ---
  async updateContactSettings(data: Partial<ContactSettings>): Promise<ContactSettings> {
    inMemoryContact = { ...inMemoryContact, ...data };
    this.invalidateCache();

    try {
      await query(
        `UPDATE site_settings SET 
          public_email = COALESCE($1, public_email),
          public_phone = COALESCE($2, public_phone),
          whatsapp_number = COALESCE($3, whatsapp_number),
          location = COALESCE($4, location),
          availability_text = COALESCE($5, availability_text),
          response_time_text = COALESCE($6, response_time_text),
          business_hours = COALESCE($7, business_hours),
          updated_at = NOW()`,
        [
          data.public_email,
          data.public_phone,
          data.whatsapp_number,
          data.location,
          data.availability_text,
          data.response_time_text,
          data.business_hours,
        ]
      );
    } catch {
      // In-memory update succeeded
    }

    return inMemoryContact;
  }

  // --- ADVANCED SETTINGS ---
  async updateAdvancedSettings(data: Partial<AdvancedSettings>): Promise<AdvancedSettings> {
    inMemoryAdvanced = { ...inMemoryAdvanced, ...data };
    if (data.website_status) {
      inMemoryGeneral.website_status = data.website_status;
    }
    this.invalidateCache();

    try {
      await query(
        `UPDATE site_settings SET 
          website_status = COALESCE($1, website_status),
          maintenance_message = COALESCE($2, maintenance_message),
          analytics_id = COALESCE($3, analytics_id),
          enable_public_enquiries = COALESCE($4, enable_public_enquiries),
          updated_at = NOW()`,
        [
          data.website_status,
          data.maintenance_message,
          data.analytics_id,
          data.enable_public_enquiries,
        ]
      );
    } catch {
      // In-memory update succeeded
    }

    return inMemoryAdvanced;
  }

  // --- NAVIGATION CRUD ---
  async getNavigationItems(): Promise<NavigationItem[]> {
    return [...inMemoryNavigation].sort((a, b) => a.sort_order - b.sort_order);
  }

  async createNavigationItem(item: Omit<NavigationItem, "id">): Promise<NavigationItem> {
    const newItem: NavigationItem = {
      ...item,
      id: `nav-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryNavigation.push(newItem);
    this.invalidateCache();

    try {
      await query(
        `INSERT INTO navigation_items (id, label, url, type, sort_order, is_visible, open_new_tab)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newItem.id,
          newItem.label,
          newItem.url,
          newItem.type,
          newItem.sort_order,
          newItem.is_visible,
          newItem.open_new_tab,
        ]
      );
    } catch {
      // In-memory insert succeeded
    }

    return newItem;
  }

  async updateNavigationItem(
    id: string,
    data: Partial<NavigationItem>
  ): Promise<NavigationItem | null> {
    const idx = inMemoryNavigation.findIndex((n) => n.id === id);
    if (idx === -1) return null;

    inMemoryNavigation[idx] = {
      ...inMemoryNavigation[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    this.invalidateCache();

    try {
      await query(
        `UPDATE navigation_items SET 
          label = COALESCE($1, label),
          url = COALESCE($2, url),
          type = COALESCE($3, type),
          sort_order = COALESCE($4, sort_order),
          is_visible = COALESCE($5, is_visible),
          open_new_tab = COALESCE($6, open_new_tab),
          updated_at = NOW()
         WHERE id = $7`,
        [data.label, data.url, data.type, data.sort_order, data.is_visible, data.open_new_tab, id]
      );
    } catch {
      // In-memory update succeeded
    }

    return inMemoryNavigation[idx];
  }

  async deleteNavigationItem(id: string): Promise<boolean> {
    const initialLen = inMemoryNavigation.length;
    inMemoryNavigation = inMemoryNavigation.filter((n) => n.id !== id);
    this.invalidateCache();

    try {
      await query("DELETE FROM navigation_items WHERE id = $1", [id]);
    } catch {
      // Handled
    }

    return inMemoryNavigation.length < initialLen;
  }

  async reorderNavigation(items: Array<{ id: string; sort_order: number }>): Promise<NavigationItem[]> {
    for (const item of items) {
      const target = inMemoryNavigation.find((n) => n.id === item.id);
      if (target) {
        target.sort_order = item.sort_order;
        target.updated_at = new Date().toISOString();
      }
    }
    inMemoryNavigation.sort((a, b) => a.sort_order - b.sort_order);
    this.invalidateCache();

    try {
      for (const item of items) {
        await query("UPDATE navigation_items SET sort_order = $1 WHERE id = $2", [
          item.sort_order,
          item.id,
        ]);
      }
    } catch {
      // Handled
    }

    return inMemoryNavigation;
  }

  // --- SOCIAL LINKS CRUD ---
  async getSocialLinks(): Promise<SocialLink[]> {
    return [...inMemorySocialLinks].sort((a, b) => a.sort_order - b.sort_order);
  }

  async createSocialLink(item: Omit<SocialLink, "id">): Promise<SocialLink> {
    const newLink: SocialLink = {
      ...item,
      id: `soc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemorySocialLinks.push(newLink);
    this.invalidateCache();

    try {
      await query(
        `INSERT INTO social_links (id, platform, label, url, icon, sort_order, is_visible)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newLink.id,
          newLink.platform,
          newLink.label,
          newLink.url,
          newLink.icon,
          newLink.sort_order,
          newLink.is_visible,
        ]
      );
    } catch {
      // Handled
    }

    return newLink;
  }

  async updateSocialLink(id: string, data: Partial<SocialLink>): Promise<SocialLink | null> {
    const idx = inMemorySocialLinks.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    inMemorySocialLinks[idx] = {
      ...inMemorySocialLinks[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    this.invalidateCache();

    try {
      await query(
        `UPDATE social_links SET 
          platform = COALESCE($1, platform),
          label = COALESCE($2, label),
          url = COALESCE($3, url),
          icon = COALESCE($4, icon),
          sort_order = COALESCE($5, sort_order),
          is_visible = COALESCE($6, is_visible),
          updated_at = NOW()
         WHERE id = $7`,
        [data.platform, data.label, data.url, data.icon, data.sort_order, data.is_visible, id]
      );
    } catch {
      // Handled
    }

    return inMemorySocialLinks[idx];
  }

  async deleteSocialLink(id: string): Promise<boolean> {
    const initialLen = inMemorySocialLinks.length;
    inMemorySocialLinks = inMemorySocialLinks.filter((s) => s.id !== id);
    this.invalidateCache();

    try {
      await query("DELETE FROM social_links WHERE id = $1", [id]);
    } catch {
      // Handled
    }

    return inMemorySocialLinks.length < initialLen;
  }

  async reorderSocialLinks(items: Array<{ id: string; sort_order: number }>): Promise<SocialLink[]> {
    for (const item of items) {
      const target = inMemorySocialLinks.find((s) => s.id === item.id);
      if (target) {
        target.sort_order = item.sort_order;
        target.updated_at = new Date().toISOString();
      }
    }
    inMemorySocialLinks.sort((a, b) => a.sort_order - b.sort_order);
    this.invalidateCache();

    try {
      for (const item of items) {
        await query("UPDATE social_links SET sort_order = $1 WHERE id = $2", [
          item.sort_order,
          item.id,
        ]);
      }
    } catch {
      // Handled
    }

    return inMemorySocialLinks;
  }

  // --- FOOTER SETTINGS ---
  async getFooterSettings(): Promise<FooterSettings> {
    return inMemoryFooter;
  }

  async updateFooterSettings(data: Partial<FooterSettings>): Promise<FooterSettings> {
    inMemoryFooter = { ...inMemoryFooter, ...data };
    this.invalidateCache();

    try {
      await query(
        `UPDATE footer_settings SET 
          description = COALESCE($1, description),
          copyright_text = COALESCE($2, copyright_text),
          show_social_links = COALESCE($3, show_social_links),
          show_contact = COALESCE($4, show_contact),
          show_navigation = COALESCE($5, show_navigation),
          updated_at = NOW()`,
        [
          data.description,
          data.copyright_text,
          data.show_social_links,
          data.show_contact,
          data.show_navigation,
        ]
      );
    } catch {
      // Handled
    }

    return inMemoryFooter;
  }

  // --- SEO SETTINGS ---
  async getSeoSettings(): Promise<SeoSettings> {
    return inMemorySeo;
  }

  async updateSeoSettings(data: Partial<SeoSettings>): Promise<SeoSettings> {
    inMemorySeo = { ...inMemorySeo, ...data };
    this.invalidateCache();

    try {
      await query(
        `UPDATE seo_settings SET 
          site_title = COALESCE($1, site_title),
          meta_description = COALESCE($2, meta_description),
          meta_keywords = COALESCE($3, meta_keywords),
          canonical_url = COALESCE($4, canonical_url),
          og_title = COALESCE($5, og_title),
          og_description = COALESCE($6, og_description),
          og_image_url = COALESCE($7, og_image_url),
          twitter_title = COALESCE($8, twitter_title),
          twitter_description = COALESCE($9, twitter_description),
          robots_index = COALESCE($10, robots_index),
          robots_follow = COALESCE($11, robots_follow),
          updated_at = NOW()`,
        [
          data.site_title,
          data.meta_description,
          data.meta_keywords,
          data.canonical_url,
          data.og_title,
          data.og_description,
          data.og_image_url,
          data.twitter_title,
          data.twitter_description,
          data.robots_index,
          data.robots_follow,
        ]
      );
    } catch {
      // Handled
    }

    return inMemorySeo;
  }

  // --- PUBLIC CONFIG WITH HIGH-PERFORMANCE CACHE ---
  async getPublicSiteConfig(): Promise<PublicSiteConfig> {
    const now = Date.now();
    if (cachedPublicConfig && now - cacheTimestamp < CACHE_TTL_MS) {
      return cachedPublicConfig;
    }

    // Refresh data
    await this.getAllAdminSettings();

    const publicNav = inMemoryNavigation
      .filter((n) => n.is_visible)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((n) => ({
        id: n.id,
        label: n.label,
        url: n.url,
        type: n.type,
        sortOrder: n.sort_order,
        openNewTab: n.open_new_tab,
      }));

    const publicSocial = inMemorySocialLinks
      .filter((s) => s.is_visible)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        id: s.id,
        platform: s.platform,
        label: s.label,
        url: s.url,
        icon: s.icon,
        sortOrder: s.sort_order,
      }));

    const config: PublicSiteConfig = {
      site: {
        name: inMemoryGeneral.site_name,
        photographerName: inMemoryGeneral.photographer_name,
        tagline: inMemoryGeneral.tagline,
        description: inMemoryGeneral.description,
        status: inMemoryGeneral.website_status,
        defaultCtaText: inMemoryGeneral.default_cta_text,
        defaultCtaUrl: inMemoryGeneral.default_cta_url,
        location: inMemoryGeneral.location,
      },
      branding: {
        brandName: inMemoryBranding.brand_name,
        brandTagline: inMemoryBranding.brand_tagline,
        logo: inMemoryBranding.logo_url,
        logoDark: inMemoryBranding.logo_dark_url,
        logoLight: inMemoryBranding.logo_light_url,
        favicon: inMemoryBranding.favicon_url,
        ogImage: inMemoryBranding.og_image_url,
      },
      contact: {
        email: inMemoryContact.public_email,
        phone: inMemoryContact.public_phone,
        whatsappNumber: inMemoryContact.whatsapp_number,
        location: inMemoryContact.location,
        availability: inMemoryContact.availability_text,
        responseTime: inMemoryContact.response_time_text,
        businessHours: inMemoryContact.business_hours,
        enableEnquiries: inMemoryAdvanced.enable_public_enquiries,
      },
      navigation: publicNav,
      socialLinks: publicSocial,
      footer: {
        description: inMemoryFooter.description,
        copyrightText: inMemoryFooter.copyright_text,
        showSocialLinks: inMemoryFooter.show_social_links,
        showContact: inMemoryFooter.show_contact,
        showNavigation: inMemoryFooter.show_navigation,
      },
      seo: {
        siteTitle: inMemorySeo.site_title,
        metaDescription: inMemorySeo.meta_description,
        metaKeywords: inMemorySeo.meta_keywords,
        canonicalUrl: inMemorySeo.canonical_url,
        ogTitle: inMemorySeo.og_title,
        ogDescription: inMemorySeo.og_description,
        ogImage: inMemorySeo.og_image_url,
        twitterTitle: inMemorySeo.twitter_title,
        twitterDescription: inMemorySeo.twitter_description,
        robotsIndex: inMemorySeo.robots_index,
        robotsFollow: inMemorySeo.robots_follow,
      },
      maintenance: {
        isMaintenance: inMemoryGeneral.website_status === "MAINTENANCE",
        message: inMemoryAdvanced.maintenance_message,
      },
    };

    cachedPublicConfig = config;
    cacheTimestamp = now;

    return config;
  }
}
