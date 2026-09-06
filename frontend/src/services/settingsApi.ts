import { apiClient } from "./apiClient";
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
  PublicSiteConfig,
} from "../types/settings";

export const settingsApi = {
  // Public
  getPublicSiteConfig: async (): Promise<PublicSiteConfig> => {
    const res = await apiClient.get<{ success: boolean; data: PublicSiteConfig }>("/public/site-config");
    return res.data.data;
  },

  // Admin All
  getAllAdminSettings: async (): Promise<AllAdminSettings> => {
    const res = await apiClient.get<{ success: boolean; data: AllAdminSettings }>("/settings");
    return res.data.data;
  },

  // Subsections
  updateGeneralSettings: async (payload: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    const res = await apiClient.patch<{ success: boolean; data: GeneralSettings }>("/settings", payload);
    return res.data.data;
  },

  updateBrandingSettings: async (payload: Partial<BrandingSettings>): Promise<BrandingSettings> => {
    const res = await apiClient.patch<{ success: boolean; data: BrandingSettings }>("/settings/branding", payload);
    return res.data.data;
  },

  updateContactSettings: async (payload: Partial<ContactSettings>): Promise<ContactSettings> => {
    const res = await apiClient.patch<{ success: boolean; data: ContactSettings }>("/settings/contact", payload);
    return res.data.data;
  },

  updateAdvancedSettings: async (payload: Partial<AdvancedSettings>): Promise<AdvancedSettings> => {
    const res = await apiClient.patch<{ success: boolean; data: AdvancedSettings }>("/settings/advanced", payload);
    return res.data.data;
  },

  // Navigation
  getNavigationItems: async (): Promise<NavigationItem[]> => {
    const res = await apiClient.get<{ success: boolean; data: NavigationItem[] }>("/settings/navigation");
    return res.data.data;
  },

  createNavigationItem: async (payload: Omit<NavigationItem, "id">): Promise<NavigationItem> => {
    const res = await apiClient.post<{ success: boolean; data: NavigationItem }>("/settings/navigation", payload);
    return res.data.data;
  },

  updateNavigationItem: async (id: string, payload: Partial<NavigationItem>): Promise<NavigationItem> => {
    const res = await apiClient.patch<{ success: boolean; data: NavigationItem }>(`/settings/navigation/${id}`, payload);
    return res.data.data;
  },

  deleteNavigationItem: async (id: string): Promise<boolean> => {
    const res = await apiClient.delete<{ success: boolean; data: { id: string; deleted: boolean } }>(
      `/settings/navigation/${id}`
    );
    return res.data.data.deleted;
  },

  reorderNavigation: async (items: Array<{ id: string; sort_order: number }>): Promise<NavigationItem[]> => {
    const res = await apiClient.patch<{ success: boolean; data: NavigationItem[] }>("/settings/navigation/reorder", {
      items,
    });
    return res.data.data;
  },

  // Social Links
  getSocialLinks: async (): Promise<SocialLink[]> => {
    const res = await apiClient.get<{ success: boolean; data: SocialLink[] }>("/settings/social-links");
    return res.data.data;
  },

  createSocialLink: async (payload: Omit<SocialLink, "id">): Promise<SocialLink> => {
    const res = await apiClient.post<{ success: boolean; data: SocialLink }>("/settings/social-links", payload);
    return res.data.data;
  },

  updateSocialLink: async (id: string, payload: Partial<SocialLink>): Promise<SocialLink> => {
    const res = await apiClient.patch<{ success: boolean; data: SocialLink }>(`/settings/social-links/${id}`, payload);
    return res.data.data;
  },

  deleteSocialLink: async (id: string): Promise<boolean> => {
    const res = await apiClient.delete<{ success: boolean; data: { id: string; deleted: boolean } }>(
      `/settings/social-links/${id}`
    );
    return res.data.data.deleted;
  },

  reorderSocialLinks: async (items: Array<{ id: string; sort_order: number }>): Promise<SocialLink[]> => {
    const res = await apiClient.patch<{ success: boolean; data: SocialLink[] }>("/settings/social-links/reorder", {
      items,
    });
    return res.data.data;
  },

  // Footer
  getFooterSettings: async (): Promise<FooterSettings> => {
    const res = await apiClient.get<{ success: boolean; data: FooterSettings }>("/settings/footer");
    return res.data.data;
  },

  updateFooterSettings: async (payload: Partial<FooterSettings>): Promise<FooterSettings> => {
    const res = await apiClient.patch<{ success: boolean; data: FooterSettings }>("/settings/footer", payload);
    return res.data.data;
  },

  // SEO
  getSeoSettings: async (): Promise<SeoSettings> => {
    const res = await apiClient.get<{ success: boolean; data: SeoSettings }>("/settings/seo");
    return res.data.data;
  },

  updateSeoSettings: async (payload: Partial<SeoSettings>): Promise<SeoSettings> => {
    const res = await apiClient.patch<{ success: boolean; data: SeoSettings }>("/settings/seo", payload);
    return res.data.data;
  },
};
