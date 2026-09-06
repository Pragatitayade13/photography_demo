export type MediaVisibility = "PUBLIC" | "PRIVATE" | "DRAFT" | "ARCHIVED";
export type MediaProcessingStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED" | "RETRY_REQUIRED";
export type MediaVariantName = "thumbnail" | "small" | "medium" | "large" | "xlarge" | "original";

export interface MediaVariant {
  id: string;
  media_id: string;
  variant_name: MediaVariantName;
  width: number;
  height: number;
  mime_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  original_filename: string;
  stored_filename: string;
  mime_type: string;
  file_extension: string;
  file_size: number;
  width: number | null;
  height: number | null;
  aspect_ratio: number | null;
  storage_path: string;
  visibility: MediaVisibility;
  processing_status: MediaProcessingStatus;
  processing_error: string | null;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  variants?: MediaVariant[];
}

export interface OptimizedPublicMedia {
  id: string;
  altText: string;
  caption: string;
  width: number;
  height: number;
  src: string;
  srcSet: Array<{ width: number; url: string }>;
  aspectRatio: number;
}

export interface MediaFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: MediaVisibility;
  processing_status?: MediaProcessingStatus;
  mime_type?: string;
  sort_by?: "created_at" | "file_size" | "original_filename";
  sort_order?: "asc" | "desc";
}

export interface UpdateMediaMetadataDto {
  alt_text?: string;
  caption?: string;
  visibility?: MediaVisibility;
}

export interface MediaListResponse {
  items: MediaAsset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
