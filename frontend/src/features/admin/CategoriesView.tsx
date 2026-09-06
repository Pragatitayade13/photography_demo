import React, { useState } from "react";
import { Plus, Search, Tags, Filter, RotateCw, AlertCircle } from "lucide-react";
import { useCategories } from "../categories/hooks/useCategories";
import { Category, CategoryFormData } from "../categories/types/category.types";
import { CategoryList } from "../categories/components/CategoryList";
import { CategoryModal } from "../categories/components/CategoryModal";
import { CategoryDeleteDialog } from "../categories/components/CategoryDeleteDialog";

export const CategoriesView: React.FC = () => {
  const {
    categories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refresh,
    createCategory,
    updateCategory,
    toggleStatus,
    deleteCategory,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: CategoryFormData) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await createCategory(formData);
    }
  };

  const activeCount = categories.filter((c) => c.is_active).length;
  const visibleCount = categories.filter((c) => c.is_visible).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-accent">
            <Tags className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Portfolio Structure
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light text-primary tracking-tight mt-1">
            Category Management
          </h2>
          <p className="text-xs text-secondary mt-1">
            Organize photography assignments and define dynamic filter tabs for your public gallery.
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
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Metrics & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug, or keywords..."
            className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Status Dropdown */}
        <div className="md:col-span-3">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-secondary absolute left-3 top-3 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-8 py-2 text-xs text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="all">All Categories ({categories.length})</option>
              <option value="active">Active in CMS ({activeCount})</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Quick Summary Pill */}
        <div className="md:col-span-3 flex md:justify-end text-xs text-secondary space-x-3">
          <span className="px-3 py-1.5 bg-surface border border-surface-border rounded-md">
            <strong className="text-primary font-medium">{activeCount}</strong> Active
          </span>
          <span className="px-3 py-1.5 bg-surface border border-surface-border rounded-md">
            <strong className="text-accent font-medium">{visibleCount}</strong> Visible Online
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Data Table */}
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={(cat) => setDeletingCategory(cat)}
        onToggleStatus={toggleStatus}
      />

      {/* Create / Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        category={editingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <CategoryDeleteDialog
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={deleteCategory}
        category={deletingCategory}
      />
    </div>
  );
};
