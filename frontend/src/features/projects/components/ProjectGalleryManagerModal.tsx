import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Image as ImageIcon, Layers } from "lucide-react";
import { Project } from "../types/project.types";
import { projectService } from "../services/projectService";
import { AddPhotosToProjectModal } from "./AddPhotosToProjectModal";

interface ProjectGalleryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onRefreshProjectList: () => Promise<void>;
}

export const ProjectGalleryManagerModal: React.FC<ProjectGalleryManagerModalProps> = ({
  isOpen,
  onClose,
  project,
  onRefreshProjectList,
}) => {
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddPhotosOpen, setIsAddPhotosOpen] = useState<boolean>(false);

  const loadProjectDetails = async () => {
    if (!project) return;
    setIsLoading(true);
    try {
      const data = await projectService.getProject(project.id);
      setProjectDetails(data);
    } catch (err) {
      console.error("Failed to load project details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (project && isOpen) {
      loadProjectDetails();
    }
  }, [project, isOpen]);

  const handleAddPhotos = async (photoIds: string[]) => {
    if (!project) return;
    await projectService.addPhotosToProject(project.id, photoIds);
    await loadProjectDetails();
    await onRefreshProjectList();
  };

  const handleRemovePhoto = async (photoId: string) => {
    if (!project) return;
    await projectService.removePhotoFromProject(project.id, photoId);
    await loadProjectDetails();
    await onRefreshProjectList();
  };

  const handleSetCover = async (imageUrl: string) => {
    if (!project) return;
    await projectService.updateProject(project.id, { cover_image_url: imageUrl });
    await loadProjectDetails();
    await onRefreshProjectList();
  };

  if (!isOpen || !project) return null;

  const projectPhotos = projectDetails?.photos || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2 text-accent">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Gallery Curator
              </span>
            </div>
            <h3 className="font-serif text-xl font-medium text-primary mt-0.5">
              {project.title}
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              {projectPhotos.length} Photographs in this project story
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddPhotosOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photos</span>
            </button>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary p-1.5 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="p-16 text-center text-xs text-secondary animate-pulse">
              Loading curated gallery...
            </div>
          ) : projectPhotos.length === 0 ? (
            <div className="p-16 bg-surface-raised/40 border border-surface-border border-dashed rounded-xl text-center space-y-3">
              <ImageIcon className="w-8 h-8 text-secondary mx-auto" />
              <h4 className="font-serif text-base font-medium text-primary">
                No Photographs in this Story Yet
              </h4>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Add existing photographs from your media library to assemble this project story.
              </p>
              <button
                onClick={() => setIsAddPhotosOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Select Photos Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {projectPhotos.map((photo, index) => {
                const isCover = projectDetails?.cover_image_url === photo.image_url;

                return (
                  <div
                    key={photo.id}
                    className={`group relative aspect-[4/5] rounded-xl overflow-hidden border transition-all ${
                      isCover ? "border-accent ring-2 ring-accent/40" : "border-surface-border"
                    }`}
                  >
                    <img
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.alt_text}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Order Pill */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-[10px] font-mono text-primary border border-surface-border">
                      #{index + 1}
                    </div>

                    {/* Cover Pill */}
                    {isCover && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent text-background text-[9px] font-bold uppercase tracking-wider shadow">
                        Cover
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-background/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="p-1.5 rounded bg-surface border border-surface-border text-secondary hover:text-danger transition-colors"
                          title="Remove from project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-center">
                        <p className="text-[11px] font-medium text-primary truncate">
                          {photo.title}
                        </p>
                        {!isCover && (
                          <button
                            onClick={() => handleSetCover(photo.image_url)}
                            className="w-full py-1 px-2 rounded bg-surface-raised border border-surface-border text-[10px] text-secondary hover:text-accent uppercase tracking-wider font-semibold transition-colors"
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-surface-border flex items-center justify-between shrink-0 bg-surface text-xs text-secondary">
          <span>
            Photos belong to their respective original categories and can be reused across projects.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-surface-raised border border-surface-border rounded text-xs uppercase tracking-widest text-primary hover:border-secondary transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Add Photos Sub-Modal */}
      <AddPhotosToProjectModal
        isOpen={isAddPhotosOpen}
        onClose={() => setIsAddPhotosOpen(false)}
        onAddPhotos={handleAddPhotos}
        existingPhotoIds={projectPhotos.map((p) => p.id)}
      />
    </div>
  );
};
