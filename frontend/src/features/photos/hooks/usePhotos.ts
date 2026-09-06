import { useState, useEffect, useCallback } from "react";
import { Photo, PhotoFormData } from "../types/photo.types";
import { photoService } from "../services/photoService";

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // all, published, draft, featured

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {
        search: searchQuery || undefined,
        category_id: categoryFilter === "all" ? undefined : categoryFilter,
      };

      if (statusFilter === "published") {
        params.is_published = true;
      } else if (statusFilter === "draft") {
        params.is_published = false;
      } else if (statusFilter === "featured") {
        params.is_featured = true;
      }

      const res = await photoService.getPhotos(params);
      setPhotos(res.photos);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to load photographs");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const createPhoto = async (formData: Partial<PhotoFormData>): Promise<Photo> => {
    const created = await photoService.createPhoto(formData);
    await fetchPhotos();
    return created;
  };

  const updatePhoto = async (id: string, formData: Partial<PhotoFormData>): Promise<Photo> => {
    const updated = await photoService.updatePhoto(id, formData);
    await fetchPhotos();
    return updated;
  };

  const toggleStatus = async (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ): Promise<void> => {
    await photoService.toggleStatus(id, status);
    await fetchPhotos();
  };

  const deletePhoto = async (id: string): Promise<void> => {
    await photoService.deletePhoto(id);
    await fetchPhotos();
  };

  return {
    photos,
    total,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    refresh: fetchPhotos,
    createPhoto,
    updatePhoto,
    toggleStatus,
    deletePhoto,
  };
};
