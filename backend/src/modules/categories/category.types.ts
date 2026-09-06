export interface CategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  cover_image_url?: string | null;
  is_active: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CategoryWithStats extends CategoryEntity {
  photo_count?: number;
  project_count?: number;
}

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  cover_image_url?: string;
  is_active?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  cover_image_url?: string;
  is_active?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

export interface ReorderCategoryItem {
  id: string;
  sort_order: number;
}
