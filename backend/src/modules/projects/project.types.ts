import { PhotoWithCategory } from "../photos/photo.types.js";

export interface ProjectEntity {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  category_id?: string | null;
  location?: string | null;
  project_date?: string | Date | null;
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
  metadata?: Record<string, any>;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ProjectRelation {
  id: string;
  project_id: string;
  related_project_id: string;
  sort_order: number;
  created_at: string;
  related_project?: ProjectEntity;
}

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

export interface ProjectWithDetails extends ProjectEntity {
  category_name?: string | null;
  category_slug?: string | null;
  photo_count?: number;
  photos?: PhotoWithCategory[];
  related_projects?: ProjectEntity[];
  comparisons?: ProjectComparison[];
}

export interface CreateProjectDTO {
  title: string;
  slug?: string;
  short_description?: string;
  description?: string;
  cover_image_url?: string;
  category_id?: string;
  location?: string;
  project_date?: string;
  is_published?: boolean;
  is_featured?: boolean;
  featured_order?: number;
  featured_start_date?: string;
  featured_end_date?: string;
  show_in_search?: boolean;
  show_related_projects?: boolean;
  enable_gallery?: boolean;
  enable_before_after?: boolean;
  show_enquiry_cta?: boolean;
  allow_sharing?: boolean;
  tags?: string[];
  is_visible?: boolean;
  sort_order?: number;
  photo_ids?: string[];
}

export interface UpdateProjectDTO {
  title?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  cover_image_url?: string;
  category_id?: string | null;
  location?: string;
  project_date?: string;
  is_published?: boolean;
  is_featured?: boolean;
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
  is_visible?: boolean;
  sort_order?: number;
}

export interface ProjectFilterOptions {
  category_id?: string;
  category_slug?: string;
  tag?: string;
  location?: string;
  year?: string | number;
  is_published?: boolean;
  is_featured?: boolean;
  is_visible?: boolean;
  search?: string;
  publicOnly?: boolean;
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface ProjectSearchResponse {
  items: ProjectWithDetails[];
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

export interface UpdateComparisonDTO {
  before_image_url?: string;
  after_image_url?: string;
  title?: string;
  description?: string;
  before_label?: string;
  after_label?: string;
  is_visible?: boolean;
  sort_order?: number;
}

export interface SetRelatedProjectsDTO {
  related_project_ids: string[];
}

export interface UpdateFeaturedOrderDTO {
  items: Array<{ id: string; featured_order: number; is_featured?: boolean }>;
}
