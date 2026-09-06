import { apiClient } from "../../../services/apiClient";
import { ApiResponse } from "../../../types";
import { Photo, PhotoFormData, PhotoUploadResponse } from "../types/photo.types";

export const photoService = {
  getPhotos: async (params?: {
    category_id?: string;
    category_slug?: string;
    is_published?: boolean;
    is_featured?: boolean;
    is_visible?: boolean;
    search?: string;
    public?: boolean;
  }): Promise<{ photos: Photo[]; total: number }> => {
    const response = await apiClient.get<ApiResponse<{ photos: Photo[]; total: number }>>("/photos", {
      params,
    });
    return response.data.data!;
  },

  getPhoto: async (id: string): Promise<Photo> => {
    const response = await apiClient.get<ApiResponse<Photo>>(`/photos/${id}`);
    return response.data.data!;
  },

  uploadImage: async (file: File): Promise<PhotoUploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<ApiResponse<PhotoUploadResponse>>(
      "/photos/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data!;
  },

  createPhoto: async (data: Partial<PhotoFormData>): Promise<Photo> => {
    const response = await apiClient.post<ApiResponse<Photo>>("/photos", data);
    return response.data.data!;
  },

  updatePhoto: async (id: string, data: Partial<PhotoFormData>): Promise<Photo> => {
    const response = await apiClient.put<ApiResponse<Photo>>(`/photos/${id}`, data);
    return response.data.data!;
  },

  toggleStatus: async (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ): Promise<Photo> => {
    const response = await apiClient.patch<ApiResponse<Photo>>(`/photos/${id}/status`, status);
    return response.data.data!;
  },

  reorderPhotos: async (items: { id: string; sort_order: number }[]): Promise<void> => {
    await apiClient.patch("/photos/reorder", { items });
  },

  deletePhoto: async (id: string): Promise<void> => {
    await apiClient.delete(`/photos/${id}`);
  },
};
