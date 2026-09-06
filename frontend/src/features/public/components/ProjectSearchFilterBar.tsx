import React, { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal, Sparkles, Filter, Calendar, MapPin } from "lucide-react";
import { Category } from "../../categories/types/category.types";

interface ProjectSearchFilterBarProps {
  categories: Category[];
  availableTags?: Array<{ tag: string; count: number }>;
  availableYears?: number[];
  availableLocations?: string[];
  selectedCategory: string;
  selectedTag: string;
  selectedYear: string;
  selectedLocation: string;
  featuredOnly: boolean;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onYearChange: (year: string) => void;
  onLocationChange: (location: string) => void;
  onFeaturedToggle: (featured: boolean) => void;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
  totalResults: number;
}

export const ProjectSearchFilterBar: React.FC<ProjectSearchFilterBarProps> = ({
  categories,
  availableTags = [],
  availableYears = [2026, 2025, 2024],
  availableLocations = [],
  selectedCategory,
  selectedTag,
  selectedYear,
  selectedLocation,
  featuredOnly,
  searchQuery,
  onCategoryChange,
  onTagChange,
  onYearChange,
  onLocationChange,
  onFeaturedToggle,
  onSearchChange,
  onClearAll,
  totalResults,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedTag !== "all" ||
    selectedYear !== "all" ||
    selectedLocation !== "all" ||
    featuredOnly ||
    searchQuery.trim() !== "";

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Primary Search & Quick Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by story title, location, discipline, or keyword..."
            className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 focus:border-accent rounded-full pl-11 pr-10 py-3 text-xs text-primary placeholder:text-secondary/60 focus:outline-none transition-colors"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-1 rounded-full"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Featured Toggle */}
          <button
            onClick={() => onFeaturedToggle(!featuredOnly)}
            className={`flex items-center space-x-1.5 px-4 py-3 rounded-full text-xs font-semibold transition-all border ${
              featuredOnly
                ? "bg-accent text-black border-accent shadow-lg shadow-accent/20"
                : "bg-white/[0.04] border-white/[0.08] text-secondary hover:text-primary"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Spotlight</span>
          </button>

          {/* Advanced Filter Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center space-x-1.5 px-4 py-3 rounded-full text-xs font-semibold transition-all border ${
              showAdvancedFilters || (selectedYear !== "all" || selectedLocation !== "all" || selectedTag !== "all")
                ? "bg-white/10 border-accent/40 text-accent"
                : "bg-white/[0.04] border-white/[0.08] text-secondary hover:text-primary"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all ${
            selectedCategory === "all"
              ? "bg-accent text-black shadow-md shadow-accent/15 scale-105"
              : "bg-white/[0.03] border border-white/[0.08] text-secondary hover:text-primary hover:border-white/20"
          }`}
        >
          All Disciplines
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all ${
              selectedCategory === cat.slug
                ? "bg-accent text-black shadow-md shadow-accent/15 scale-105"
                : "bg-white/[0.03] border border-white/[0.08] text-secondary hover:text-primary hover:border-white/20"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {showAdvancedFilters && (
        <div className="p-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Year filter */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-secondary/70 font-semibold block mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Production Year</span>
              </label>
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              >
                <option value="all">All Archive Years</option>
                {availableYears.map((y) => (
                  <option key={y} value={String(y)}>
                    {y} Series
                  </option>
                ))}
              </select>
            </div>

            {/* Location filter */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-secondary/70 font-semibold block mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Destination / Location</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              >
                <option value="all">Worldwide Locations</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag filter */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-secondary/70 font-semibold block mb-1.5 flex items-center space-x-1">
                <Filter className="w-3 h-3" />
                <span>Curated Theme & Tag</span>
              </label>
              <select
                value={selectedTag}
                onChange={(e) => onTagChange(e.target.value)}
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
              >
                <option value="all">All Story Themes</option>
                {availableTags.map((t) => (
                  <option key={t.tag} value={t.tag}>
                    {t.tag} ({t.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-secondary/80 font-medium">
            Showing <strong className="text-primary">{totalResults}</strong> story monograph{totalResults === 1 ? "" : "s"}
          </span>

          {selectedCategory !== "all" && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 text-[11px] font-semibold">
              <span>Category: {selectedCategory}</span>
              <button onClick={() => onCategoryChange("all")} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedTag !== "all" && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 text-[11px] font-semibold">
              <span>Theme: {selectedTag}</span>
              <button onClick={() => onTagChange("all")} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedYear !== "all" && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] font-semibold">
              <span>Year: {selectedYear}</span>
              <button onClick={() => onYearChange("all")} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedLocation !== "all" && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[11px] font-semibold">
              <span>Location: {selectedLocation}</span>
              <button onClick={() => onLocationChange("all")} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {featuredOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-semibold">
              <span>Featured Only</span>
              <button onClick={() => onFeaturedToggle(false)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 text-[11px] font-semibold">
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button onClick={() => setLocalSearch("")} className="hover:text-accent">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setLocalSearch("");
              onClearAll();
            }}
            className="text-secondary hover:text-accent underline transition-colors text-xs font-semibold"
          >
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
};
