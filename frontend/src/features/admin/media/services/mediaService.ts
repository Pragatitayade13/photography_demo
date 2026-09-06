import { apiClient } from "../../../../services/apiClient";
import {
  MediaAsset,
  OptimizedPublicMedia,
  MediaFilterQuery,
  MediaListResponse,
  UpdateMediaMetadataDto,
  MediaVisibility,
} from "../types/media.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const mediaService = {
  // Public APIs
  async getPublicMedia(id: string): Promise<OptimizedPublicMedia> {
    const res = await apiClient.get<ApiResponse<OptimizedPublicMedia>>(`/public/media/${id}`);
    return (res.data.data !== undefined ? res.data.data : res.data) as OptimizedPublicMedia;
  },

  async getBatchPublicMedia(ids: string[]): Promise<OptimizedPublicMedia[]> {
    const res = await apiClient.post<ApiResponse<OptimizedPublicMedia[]>>("/public/media/batch", { ids });
    return (res.data.data !== undefined ? res.data.data : res.data) as OptimizedPublicMedia[];
  },

  // Admin APIs
  async getAdminMediaList(params?: MediaFilterQuery): Promise<MediaListResponse> {
    const res = await apiClient.get<ApiResponse<MediaListResponse>>("/admin/media", { params });
    return (res.data.data !== undefined ? res.data.data : res.data) as MediaListResponse;
  },

  async getAdminMediaDetails(id: string): Promise<MediaAsset> {
    const res = await apiClient.get<ApiResponse<MediaAsset>>(`/admin/media/${id}`);
    return (res.data.data !== undefined ? res.data.data : res.data) as MediaAsset;
  },

  async uploadMedia(
    file: File,
    metadata?: { alt_text?: string; caption?: string; visibility?: MediaVisibility }
  ): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata?.alt_text) formData.append("alt_text", metadata.alt_text);
    if (metadata?.caption) formData.append("caption", metadata.caption);
    if (metadata?.visibility) formData.append("visibility", metadata.visibility);

    const res = await apiClient.post<ApiResponse<MediaAsset>>("/admin/media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return (res.data.data !== undefined ? res.data.data : res.data) as MediaAsset;
  },

  async updateMetadata(id: string, data: UpdateMediaMetadataDto): Promise<MediaAsset> {
    const res = await apiClient.patch<ApiResponse<MediaAsset>>(`/admin/media/${id}`, data);
    return (res.data.data !== undefined ? res.data.data : res.data) as MediaAsset;
  },

  async updateVisibility(id: string, visibility: MediaVisibility): Promise<MediaAsset> {
    const res = await apiClient.patch<ApiResponse<MediaAsset>>(`/admin/media/${id}/visibility`, { visibility });
    return (res.data.data !== undefined ? res.data.data : res.data) as MediaAsset;
  },

  async retryProcessing(id: string): Promise<MediaAsset> {
    const res = await apiClient.post<ApiResponse<MediaAsset>>(`/admin/media/${id}/retry-processing`);
    return (res.data.data !== undefined ? res.data.data : res.data) as MediaAsset;
  },

  async regenerateVariants(id: string): Promise<MediaAsset> {
    const res = await apiClient.post<ApiResponse<MediaAsset>>(`/admin/media/${id}/regenerate`);
    return (res.data.data !== undefined ? res.data.data : res.data) as MediaAsset;
  },

  async deleteMedia(id: string): Promise<boolean> {
    await apiClient.delete(`/admin/media/${id}`);
    return true;
  },
};
