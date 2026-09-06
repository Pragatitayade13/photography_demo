export type WebsiteStatus = "ACTIVE" | "MAINTENANCE" | "PRIVATE";
export type NavigationItemType = "INTERNAL" | "EXTERNAL" | "ANCHOR";

export interface GeneralSettings {
  site_name: string;
  photographer_name: string;
  tagline: string;
  description: string;
  website_status: WebsiteStatus;
  default_cta_text: string;
  default_cta_url: string;
  location: string;
  timezone: string;
}

export interface BrandingSettings {
  brand_name: string;
  brand_tagline: string;
  logo_url: string;
  logo_dark_url: string;
  logo_light_url: string;
  favicon_url: string;
  og_image_url: string;
}

export interface ContactSettings {
  public_email: string;
  public_phone: string;
  whatsapp_number: string;
  location: string;
  availability_text: string;
  response_time_text: string;
  business_hours: string;
}

export interface AdvancedSettings {
  website_status: WebsiteStatus;
  maintenance_message: string;
  analytics_id: string;
  enable_public_enquiries: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  type: NavigationItemType;
  sort_order: number;
  is_visible: boolean;
  open_new_tab: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FooterSettings {
  description: string;
  copyright_text: string;
  show_social_links: boolean;
  show_contact: boolean;
  show_navigation: boolean;
}

export interface SeoSettings {
  site_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  twitter_title: string;
  twitter_description: string;
  robots_index: boolean;
  robots_follow: boolean;
}

export interface AllAdminSettings {
  general: GeneralSettings;
  branding: BrandingSettings;
  contact: ContactSettings;
  advanced: AdvancedSettings;
  footer: FooterSettings;
  seo: SeoSettings;
  navigation: NavigationItem[];
  social_links: SocialLink[];
  updated_at: string;
}

export interface PublicSiteConfig {
  site: {
    name: string;
    photographerName: string;
    tagline: string;
    description: string;
    status: WebsiteStatus;
    defaultCtaText: string;
    defaultCtaUrl: string;
    location: string;
  };
  branding: {
    brandName: string;
    brandTagline: string;
    logo: string;
    logoDark: string;
    logoLight: string;
    favicon: string;
    ogImage: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsappNumber: string;
    location: string;
    availability: string;
    responseTime: string;
    businessHours: string;
    enableEnquiries: boolean;
  };
  navigation: Array<{
    id: string;
    label: string;
    url: string;
    type: NavigationItemType;
    sortOrder: number;
    openNewTab: boolean;
  }>;
  socialLinks: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
    icon: string;
    sortOrder: number;
  }>;
  footer: {
    description: string;
    copyrightText: string;
    showSocialLinks: boolean;
    showContact: boolean;
    showNavigation: boolean;
  };
  seo: {
    siteTitle: string;
    metaDescription: string;
    metaKeywords: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
  };
  maintenance: {
    isMaintenance: boolean;
    message: string;
  };
}
