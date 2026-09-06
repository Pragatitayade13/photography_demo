export interface PhotographerProfile {
  display_name: string;
  professional_title: string;
  short_bio: string;
  location: string;
  years_experience: number;
  profile_image_url: string;
  cover_image_url?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface PhilosophyPrinciple {
  number: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  short_description: string;
  deliverables?: string[];
  is_visible: boolean;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  client_names: string;
  event_type: string;
  quote: string;
  location?: string;
  is_visible: boolean;
}

export interface SocialProfile {
  platform: string;
  label: string;
  url: string;
  is_visible: boolean;
}

export interface AccoladeItem {
  value: string;
  label: string;
}

export type AboutSectionKey =
  | "story"
  | "philosophy"
  | "services"
  | "process"
  | "testimonials"
  | "social";

export interface AboutSection {
  id: string;
  section_key: AboutSectionKey | string;
  title: string;
  is_visible: boolean;
  sort_order: number;
  configuration: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PublicAboutData {
  profile: PhotographerProfile;
  sections: AboutSection[];
  press: string[];
  accolades: AccoladeItem[];
}
