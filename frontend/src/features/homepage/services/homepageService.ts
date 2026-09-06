import { apiClient } from "../../../services/apiClient";
import { ApiResponse } from "../../../types";
import { HomepageSection, PublicHomepageData } from "../types/homepage.types";

export const homepageService = {
  getPublicHomepage: async (): Promise<PublicHomepageData> => {
    const response = await apiClient.get<ApiResponse<PublicHomepageData>>("/homepage");
    return response.data.data!;
  },

  getAllSections: async (): Promise<HomepageSection[]> => {
    const response = await apiClient.get<ApiResponse<HomepageSection[]>>("/homepage/sections");
    return response.data.data!;
  },

  getSection: async (sectionKey: string): Promise<HomepageSection> => {
    const response = await apiClient.get<ApiResponse<HomepageSection>>(`/homepage/sections/${sectionKey}`);
    return response.data.data!;
  },

  updateSection: async (
    sectionKey: string,
    data: { title?: string; is_visible?: boolean; configuration?: Record<string, any> }
  ): Promise<HomepageSection> => {
    const response = await apiClient.put<ApiResponse<HomepageSection>>(
      `/homepage/sections/${sectionKey}`,
      data
    );
    return response.data.data!;
  },

  toggleVisibility: async (sectionKey: string, is_visible: boolean): Promise<HomepageSection> => {
    const response = await apiClient.patch<ApiResponse<HomepageSection>>(
      `/homepage/sections/${sectionKey}/visibility`,
      { is_visible }
    );
    return response.data.data!;
  },

  reorderSections: async (items: { section_key: string; sort_order: number }[]): Promise<void> => {
    await apiClient.patch("/homepage/sections/reorder", { items });
  },

  resetSections: async (): Promise<HomepageSection[]> => {
    const response = await apiClient.post<ApiResponse<HomepageSection[]>>("/homepage/reset");
    return response.data.data!;
  },
};
