import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Layers,
  Share2,
  Heart,
  Mail,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { projectService } from "../projects/services/projectService";
import { Project, ProjectComparison } from "../projects/types/project.types";
import { Photo } from "../photos/types/photo.types";
import { FullscreenGalleryViewer } from "./components/FullscreenGalleryViewer";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { SEO } from "../../components/common/SEO";
import { StructuredData } from "../../components/common/StructuredData";
import { SocialShareModal } from "../../components/common/SocialShareModal";
import { trackEvent } from "../../utils/analyticsTracker";
import { useShortlist } from "../../utils/shortlistStore";
import { ScrollReveal } from "../../components/motion/ScrollReveal";
import { TextSplitReveal } from "../../components/motion/TextSplitReveal";
import { MagneticButton } from "../../components/motion/MagneticButton";

const safeFormatDate = (dateStr?: string | null): string | null => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return null;
  }
};

const safeIsoDate = (dateStr?: string | null): string => {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export const ProjectStoryView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [comparisons, setComparisons] = useState<ProjectComparison[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Fullscreen gallery index
  const [galleryIndex, setGalleryIndex] = useState<number>(-1);

  // Shortlist hook
  const { isShortlisted, toggleShortlist } = useShortlist();

  useEffect(() => {
    let isMounted = true;
    const loadStory = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const [storyData, projsList] = await Promise.all([
          projectService.getProjectBySlug(slug),
          projectService.getProjects({ public: true }).catch(() => []),
        ]);

        if (!isMounted) return;

        setProject(storyData);
        setAllProjects(projsList || []);

        if (storyData) {
          // Load comparisons & related safely
          try {
            const [cmps, rels] = await Promise.all([
              projectService.getComparisons(storyData.id).catch(() => []),
              projectService.getRelatedProjects(storyData.id).catch(() => []),
            ]);
            if (isMounted) {
              setComparisons(cmps || []);
              setRelatedProjects(rels || []);
            }
          } catch (e) {
            console.warn("Could not load story extras:", e);
          }

          // Track story view analytics safely
          try {
            trackEvent("project_view", window.location.pathname, storyData.id, { slug, title: storyData.title });
          } catch {}
        }
      } catch (err: any) {
        console.error("Failed to load project story:", err);
        if (isMounted) {
          setError("Unable to load the requested visual story.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStory();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080a] text-secondary text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-full border border-accent/30 border-t-accent animate-spin" />
          <span>Developing Monograph Story...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080a] text-primary p-6 space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-primary font-light">Story Not Found</h2>
        <p className="text-secondary text-sm">{error || "The requested visual story does not exist."}</p>
        <Link
          to="/portfolio"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-accent text-[#08080a] text-xs uppercase tracking-widest font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </Link>
      </div>
    );
  }

  const photos = project.photos || [];
  const isSaved = isShortlisted(project.id);
  const formattedDate = safeFormatDate(project.project_date);

  // Determine next project for bottom footer
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects.length > 1
      ? allProjects[0]
      : null;

  return (
    <div className="min-h-screen bg-[#08080a] text-primary">
      <SEO
        title={project.title}
        description={project.short_description || project.description || undefined}
        image={project.cover_image_url || undefined}
        type="article"
      />
      <StructuredData
        type="project"
        projectData={{
          title: project.title,
          description: project.short_description || project.description || undefined,
          imageUrl: project.cover_image_url || undefined,
          slug: project.slug,
          datePublished: safeIsoDate(project.created_at),
        }}
      />
      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={project.title}
        description={project.short_description || project.description || undefined}
        url={window.location.href}
        projectId={project.id}
        imageUrl={project.cover_image_url || undefined}
      />

      {/* Story Cover Hero Banner */}
      <section className="relative min-h-[85vh] flex items-end justify-center overflow-hidden pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={project.cover_image_url || "/uploads/wedding_arch.jpg"}
            alt={project.title}
            className="w-full h-full object-cover brightness-[0.32] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 w-full space-y-6">
          {/* Top Breadcrumbs, Shortlist & Share */}
          <div className="flex items-center justify-between">
            <Link
              to="/portfolio"
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs uppercase tracking-[0.2em] text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portfolio Archive</span>
            </Link>

            <div className="flex items-center space-x-2">
              {/* Shortlist bookmark */}
              <button
                onClick={() => toggleShortlist(project)}
                className={`px-4 py-1.5 rounded-full backdrop-blur-md border transition-all flex items-center space-x-2 text-xs ${
                  isSaved
                    ? "bg-accent border-accent text-black font-semibold"
                    : "bg-black/50 border-white/10 text-secondary hover:text-accent"
                }`}
                title={isSaved ? "Saved in shortlist" : "Add to shortlist"}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-black" : ""}`} />
                <span className="text-[11px] uppercase tracking-wider">
                  {isSaved ? "Saved" : "Save to Shortlist"}
                </span>
              </button>

              {/* Share button */}
              <button
                onClick={() => setShareModalOpen(true)}
                className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-secondary hover:text-primary hover:border-accent/40 transition-all flex items-center space-x-2 text-xs"
                title="Share Story"
              >
                <Share2 className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] uppercase tracking-wider">Share</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
              {project.category_name || "Portfolio Monograph"}
            </span>
            <TextSplitReveal
              as="h1"
              text={project.title}
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-primary tracking-tight leading-[1.08]"
              splitBy="words"
              delay={0.1}
            />
          </div>

          {/* Metadata Row */}
          <ScrollReveal variant="fade-up" delay={0.25}>
            <div className="flex flex-wrap items-center gap-6 text-xs text-secondary/90 border-t border-white/[0.08] pt-4">
              {project.location && (
                <span className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{project.location}</span>
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>{formattedDate}</span>
                </span>
              )}
              <span className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span>{photos.length} Curated Master Plates</span>
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Story Introduction Narrative */}
      <section className="py-20 max-w-4xl mx-auto px-6 sm:px-8 space-y-8">
        {project.short_description && (
          <ScrollReveal variant="fade-up">
            <p className="font-serif text-2xl sm:text-3xl text-primary font-light leading-relaxed border-l-2 border-accent pl-6 italic">
              &ldquo;{project.short_description}&rdquo;
            </p>
          </ScrollReveal>
        )}

        {project.description && (
          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="prose prose-invert max-w-none text-secondary text-sm sm:text-base leading-loose font-light space-y-6">
              <p className="whitespace-pre-line">{project.description}</p>
            </div>
          </ScrollReveal>
        )}

        {/* Gallery Quick Launch Button */}
        {photos.length > 0 && (
          <ScrollReveal variant="fade-up" delay={0.25}>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setGalleryIndex(0)}
                className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-accent hover:text-black border border-white/10 hover:border-accent text-accent text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Launch Fullscreen Gallery ({photos.length} Frames)</span>
              </button>
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* Interactive Before/After Comparisons */}
      {comparisons.length > 0 && (
        <section className="py-16 max-w-6xl mx-auto px-6 sm:px-8 border-t border-white/[0.06] space-y-12">
          {comparisons.map((cmp) => (
            <BeforeAfterSlider key={cmp.id} comparison={cmp} />
          ))}
        </section>
      )}

      {/* Main Photographic Gallery Grid with Staggered ScrollReveal & Zoom Tag */}
      <section className="py-12 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-8">
          <h2 className="font-serif text-2xl text-primary font-light">
            Monograph Archive Gallery
          </h2>
          <span className="text-xs text-secondary font-medium">
            Click any frame to view in fullscreen high-fidelity
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="p-20 text-center text-xs text-secondary">
            No photographs currently archived for this project story.
          </div>
        ) : (
          <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {photos.map((photo, idx) => (
              <ScrollReveal key={photo.id || idx} variant="fade-up" delay={idx * 0.08}>
                <div
                  onClick={() => setGalleryIndex(idx)}
                  data-cursor="ZOOM"
                  className="group relative rounded-2xl overflow-hidden cursor-pointer bg-surface-raised break-inside-avoid border border-white/5 hover:border-accent/40 transition-all duration-500 shadow-2xl"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.alt_text || photo.title}
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-accent font-mono">
                        Plate {idx + 1}
                      </span>
                      <span className="text-xs text-white/80 flex items-center space-x-1">
                        <Maximize2 className="w-3.5 h-3.5 text-accent" />
                        <span>Zoom</span>
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-primary">{photo.title}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Project Commission Inquiry CTA with Magnetic Button */}
      <section className="py-20 max-w-4xl mx-auto px-6 sm:px-8 border-t border-white/[0.06] text-center space-y-6">
        <ScrollReveal variant="fade-up">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs uppercase tracking-widest font-semibold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commission Inquiries</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary tracking-tight">
              Inspired by this visual direction?
            </h2>

            <p className="text-xs sm:text-sm text-secondary max-w-xl mx-auto leading-relaxed font-light">
              Reserve our studio for destination weddings, commercial editorial monograph campaigns, and private bespoke portraiture worldwide.
            </p>

            <div className="pt-2 flex justify-center">
              <MagneticButton to={`/contact?project=${project.slug}&source=project`}>
                <div className="inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-black text-xs uppercase tracking-widest font-semibold shadow-xl shadow-accent/20 transition-all">
                  <Mail className="w-4 h-4" />
                  <span>Inquire About &ldquo;{project.title}&rdquo;</span>
                </div>
              </MagneticButton>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Related Projects Recommendation Section */}
      {relatedProjects.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 border-t border-white/[0.06] space-y-8">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
              Explore More Work
            </span>
            <h2 className="font-serif text-3xl text-primary font-light mt-1">
              Related Visual Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((rel, idx) => (
              <ScrollReveal key={rel.id || idx} variant="fade-up" delay={idx * 0.1}>
                <Link
                  to={`/portfolio/${rel.slug}`}
                  data-cursor="EXPLORE"
                  className="group relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.08] hover:border-accent/40 transition-all p-4 space-y-3 block"
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-surface-raised relative">
                    {rel.cover_image_url && (
                      <img
                        src={rel.cover_image_url}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {rel.location && (
                      <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white">
                        {rel.location}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg text-primary group-hover:text-accent transition-colors">
                    {rel.title}
                  </h3>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Next Story Banner */}
      {nextProject && nextProject.slug !== slug && (
        <section className="border-t border-white/[0.06] bg-white/[0.01]">
          <Link
            to={`/portfolio/${nextProject.slug}`}
            data-cursor="NEXT STORY"
            className="group block py-20 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-4"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold flex items-center justify-center space-x-2 font-mono">
              <span>Next Visual Story</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary group-hover:text-accent transition-colors">
              {nextProject.title}
            </h2>
          </Link>
        </section>
      )}

      {/* Fullscreen Gallery Lightbox Viewer */}
      {galleryIndex >= 0 && (
        <FullscreenGalleryViewer
          photos={photos}
          initialIndex={galleryIndex}
          isOpen={galleryIndex >= 0}
          onClose={() => setGalleryIndex(-1)}
          onShare={(_photo: Photo) => {
            setShareModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default ProjectStoryView;
