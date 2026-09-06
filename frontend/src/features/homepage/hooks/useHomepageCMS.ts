import { useState, useEffect, useCallback } from "react";
import { HomepageSection } from "../types/homepage.types";
import { homepageService } from "../services/homepageService";

export const useHomepageCMS = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await homepageService.getAllSections();
      setSections(data);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to load homepage sections");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const updateSectionConfig = async (
    sectionKey: string,
    configuration: Record<string, any>,
    title?: string,
    isVisible?: boolean
  ) => {
    setIsSaving(true);
    setError(null);
    try {
      await homepageService.updateSection(sectionKey, {
        configuration,
        title,
        is_visible: isVisible,
      });
      setSuccessMessage(`Section "${title || sectionKey}" updated successfully`);
      setTimeout(() => setSuccessMessage(null), 3500);
      await fetchSections();
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to save section");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = async (sectionKey: string, isVisible: boolean) => {
    try {
      await homepageService.toggleVisibility(sectionKey, isVisible);
      await fetchSections();
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to update section visibility");
    }
  };

  const moveSection = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const items = reordered.map((sec, idx) => ({
      section_key: sec.section_key,
      sort_order: idx + 1,
    }));

    setSections(reordered);
    try {
      await homepageService.reorderSections(items);
      await fetchSections();
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to reorder sections");
    }
  };

  const resetToDefault = async () => {
    setIsSaving(true);
    try {
      const reset = await homepageService.resetSections();
      setSections(reset);
      setSuccessMessage("Homepage layout reset to default preset");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to reset layout");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    sections,
    isLoading,
    isSaving,
    error,
    successMessage,
    refresh: fetchSections,
    updateSectionConfig,
    toggleVisibility,
    moveSection,
    resetToDefault,
  };
};
