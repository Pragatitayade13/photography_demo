import { apiClient } from "../../../services/apiClient";
import { ApiResponse } from "../../../types";
import { Category } from "../types/category.types";

export const categoryService = {
  getCategories: async (params?: {
    search?: string;
    status?: string;
    public?: boolean;
  }): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>("/categories", { params });
    return response.data.data!;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data!;
  },

  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>("/categories", data);
    return response.data.data!;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data!;
  },

  toggleStatus: async (
    id: string,
    status: { is_active?: boolean; is_visible?: boolean }
  ): Promise<Category> => {
    const response = await apiClient.patch<ApiResponse<Category>>(
      `/categories/${id}/status`,
      status
    );
    return response.data.data!;
  },

  reorderCategories: async (items: { id: string; sort_order: number }[]): Promise<void> => {
    await apiClient.patch("/categories/reorder", { items });
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
