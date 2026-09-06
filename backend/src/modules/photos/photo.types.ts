export interface PhotoEntity {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image_url: string;
  thumbnail_url?: string | null;
  alt_text: string;
  location?: string | null;
  photo_date?: string | Date | null;
  category_id?: string | null;
  is_published: boolean;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  width?: number | null;
  height?: number | null;
  file_size?: number | null;
  mime_type?: string | null;
  metadata?: Record<string, any>;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface PhotoWithCategory extends PhotoEntity {
  category_name?: string | null;
  category_slug?: string | null;
}

export interface CreatePhotoDTO {
  title: string;
  slug?: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  alt_text: string;
  location?: string;
  photo_date?: string;
  category_id?: string;
  is_published?: boolean;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  width?: number;
  height?: number;
  file_size?: number;
  mime_type?: string;
  metadata?: Record<string, any>;
}

export interface UpdatePhotoDTO {
  title?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  alt_text?: string;
  location?: string;
  photo_date?: string;
  category_id?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  width?: number;
  height?: number;
  file_size?: number;
  mime_type?: string;
  metadata?: Record<string, any>;
}

export interface PhotoFilterOptions {
  category_id?: string;
  category_slug?: string;
  is_published?: boolean;
  is_featured?: boolean;
  is_visible?: boolean;
  search?: string;
  publicOnly?: boolean;
  page?: number;
  limit?: number;
}
