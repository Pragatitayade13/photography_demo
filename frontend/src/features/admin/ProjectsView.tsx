import React, { useState } from "react";
import {
  Plus,
  Search,
  FolderKanban,
  Filter,
  LayoutGrid,
  List,
  RotateCw,
  AlertCircle,
} from "lucide-react";
import { useProjects } from "../projects/hooks/useProjects";
import { useCategories } from "../categories/hooks/useCategories";
import { Project, ProjectFormData } from "../projects/types/project.types";
import { ProjectGrid } from "../projects/components/ProjectGrid";
import { ProjectModal } from "../projects/components/ProjectModal";
import { ProjectGalleryManagerModal } from "../projects/components/ProjectGalleryManagerModal";
import { ProjectDeleteDialog } from "../projects/components/ProjectDeleteDialog";

export const ProjectsView: React.FC = () => {
  const {
    projects,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    refresh,
    createProject,
    updateProject,
    toggleStatus,
    deleteProject,
  } = useProjects();

  const { categories } = useCategories();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const publishedCount = projects.filter((p) => p.is_published).length;
  const featuredCount = projects.filter((p) => p.is_featured).length;

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: ProjectFormData) => {
    if (editingProject) {
      await updateProject(editingProject.id, formData);
    } else {
      await createProject(formData);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-accent">
            <FolderKanban className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Story & Album Collections
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light text-primary tracking-tight mt-1">
            Projects & Galleries
          </h2>
          <p className="text-xs text-secondary mt-1">
            Group your editorial shoots, wedding stories, and thematic series into curated portfolio albums.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-center">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2.5 bg-surface border border-surface-border text-secondary hover:text-accent rounded-md transition-colors disabled:opacity-50"
            title="Refresh list"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin text-accent" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors shadow-lg shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Project Story</span>
          </button>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project titles, locations, summaries..."
            className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-xs text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-secondary absolute left-3 top-3 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-8 py-2 text-xs text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Statuses ({projects.length})</option>
              <option value="published">Published Live ({publishedCount})</option>
              <option value="draft">Drafts</option>
              <option value="featured">Featured Stories ({featuredCount})</option>
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="md:col-span-2 flex justify-end space-x-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === "grid"
                ? "bg-surface-raised border-accent text-accent"
                : "bg-surface border-surface-border text-secondary hover:text-primary"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === "table"
                ? "bg-surface-raised border-accent text-accent"
                : "bg-surface border-surface-border text-secondary hover:text-primary"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid or Table */}
      <ProjectGrid
        projects={projects}
        isLoading={isLoading}
        viewMode={viewMode}
        onManageGallery={(p) => setGalleryProject(p)}
        onEdit={handleOpenEditModal}
        onDelete={(p) => setDeletingProject(p)}
        onToggleStatus={toggleStatus}
        onOpenCreate={handleOpenCreateModal}
      />

      {/* Create / Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        project={editingProject}
      />

      {/* Gallery Curator Modal */}
      <ProjectGalleryManagerModal
        isOpen={Boolean(galleryProject)}
        onClose={() => setGalleryProject(null)}
        project={galleryProject}
        onRefreshProjectList={refresh}
      />

      {/* Delete Confirmation Dialog */}
      <ProjectDeleteDialog
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={deleteProject}
        project={deletingProject}
      />
    </div>
  );
};
