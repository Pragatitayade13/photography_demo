import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Project } from "../types/project.types";

interface ProjectDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  project: Project | null;
}

export const ProjectDeleteDialog: React.FC<ProjectDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  project,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(project.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-surface border border-surface-border rounded-xl shadow-2xl p-6 space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-danger/10 border border-danger/20 rounded-full text-danger shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-primary">
              Delete Project Story?
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to delete <span className="text-primary font-semibold">"{project.title}"</span>?
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-surface-raised border border-surface-border rounded-lg text-xs space-y-1">
          <p className="text-accent font-medium">Safe Deletion Guarantee:</p>
          <p className="text-secondary text-[11px]">
            The {project.photo_count || 0} photographs attached to this project will remain intact in your media library.
            Only the story grouping and collection metadata will be removed.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-surface-border rounded text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 bg-danger text-white rounded text-xs uppercase tracking-widest font-semibold hover:bg-danger/90 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
