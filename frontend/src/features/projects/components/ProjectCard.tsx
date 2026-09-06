import React from "react";
import { Star, Edit2, Trash2, Images, MapPin, Calendar, Layers } from "lucide-react";
import { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
  onManageGallery: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onToggleStatus: (
    id: string,
    status: { is_published?: boolean; is_featured?: boolean; is_visible?: boolean }
  ) => Promise<void>;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onManageGallery,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="group relative bg-surface border border-surface-border rounded-xl overflow-hidden shadow-sm hover:border-accent/40 transition-all flex flex-col">
      {/* Cover Image Container */}
      <div
        className="relative aspect-[16/10] bg-surface-raised overflow-hidden cursor-pointer"
        onClick={() => onManageGallery(project)}
      >
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-secondary space-y-1">
            <Images className="w-8 h-8 text-secondary/40" />
            <span className="text-[10px]">No Cover Image</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-background/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 z-10 pointer-events-none group-hover:pointer-events-auto">
          {/* Top Quick Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(project.id, { is_featured: !project.is_featured });
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-transform hover:scale-110 ${
                project.is_featured
                  ? "bg-accent text-background shadow-lg shadow-accent/20"
                  : "bg-surface/80 text-secondary hover:text-accent border border-surface-border"
              }`}
              title={project.is_featured ? "Featured Story" : "Mark as Featured Story"}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(project.id, { is_published: !project.is_published });
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${
                project.is_published
                  ? "bg-success/20 text-success border-success/30"
                  : "bg-surface/80 text-secondary border-surface-border"
              }`}
            >
              {project.is_published ? "Published" : "Draft"}
            </button>
          </div>

          {/* Center / Bottom CTAs */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onManageGallery(project);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-accent text-background rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Curate Gallery ({project.photo_count || 0})</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-2 bg-surface border border-surface-border rounded-md text-secondary hover:text-accent transition-colors"
              title="Edit Project"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
              className="p-2 bg-surface border border-surface-border rounded-md text-secondary hover:text-danger transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Persistent Corner Badges */}
        <div className="absolute top-3 left-3 z-0 flex items-center space-x-2 group-hover:opacity-0 transition-opacity">
          {project.is_featured && (
            <span className="p-1.5 rounded-full bg-accent text-background shadow">
              <Star className="w-3 h-3 fill-current" />
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border border-surface-border text-[10px] uppercase font-semibold text-primary">
            {project.photo_count || 0} Photographs
          </span>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
            <span className="text-accent truncate">
              {project.category_name || "Uncategorized"}
            </span>
            {project.location && (
              <span className="text-secondary/70 flex items-center space-x-1 truncate ml-2">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{project.location}</span>
              </span>
            )}
          </div>
          <h4 className="font-serif text-base text-primary font-medium truncate">
            {project.title}
          </h4>
          {project.short_description && (
            <p className="text-xs text-secondary/80 line-clamp-2 leading-relaxed">
              {project.short_description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-secondary">
          <span className="inline-flex items-center space-x-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                project.is_published ? "bg-success" : "bg-secondary/40"
              }`}
            />
            <span>{project.is_published ? "Live on Portfolio" : "Draft Collection"}</span>
          </span>
          {project.project_date && (
            <span className="text-[10px] text-secondary/60 flex items-center space-x-1">
              <Calendar className="w-2.5 h-2.5" />
              <span>{new Date(project.project_date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
