import { PhotoWithCategory } from "../photos/photo.types.js";
import { ProjectWithDetails } from "../projects/project.types.js";
import { CategoryWithStats } from "../categories/category.types.js";

export type HomepageSectionKey =
  | "hero"
  | "intro"
  | "featured_projects"
  | "categories"
  | "selected_work"
  | "about_preview"
  | "cta";

export interface HomepageSectionEntity {
  id: string;
  section_key: HomepageSectionKey | string;
  title: string;
  is_visible: boolean;
  sort_order: number;
  configuration: Record<string, any>;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface HeroConfig {
  headline: string;
  subheadline?: string;
  media_type: "image" | "video";
  media_url: string;
  mobile_media_url?: string;
  primary_btn_text?: string;
  primary_btn_link?: string;
  secondary_btn_text?: string;
  secondary_btn_link?: string;
}

export interface IntroConfig {
  eyebrow?: string;
  heading: string;
  description: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
}

export interface FeaturedProjectsConfig {
  heading: string;
  subheading?: string;
  project_ids: string[];
  max_display: number;
}

export interface CategoriesConfig {
  heading: string;
  subheading?: string;
  show_counts: boolean;
}

export interface SelectedWorkConfig {
  heading: string;
  subheading?: string;
  photo_ids: string[];
  max_display: number;
}

export interface AboutPreviewConfig {
  eyebrow?: string;
  heading: string;
  bio_paragraphs: string[];
  portrait_image_url?: string;
  accolades?: { label: string; value: string }[];
  cta_text?: string;
  cta_link?: string;
}

export interface CtaConfig {
  heading: string;
  subheading?: string;
  button_text: string;
  button_link: string;
  bg_image_url?: string;
}

export interface PublicHomepagePayload {
  sections: {
    section_key: string;
    title: string;
    sort_order: number;
    configuration: Record<string, any>;
    data?: {
      projects?: ProjectWithDetails[];
      categories?: CategoryWithStats[];
      photos?: PhotoWithCategory[];
    };
  }[];
}
