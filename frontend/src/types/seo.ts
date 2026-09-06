export interface GlobalSeoConfig {
  site_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  default_og_title: string;
  default_og_description: string;
  default_og_image_url: string;
  twitter_card_type: "summary" | "summary_large_image";
  robots_index: boolean;
  robots_follow: boolean;
  google_verification_code?: string;
  bing_verification_code?: string;
}

export interface PageSeoEntity {
  id: string;
  page_key: string;
  page_name?: string;
  seo_title: string;
  meta_description: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  twitter_title?: string;
  twitter_description?: string;
  robots_index: boolean;
  robots_follow: boolean;
  updated_at: string;
}

export interface ProjectSeoEntity {
  id: string;
  project_id: string;
  project_title?: string;
  project_slug?: string;
  seo_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  twitter_title?: string;
  twitter_description?: string;
  robots_index: boolean;
  robots_follow: boolean;
  updated_at: string;
}
