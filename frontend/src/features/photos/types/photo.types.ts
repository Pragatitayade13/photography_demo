export interface Photo {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image_url: string;
  thumbnail_url?: string | null;
  alt_text: string;
  location?: string | null;
  photo_date?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  is_published: boolean;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  width?: number | null;
  height?: number | null;
  file_size?: number | null;
  mime_type?: string | null;
  metadata?: {
    camera?: string;
    lens?: string;
    iso?: number;
    aperture?: string;
    shutter?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface PhotoFormData {
  title: string;
  slug?: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  alt_text: string;
  location?: string;
  photo_date?: string;
  category_id?: string;
  is_published: boolean;
  is_featured: boolean;
  is_visible: boolean;
  metadata?: Record<string, any>;
}

export interface PhotoUploadResponse {
  image_url: string;
  thumbnail_url?: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
}
