import { Photo } from "../../photos/types/photo.types";

export interface ProjectComparison {
  id: string;
  project_id: string;
  before_image_url: string;
  after_image_url: string;
  title: string;
  description?: string | null;
  before_label?: string;
  after_label?: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  location?: string | null;
  project_date?: string | null;
  is_published: boolean;
  is_featured: boolean;
  featured_order?: number;
  featured_start_date?: string | null;
  featured_end_date?: string | null;
  show_in_search?: boolean;
  show_related_projects?: boolean;
  enable_gallery?: boolean;
  enable_before_after?: boolean;
  show_enquiry_cta?: boolean;
  allow_sharing?: boolean;
  tags?: string[];
  is_visible: boolean;
  sort_order: number;
  photo_count?: number;
  photos?: Photo[];
  related_projects?: Project[];
  comparisons?: ProjectComparison[];
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  title: string;
  slug?: string;
  short_description?: string;
  description?: string;
  cover_image_url?: string;
  category_id?: string;
  location?: string;
  project_date?: string;
  is_published: boolean;
  is_featured: boolean;
  featured_order?: number;
  show_in_search?: boolean;
  show_related_projects?: boolean;
  enable_gallery?: boolean;
  enable_before_after?: boolean;
  show_enquiry_cta?: boolean;
  allow_sharing?: boolean;
  tags?: string[];
  is_visible: boolean;
  photo_ids?: string[];
}

export interface ProjectSearchResponse {
  items: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: Array<{ id: string; name: string; slug: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
    years: number[];
    locations: string[];
  };
}

export interface CreateComparisonDTO {
  project_id: string;
  before_image_url: string;
  after_image_url: string;
  title: string;
  description?: string;
  before_label?: string;
  after_label?: string;
  is_visible?: boolean;
  sort_order?: number;
}
