import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Photo } from "../types/photo.types";

interface PhotoDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  photo: Photo | null;
}

export const PhotoDeleteDialog: React.FC<PhotoDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  photo,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !photo) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(photo.id);
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
              Delete Photograph?
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to permanently delete <span className="text-primary font-semibold">"{photo.title}"</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-surface-raised rounded-lg border border-surface-border">
          <img
            src={photo.thumbnail_url || photo.image_url}
            alt={photo.alt_text}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="text-xs space-y-0.5 truncate">
            <p className="text-primary font-medium truncate">{photo.title}</p>
            <p className="text-secondary text-[11px] truncate">{photo.category_name || "Uncategorized"}</p>
          </div>
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
