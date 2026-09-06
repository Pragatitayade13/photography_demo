import { apiClient } from "../../../services/apiClient";
import { ApiResponse } from "../../../types";
import {
  Project,
  ProjectFormData,
  ProjectSearchResponse,
  ProjectComparison,
  CreateComparisonDTO,
} from "../types/project.types";

export const projectService = {
  getProjects: async (params?: {
    category_id?: string;
    category_slug?: string;
    is_published?: boolean;
    is_featured?: boolean;
    is_visible?: boolean;
    search?: string;
    public?: boolean;
  }): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>("/projects", { params });
    return response.data.data!;
  },

  // --- VS-14: PUBLIC SEARCH & FACETED FILTERS ---
  searchProjects: async (params?: {
    search?: string;
    category?: string;
    tag?: string;
    location?: string;
    year?: string | number;
    featured?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ProjectSearchResponse> => {
    const response = await apiClient.get<ApiResponse<ProjectSearchResponse>>("/projects/public/search", {
      params,
    });
    return response.data.data!;
  },

  // --- VS-14: FEATURED PROJECTS ---
  getFeaturedProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>("/projects/public/featured");
    return response.data.data!;
  },

  updateFeaturedOrder: async (
    items: Array<{ id: string; featured_order: number; is_featured?: boolean }>
  ): Promise<void> => {
    await apiClient.patch("/projects/featured/reorder", { items });
  },

  // --- VS-14: RELATED PROJECTS ---
  getRelatedProjects: async (projectId: string, limit = 3): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>(`/projects/${projectId}/related`, {
      params: { limit },
    });
    return response.data.data!;
  },

  setRelatedProjects: async (projectId: string, relatedProjectIds: string[]): Promise<void> => {
    await apiClient.put(`/projects/${projectId}/related`, {
      related_project_ids: relatedProjectIds,
    });
  },

  // --- VS-14: BEFORE/AFTER COMPARISONS ---
  getComparisons: async (projectId: string, admin = false): Promise<ProjectComparison[]> => {
    const response = await apiClient.get<ApiResponse<ProjectComparison[]>>(
      `/projects/${projectId}/comparisons`,
      { params: { admin: admin ? "true" : undefined } }
    );
    return response.data.data!;
  },

  createComparison: async (data: CreateComparisonDTO): Promise<ProjectComparison> => {
    const response = await apiClient.post<ApiResponse<ProjectComparison>>(
      `/projects/${data.project_id}/comparisons`,
      data
    );
    return response.data.data!;
  },

  updateComparison: async (
    id: string,
    data: Partial<CreateComparisonDTO>
  ): Promise<ProjectComparison> => {
    const response = await apiClient.patch<ApiResponse<ProjectComparison>>(
      `/projects/comparisons/${id}`,
      data
    );
    return response.data.data!;
  },

  deleteComparison: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/comparisons/${id}`);
  },

  // --- CORE GETTERS & MUTATIONS ---
  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data!;
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/slug/${slug}`);
    return response.data.data!;
  },

  createProject: async (data: Partial<ProjectFormData>): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>("/projects", data);
    return response.data.data!;
  },

  updateProject: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data!;
  },

  toggleStatus: async (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}/status`, status);
    return response.data.data!;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  addPhotosToProject: async (projectId: string, photoIds: string[]): Promise<void> => {
    await apiClient.post(`/projects/${projectId}/photos`, { photo_ids: photoIds });
  },

  removePhotoFromProject: async (projectId: string, photoId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/photos/${photoId}`);
  },

  reorderProjectPhotos: async (
    projectId: string,
    items: { photo_id: string; sort_order: number }[]
  ): Promise<void> => {
    await apiClient.patch(`/projects/${projectId}/photos/reorder`, { items });
  },
};
