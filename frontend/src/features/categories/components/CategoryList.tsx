import React from "react";
import { Edit2, Trash2, Eye, EyeOff, CheckCircle2, XCircle, Image as ImageIcon, FolderKanban } from "lucide-react";
import { Category } from "../types/category.types";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (id: string, status: { is_active?: boolean; is_visible?: boolean }) => Promise<void>;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-secondary animate-pulse">
        Loading category registry...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-16 bg-surface border border-surface-border rounded-xl text-center space-y-3">
        <div className="inline-flex p-3 rounded-full bg-surface-raised border border-surface-border text-accent">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-lg font-medium text-primary">
          No Categories Found
        </h3>
        <p className="text-xs text-secondary max-w-sm mx-auto">
          Create categories like Editorial, Portraits, Weddings, or Architecture to organize your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-surface-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-raised border-b border-surface-border text-[10px] uppercase tracking-widest text-secondary font-semibold">
            <tr>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6">Slug</th>
              <th className="py-3.5 px-6">Content</th>
              <th className="py-3.5 px-6">CMS Status</th>
              <th className="py-3.5 px-6">Public Filter</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/60">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-surface-raised/40 transition-colors group"
              >
                {/* Category Name & Cover */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-md bg-surface-raised border border-surface-border overflow-hidden shrink-0 flex items-center justify-center">
                      {cat.cover_image_url ? (
                        <img
                          src={cat.cover_image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-secondary/60" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-primary text-xs group-hover:text-accent transition-colors">
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p className="text-[11px] text-secondary/80 line-clamp-1 max-w-xs mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="py-4 px-6">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-raised border border-surface-border text-secondary">
                    {cat.slug}
                  </span>
                </td>

                {/* Content Stats */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3 text-secondary text-[11px]">
                    <span className="inline-flex items-center space-x-1" title="Photos in category">
                      <ImageIcon className="w-3.5 h-3.5 text-accent" />
                      <span>{cat.photo_count || 0}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1" title="Projects in category">
                      <FolderKanban className="w-3.5 h-3.5 text-primary" />
                      <span>{cat.project_count || 0}</span>
                    </span>
                  </div>
                </td>

                {/* Active in CMS Toggle */}
                <td className="py-4 px-6">
                  <button
                    onClick={() => onToggleStatus(cat.id, { is_active: !cat.is_active })}
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      cat.is_active
                        ? "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                        : "bg-surface-raised text-secondary border border-surface-border hover:text-primary"
                    }`}
                  >
                    {cat.is_active ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Visible on Public Site Toggle */}
                <td className="py-4 px-6">
                  <button
                    onClick={() => onToggleStatus(cat.id, { is_visible: !cat.is_visible })}
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      cat.is_visible
                        ? "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
                        : "bg-surface-raised text-secondary/60 border border-surface-border hover:text-secondary"
                    }`}
                  >
                    {cat.is_visible ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Row Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(cat)}
                      className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-accent transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cat)}
                      className="p-1.5 rounded hover:bg-surface-raised text-secondary hover:text-danger transition-colors"
                      title="Delete Category"
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
};
