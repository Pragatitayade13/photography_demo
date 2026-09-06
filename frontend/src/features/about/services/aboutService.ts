import { apiClient } from "../../../services/apiClient";
import { PublicAboutData, AboutSection, PhotographerProfile } from "../types/about.types";

export const aboutService = {
  // Public Read
  async getPublicAbout(): Promise<PublicAboutData> {
    const res = await apiClient.get<PublicAboutData>("/about");
    return res.data;
  },

  // Admin Read
  async getAdminAbout(): Promise<{
    profile: PhotographerProfile;
    sections: AboutSection[];
    press: string[];
    accolades: { value: string; label: string }[];
  }> {
    const res = await apiClient.get<{
      profile: PhotographerProfile;
      sections: AboutSection[];
      press: string[];
      accolades: { value: string; label: string }[];
    }>("/about/admin");
    return res.data;
  },

  // Admin Mutations
  async updateProfile(profileData: Partial<PhotographerProfile>): Promise<PhotographerProfile> {
    const res = await apiClient.put<PhotographerProfile>("/about/profile", profileData);
    return res.data;
  },

  async updateSection(
    sectionKey: string,
    configuration: Record<string, any>,
    title?: string,
    is_visible?: boolean
  ): Promise<AboutSection> {
    const res = await apiClient.put<AboutSection>(`/about/sections/${sectionKey}`, {
      configuration,
      title,
      is_visible,
    });
    return res.data;
  },

  async toggleVisibility(sectionKey: string, is_visible: boolean): Promise<AboutSection> {
    const res = await apiClient.patch<AboutSection>(`/about/sections/${sectionKey}/visibility`, {
      is_visible,
    });
    return res.data;
  },

  async reorderSections(orderedKeys: string[]): Promise<AboutSection[]> {
    const res = await apiClient.patch<AboutSection[]>("/about/sections/reorder", {
      ordered_keys: orderedKeys,
    });
    return res.data;
  },

  async resetToDefault(): Promise<{
    profile: PhotographerProfile;
    sections: AboutSection[];
    press: string[];
    accolades: { value: string; label: string }[];
  }> {
    const res = await apiClient.post<{
      profile: PhotographerProfile;
      sections: AboutSection[];
      press: string[];
      accolades: { value: string; label: string }[];
    }>("/about/reset");
    return res.data;
  },
};
