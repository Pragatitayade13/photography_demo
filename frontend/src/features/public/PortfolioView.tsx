import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Layers,
  ArrowRight,
  FolderKanban,
  Image as ImageIcon,
  Heart,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectService } from "../projects/services/projectService";
import { photoService } from "../photos/services/photoService";
import { categoryService } from "../categories/services/categoryService";
import { ProjectSearchResponse } from "../projects/types/project.types";
import { Photo } from "../photos/types/photo.types";
import { Category } from "../categories/types/category.types";
import { PublicLightbox } from "./components/PublicLightbox";
import { ProjectSearchFilterBar } from "./components/ProjectSearchFilterBar";
import { useShortlist } from "../../utils/shortlistStore";
import { ScrollReveal } from "../../components/motion/ScrollReveal";
import { TextSplitReveal } from "../../components/motion/TextSplitReveal";

export const PortfolioView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategorySlug = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "all";
  const currentYear = searchParams.get("year") || "all";
  const currentLocation = searchParams.get("location") || "all";
  const currentFeatured = searchParams.get("featured") === "true";

  const [viewTab, setViewTab] = useState<"projects" | "photos">("projects");
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchResult, setSearchResult] = useState<ProjectSearchResponse | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Shortlist hook
  const { isShortlisted, toggleShortlist } = useShortlist();

  // Lightbox state for photos tab
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [cats, searchRes, photosRes] = await Promise.all([
        categoryService.getCategories({ public: true }),
        projectService.searchProjects({
          search: currentSearch || undefined,
          category: currentCategorySlug === "all" ? undefined : currentCategorySlug,
          tag: currentTag === "all" ? undefined : currentTag,
          year: currentYear === "all" ? undefined : currentYear,
          location: currentLocation === "all" ? undefined : currentLocation,
          featured: currentFeatured ? true : undefined,
          limit: 24,
        }),
        photoService.getPhotos({
          public: true,
          category_slug: currentCategorySlug === "all" ? undefined : currentCategorySlug,
        }),
      ]);

      setCategories(cats);
      setSearchResult(searchRes);
      setPhotos(photosRes.photos);
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategorySlug, currentSearch, currentTag, currentYear, currentLocation, currentFeatured]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === "all") {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  const handleClearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const projects = searchResult?.items || [];
  const filters = searchResult?.filters;

  return (
    <div className="min-h-screen bg-[#08080a] text-primary">
      {/* Portfolio Hero Header */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] text-center space-y-8">
        <ScrollReveal variant="fade-up">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-accent text-[11px] uppercase tracking-[0.25em] shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Fine Art Archive</span>
          </div>
        </ScrollReveal>

        <TextSplitReveal
          as="h1"
          text="Selected Works & Visual Stories"
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight max-w-4xl mx-auto leading-[1.1]"
          delay={0.15}
        />

        <ScrollReveal variant="fade-up" delay={0.25}>
          <p className="text-xs sm:text-base text-secondary max-w-2xl mx-auto font-light leading-relaxed">
            Documentary wedding monographs, brutalist architecture studies, and European haute couture editorials captured across Lake Como, Paris, Kyoto, and Milan.
          </p>
        </ScrollReveal>

        {/* Multi-facet Filter and Search Control */}
        <ScrollReveal variant="fade-up" delay={0.35}>
          <ProjectSearchFilterBar
            categories={categories}
            availableTags={filters?.tags}
            availableYears={filters?.years}
            availableLocations={filters?.locations}
            selectedCategory={currentCategorySlug}
            selectedTag={currentTag}
            selectedYear={currentYear}
            selectedLocation={currentLocation}
            featuredOnly={currentFeatured}
            searchQuery={currentSearch}
            onCategoryChange={(cat) => updateFilters({ category: cat })}
            onTagChange={(t) => updateFilters({ tag: t })}
            onYearChange={(y) => updateFilters({ year: y })}
            onLocationChange={(loc) => updateFilters({ location: loc })}
            onFeaturedToggle={(f) => updateFilters({ featured: f ? "true" : null })}
            onSearchChange={(q) => updateFilters({ search: q ? q : null })}
            onClearAll={handleClearAllFilters}
            totalResults={projects.length}
          />
        </ScrollReveal>

        {/* View Switcher: Stories vs Artworks */}
        <ScrollReveal variant="fade-up" delay={0.45}>
          <div className="flex items-center justify-center pt-4">
            <div className="inline-flex p-1.5 bg-[#121217] rounded-full border border-white/10 text-xs">
              <button
                onClick={() => setViewTab("projects")}
                className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                  viewTab === "projects"
                    ? "bg-accent text-[#09090b] shadow-md"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Project Stories ({projects.length})</span>
              </button>

              <button
                onClick={() => setViewTab("photos")}
                className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                  viewTab === "photos"
                    ? "bg-accent text-[#09090b] shadow-md"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Master Archive ({photos.length})</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Grid Content Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {isLoading ? (
          <div className="p-28 text-center text-xs text-secondary uppercase tracking-[0.3em] animate-pulse">
            Curating Visual Monograph Archive...
          </div>
        ) : viewTab === "projects" ? (
          /* Projects Grid */
          projects.length === 0 ? (
            <div className="p-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-secondary/50">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-primary font-light">No Project Stories Found</h3>
              <p className="text-xs text-secondary leading-relaxed">
                No published monographs match your current search criteria. Try modifying your keywords or clearing the active filters.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="px-5 py-2.5 rounded-full bg-accent text-black text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {projects.map((project, idx) => {
                  const shortlisted = isShortlisted(project.id);
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button")) return;
                        navigate(`/portfolio/${project.slug}`);
                      }}
                      className="group relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.08] hover:border-accent/40 transition-all duration-500 flex flex-col justify-between cursor-pointer shadow-xl hover:-translate-y-1"
                      data-cursor="EXPLORE"
                    >
                      <div>
                        {/* Image Thumbnail with Overlay */}
                        <Link to={`/portfolio/${project.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-surface-raised">
                          {project.cover_image_url ? (
                            <img
                              src={project.cover_image_url}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-secondary/30">
                              <Layers className="w-8 h-8" />
                            </div>
                          )}

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                            {project.category_name && (
                              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-semibold text-accent">
                                {project.category_name}
                              </span>
                            )}
                            {project.is_featured && (
                              <span className="px-2.5 py-1 rounded-full bg-accent text-black text-[10px] uppercase font-bold tracking-wider shadow-md">
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Photo Count Pill */}
                          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-semibold text-white/90">
                            {project.photo_count || 0} Frames
                          </div>
                        </Link>

                        {/* Favorite / Shortlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleShortlist(project);
                          }}
                          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all transform hover:scale-110 shadow-lg ${
                            shortlisted
                              ? "bg-accent border-accent text-black"
                              : "bg-black/60 border-white/10 text-white/70 hover:text-accent"
                          }`}
                          title={shortlisted ? "Remove from shortlist" : "Save to shortlist"}
                          aria-label="Save to shortlist"
                        >
                          <Heart className={`w-4 h-4 ${shortlisted ? "fill-black" : ""}`} />
                        </button>

                        {/* Meta Information */}
                        <div className="p-6 space-y-3">
                          <h2 className="font-serif text-2xl text-primary font-light group-hover:text-accent transition-colors leading-snug">
                            <Link to={`/portfolio/${project.slug}`}>{project.title}</Link>
                          </h2>

                          {project.short_description && (
                            <p className="text-xs text-secondary line-clamp-2 leading-relaxed font-light">
                              {project.short_description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-xs text-secondary/80 pt-1">
                            {project.location && (
                              <span className="inline-flex items-center space-x-1.5">
                                <MapPin className="w-3.5 h-3.5 text-accent" />
                                <span>{project.location}</span>
                              </span>
                            )}
                          </div>

                          {/* Tag Chips */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] bg-white/[0.04] text-secondary px-2 py-0.5 rounded-full border border-white/[0.06]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="p-6 pt-3 border-t border-white/[0.06] mt-auto">
                        <Link
                          to={`/portfolio/${project.slug}`}
                          className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-accent group-hover:text-white transition-colors"
                        >
                          <span className="relative py-1">
                            Unfold Story Archive
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                          </span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 text-accent transition-transform duration-300" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )
        ) : (
          /* Master Photos Archive Grid */
          photos.length === 0 ? (
            <div className="p-20 text-center text-secondary text-xs uppercase tracking-widest">
              No archival master frames found in this discipline.
            </div>
          ) : (
            <motion.div
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {photos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setLightboxIndex(idx)}
                    data-cursor="ZOOM"
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-surface-raised break-inside-avoid border border-white/5 hover:border-accent/40 transition-all duration-300 shadow-xl"
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.alt_text || photo.title}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 space-y-1">
                      <span className="text-accent text-[9px] uppercase font-bold tracking-widest">
                        {photo.category_name || "Archive Plate"}
                      </span>
                      <h3 className="font-serif text-lg text-primary">{photo.title}</h3>
                      {photo.location && (
                        <p className="text-[10px] text-secondary/80 flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3 text-accent" />
                          <span>{photo.location}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )
        )}
      </main>

      {/* Lightbox Modal for Photos Tab */}
      {lightboxIndex >= 0 && (
        <PublicLightbox
          isOpen={lightboxIndex >= 0}
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}
    </div>
  );
};

export default PortfolioView;
