import { useState, useEffect, useCallback } from "react";
import { aboutService } from "../../../about/services/aboutService";
import { AboutSection, PhotographerProfile } from "../../../about/types/about.types";

export const useAboutCMS = () => {
  const [profile, setProfile] = useState<PhotographerProfile | null>(null);
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [press, setPress] = useState<string[]>([]);
  const [accolades, setAccolades] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const loadAdminAbout = useCallback(async () => {
    setIsLoading(true);
    clearMessages();
    try {
      const data = await aboutService.getAdminAbout();
      setProfile(data.profile);
      setSections(data.sections);
      setPress(data.press);
      setAccolades(data.accolades);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to load About settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminAbout();
  }, [loadAdminAbout]);

  const updateProfile = async (profileData: Partial<PhotographerProfile>) => {
    setIsSaving(true);
    clearMessages();
    try {
      const updated = await aboutService.updateProfile(profileData);
      setProfile(updated);
      setSuccessMessage("Photographer profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSectionConfig = async (
    sectionKey: string,
    configuration: Record<string, any>,
    title?: string,
    isVisible?: boolean
  ) => {
    setIsSaving(true);
    clearMessages();
    try {
      const updated = await aboutService.updateSection(sectionKey, configuration, title, isVisible);
      setSections((prev) =>
        prev.map((s) => (s.section_key === sectionKey ? updated : s))
      );
      setSuccessMessage(`Section '${updated.title}' updated successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to update section");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = async (sectionKey: string, currentVisibility: boolean) => {
    clearMessages();
    try {
      const updated = await aboutService.toggleVisibility(sectionKey, !currentVisibility);
      setSections((prev) =>
        prev.map((s) => (s.section_key === sectionKey ? updated : s))
      );
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to update visibility");
    }
  };

  const moveSection = async (sectionKey: string, direction: "up" | "down") => {
    const currentIndex = sections.findIndex((s) => s.section_key === sectionKey);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(newIndex, 0, moved);

    setSections(reordered);
    const orderedKeys = reordered.map((s) => s.section_key);

    try {
      await aboutService.reorderSections(orderedKeys);
    } catch (err: any) {
      setError("Failed to save reordered sections");
      await loadAdminAbout();
    }
  };

  const resetToDefault = async () => {
    if (!window.confirm("Are you sure you want to reset the About page to default editorial content?")) {
      return;
    }
    setIsSaving(true);
    clearMessages();
    try {
      const reset = await aboutService.resetToDefault();
      setProfile(reset.profile);
      setSections(reset.sections);
      setPress(reset.press);
      setAccolades(reset.accolades);
      setSuccessMessage("About page reset to default successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to reset About page");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    sections,
    press,
    accolades,
    isLoading,
    isSaving,
    error,
    successMessage,
    updateProfile,
    updateSectionConfig,
    toggleVisibility,
    moveSection,
    resetToDefault,
    refresh: loadAdminAbout,
  };
};
