import { apiClient } from "./apiClient";
import { GlobalSeoConfig, PageSeoEntity, ProjectSeoEntity } from "../types/seo";

export const seoApi = {
  getGlobalSeo: async (): Promise<GlobalSeoConfig> => {
    const res = await apiClient.get<{ success: boolean; data: GlobalSeoConfig }>("/seo/global");
    return res.data.data;
  },

  updateGlobalSeo: async (payload: Partial<GlobalSeoConfig>): Promise<GlobalSeoConfig> => {
    const res = await apiClient.patch<{ success: boolean; data: GlobalSeoConfig }>("/seo/global", payload);
    return res.data.data;
  },

  getAllPageSeo: async (): Promise<PageSeoEntity[]> => {
    const res = await apiClient.get<{ success: boolean; data: PageSeoEntity[] }>("/seo/pages");
    return res.data.data;
  },

  getPageSeo: async (pageKey: string): Promise<PageSeoEntity> => {
    const res = await apiClient.get<{ success: boolean; data: PageSeoEntity }>(`/seo/pages/${pageKey}`);
    return res.data.data;
  },

  updatePageSeo: async (pageKey: string, payload: Partial<PageSeoEntity>): Promise<PageSeoEntity> => {
    const res = await apiClient.patch<{ success: boolean; data: PageSeoEntity }>(`/seo/pages/${pageKey}`, payload);
    return res.data.data;
  },

  getProjectSeo: async (projectId: string): Promise<ProjectSeoEntity> => {
    const res = await apiClient.get<{ success: boolean; data: ProjectSeoEntity }>(`/seo/projects/${projectId}`);
    return res.data.data;
  },

  updateProjectSeo: async (projectId: string, payload: Partial<ProjectSeoEntity>): Promise<ProjectSeoEntity> => {
    const res = await apiClient.patch<{ success: boolean; data: ProjectSeoEntity }>(`/seo/projects/${projectId}`, payload);
    return res.data.data;
  },
};
