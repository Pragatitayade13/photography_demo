import { useState, useEffect, useCallback } from "react";
import { Project, ProjectFormData } from "../types/project.types";
import { projectService } from "../services/projectService";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // all, published, draft, featured

  const fetchProjects = useCallback(async () => {
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

      const data = await projectService.getProjects(params);
      setProjects(data);
    } catch (err: any) {
      setError(err.error?.message || err.message || "Failed to load project stories");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (formData: Partial<ProjectFormData>): Promise<Project> => {
    const created = await projectService.createProject(formData);
    await fetchProjects();
    return created;
  };

  const updateProject = async (id: string, formData: Partial<ProjectFormData>): Promise<Project> => {
    const updated = await projectService.updateProject(id, formData);
    await fetchProjects();
    return updated;
  };

  const toggleStatus = async (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ): Promise<void> => {
    await projectService.toggleStatus(id, status);
    await fetchProjects();
  };

  const deleteProject = async (id: string): Promise<void> => {
    await projectService.deleteProject(id);
    await fetchProjects();
  };

  const addPhotosToProject = async (projectId: string, photoIds: string[]): Promise<void> => {
    await projectService.addPhotosToProject(projectId, photoIds);
    await fetchProjects();
  };

  const removePhotoFromProject = async (projectId: string, photoId: string): Promise<void> => {
    await projectService.removePhotoFromProject(projectId, photoId);
    await fetchProjects();
  };

  return {
    projects,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    refresh: fetchProjects,
    createProject,
    updateProject,
    toggleStatus,
    deleteProject,
    addPhotosToProject,
    removePhotoFromProject,
  };
};
