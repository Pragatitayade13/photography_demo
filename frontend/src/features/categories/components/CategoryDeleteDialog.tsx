import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Category } from "../types/category.types";

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  category: Category | null;
}

export const CategoryDeleteDialog: React.FC<CategoryDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  category,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !category) return null;

  const hasLinkedContent = (category.photo_count || 0) > 0 || (category.project_count || 0) > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(category.id);
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
              Delete Category?
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to delete <span className="text-primary font-semibold">"{category.name}"</span>?
            </p>
          </div>
        </div>

        {hasLinkedContent && (
          <div className="p-3.5 bg-surface-raised border border-surface-border rounded-lg text-xs space-y-1">
            <p className="text-accent font-medium">Associated Content Notice:</p>
            <p className="text-secondary text-[11px]">
              This category contains {category.photo_count || 0} photographs and {category.project_count || 0} projects.
              Deleting the category will unassign the category tag while keeping your photos safe.
            </p>
          </div>
        )}

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
