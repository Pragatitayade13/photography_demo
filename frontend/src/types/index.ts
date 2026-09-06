export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface HealthData {
  status: string;
  database: string;
  uptime: number;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  location?: string;
  photoDate?: string;
  categoryId?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}
