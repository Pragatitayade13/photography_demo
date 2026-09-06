import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { PublicSiteConfig } from "../../../types/settings";
import { settingsApi } from "../../../services/settingsApi";

const DEFAULT_CONFIG: PublicSiteConfig = {
  site: {
    name: "Alex Mercer Photography",
    photographerName: "Alex Mercer",
    tagline: "Visual Narratives & Editorial Chiaroscuro",
    description:
      "Fine art & editorial photography dedicated to capturing monumental architectural form, high-fashion storytelling, and destination celebrations across Europe and Asia.",
    status: "ACTIVE",
    defaultCtaText: "Inquire Commission",
    defaultCtaUrl: "/contact",
    location: "Paris · Lake Como · Milan · Tokyo · New York",
  },
  branding: {
    brandName: "Alex Mercer Studio Atelier",
    brandTagline: "Studio Atelier & Monograph Archive",
    logo: "",
    logoDark: "",
    logoLight: "",
    favicon: "",
    ogImage: "/uploads/wedding_royal_red_lehenga.jpg",
  },
  contact: {
    email: "studio@alexmercer.com",
    phone: "+1 (555) 019-2834",
    whatsappNumber: "+1 (555) 019-2834",
    location: "Paris · Lake Como · Milan · Tokyo · New York",
    availability: "Accepting 2026/2027 Commissions Worldwide",
    responseTime: "Inquiries responded within 24 business hours",
    businessHours: "Mon - Fri: 09:00 - 18:00 CET",
    enableEnquiries: true,
  },
  navigation: [
    { id: "nav-1", label: "Portfolio", url: "/portfolio", type: "INTERNAL", sortOrder: 1, openNewTab: false },
    { id: "nav-2", label: "About", url: "/about", type: "INTERNAL", sortOrder: 2, openNewTab: false },
    { id: "nav-3", label: "Contact", url: "/contact", type: "INTERNAL", sortOrder: 3, openNewTab: false },
  ],
  socialLinks: [
    { id: "soc-1", platform: "Instagram", label: "@alexmercer.atelier", url: "https://instagram.com/alexmercer", icon: "instagram", sortOrder: 1 },
    { id: "soc-2", platform: "Behance", label: "Alex Mercer Monograph", url: "https://behance.net/alexmercer", icon: "palette", sortOrder: 2 },
    { id: "soc-3", platform: "YouTube", label: "Cinematic Documentary", url: "https://youtube.com/@alexmercer", icon: "video", sortOrder: 3 },
    { id: "soc-4", platform: "WhatsApp", label: "Direct Studio Atelier Line", url: "https://wa.me/15550192834", icon: "message-circle", sortOrder: 4 },
  ],
  footer: {
    description:
      "Fine art & editorial photography dedicated to capturing monumental architectural form, high-fashion storytelling, and destination weddings across Europe and Asia.",
    copyrightText: "Alex Mercer Studio Atelier. All rights reserved. Photographs protected by international copyright law.",
    showSocialLinks: true,
    showContact: true,
    showNavigation: true,
  },
  seo: {
    siteTitle: "Alex Mercer — Luxury Editorial & Destination Wedding Photography",
    metaDescription:
      "Bespoke fine art, architectural monograph, and high-fashion wedding photography based in Paris and Lake Como. Available for worldwide commissions.",
    metaKeywords: "luxury photography, editorial wedding, lake como photographer, architectural photography, alex mercer",
    canonicalUrl: "https://alexmercer.photography",
    ogTitle: "Alex Mercer Studio Atelier — Fine Art Photography",
    ogDescription: "Award-winning medium format visual stories, architectural forms, and editorial wedding documentation.",
    ogImage: "/uploads/wedding_arch.jpg",
    twitterTitle: "Alex Mercer Photography",
    twitterDescription: "Visual stories and fine art monographs by Alex Mercer.",
    robotsIndex: true,
    robotsFollow: true,
  },
  maintenance: {
    isMaintenance: false,
    message: "The studio atelier is currently undergoing curation. For urgent commissions, please contact studio@alexmercer.com.",
  },
};

interface SiteConfigContextType {
  config: PublicSiteConfig;
  isLoading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: DEFAULT_CONFIG,
  isLoading: false,
  error: null,
  refreshConfig: async () => {},
});

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PublicSiteConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await settingsApi.getPublicSiteConfig();
      if (data) {
        setConfig(data);
      }
    } catch (err: any) {
      console.warn("Using fallback site configuration:", err?.message || err);
      setError(err?.message || "Failed to load live configuration");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        isLoading,
        error,
        refreshConfig: fetchConfig,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = (): SiteConfigContextType => {
  return useContext(SiteConfigContext);
};
