import { useState, useEffect, useCallback } from "react";
import { Category, CategoryFormData } from "../types/category.types";
import { categoryService } from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories({
        search: searchQuery || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setCategories(data);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (formData: CategoryFormData): Promise<Category> => {
    const created = await categoryService.createCategory(formData);
    await fetchCategories();
    return created;
  };

  const updateCategory = async (id: string, formData: Partial<CategoryFormData>): Promise<Category> => {
    const updated = await categoryService.updateCategory(id, formData);
    await fetchCategories();
    return updated;
  };

  const toggleStatus = async (id: string, status: { is_active?: boolean; is_visible?: boolean }): Promise<void> => {
    await categoryService.toggleStatus(id, status);
    await fetchCategories();
  };

  const deleteCategory = async (id: string): Promise<void> => {
    await categoryService.deleteCategory(id);
    await fetchCategories();
  };

  const reorderCategories = async (items: { id: string; sort_order: number }[]): Promise<void> => {
    await categoryService.reorderCategories(items);
    await fetchCategories();
  };

  return {
    categories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refresh: fetchCategories,
    createCategory,
    updateCategory,
    toggleStatus,
    deleteCategory,
    reorderCategories,
  };
};
