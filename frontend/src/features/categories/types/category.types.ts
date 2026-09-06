export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  cover_image_url?: string | null;
  is_active: boolean;
  is_visible: boolean;
  sort_order: number;
  photo_count?: number;
  project_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  cover_image_url: string;
  is_active: boolean;
  is_visible: boolean;
}
