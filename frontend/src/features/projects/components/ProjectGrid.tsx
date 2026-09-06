import React from "react";
import { Project } from "../types/project.types";
import { ProjectCard } from "./ProjectCard";
import { FolderKanban, Star, Edit2, Trash2, Layers } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  viewMode: "grid" | "table";
  onManageGallery: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleStatus: (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ) => Promise<void>;
  onOpenCreate: () => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  isLoading,
  viewMode,
  onManageGallery,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenCreate,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="aspect-[16/12] bg-surface rounded-xl border border-surface-border"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-16 bg-surface border border-surface-border rounded-xl text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-surface-raised border border-surface-border text-accent">
          <FolderKanban className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-medium text-primary">
          No Project Stories Found
        </h3>
        <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
          Group your photographs into client assignments, destination weddings, or thematic editorial series.
        </p>
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors"
        >
          <span>Create First Project Story</span>
        </button>
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised border-b border-surface-border text-[10px] uppercase tracking-widest text-secondary font-semibold">
              <tr>
                <th className="py-3.5 px-6">Project Story</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Gallery</th>
                <th className="py-3.5 px-6">Featured</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-surface-raised/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-14 h-10 rounded bg-surface-raised border border-surface-border overflow-hidden shrink-0 cursor-pointer"
                        onClick={() => onManageGallery(project)}
                      >
                        {project.cover_image_url ? (
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-secondary">
                            No Cover
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary text-xs truncate max-w-xs">
                          {project.title}
                        </p>
                        {project.location && (
                          <p className="text-[10px] text-secondary truncate max-w-xs">
                            {project.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-accent font-medium">{project.category_name || "—"}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => onManageGallery(project)}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-surface-raised border border-surface-border text-secondary hover:text-accent transition-colors font-medium text-[11px]"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{project.photo_count || 0} Photos</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => onToggleStatus(project.id, { is_featured: !project.is_featured })}
                      className={`p-1.5 rounded transition-colors ${
                        project.is_featured ? "text-accent" : "text-secondary/40 hover:text-secondary"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3.5 px-6">
                    <button
                      onClick={() => onToggleStatus(project.id, { is_published: !project.is_published })}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        project.is_published
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-surface-raised text-secondary border border-surface-border"
                      }`}
                    >
                      {project.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onManageGallery(project)}
                        className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-accent transition-colors"
                        title="Curate Gallery"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(project)}
                        className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-accent transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(project)}
                        className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-danger transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onManageGallery={onManageGallery}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};
