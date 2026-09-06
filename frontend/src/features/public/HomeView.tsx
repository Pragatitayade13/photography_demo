import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Layers,
  ChevronDown,
  Award,
  Compass,
  Mail,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { homepageService } from "../homepage/services/homepageService";
import { PublicHomepageData, PublicHomepageSection } from "../homepage/types/homepage.types";
import { ScrollReveal } from "../../components/motion/ScrollReveal";
import { TextSplitReveal } from "../../components/motion/TextSplitReveal";
import { FloatingPolaroid } from "../../components/motion/FloatingPolaroid";
import { MagneticButton } from "../../components/motion/MagneticButton";
import { AnimatedLink } from "../../components/motion/AnimatedLink";
import { useSiteConfig } from "./context/SiteConfigContext";

export const HomeView: React.FC = () => {
  const { config } = useSiteConfig();
  const [data, setData] = useState<PublicHomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback defaults in case API has not loaded yet
  const FALLBACK_SECTIONS: PublicHomepageSection[] = [
    {
      section_key: "hero",
      title: "Hero Banner",
      sort_order: 1,
      configuration: {
        headline: "Moments Sculpted in Light & Emotion",
        subheadline: "Fine-art royal destination weddings, sacred heritage rituals, and timeless visual monographs documented on medium-format sensors.",
        media_url: "/uploads/wedding_royal_red_lehenga.jpg",
        primary_btn_text: "Explore Curated Works",
        primary_btn_link: "/portfolio",
        secondary_btn_text: "Reserve Commission",
        secondary_btn_link: "/contact",
      },
    },
    {
      section_key: "intro",
      title: "Introduction",
      sort_order: 2,
      configuration: {
        eyebrow: "THE ARTISTIC ATELIER",
        heading: "Where documentary truth merges with high-fashion editorial poetry.",
        description: "Based in Europe & India, undertaking commissions across Jaipur, Udaipur, Lake Como, Paris, and worldwide. Alex Mercer captures the fleeting, poetic subtleties of sacred traditions, joyous rituals, and eternal love.",
        image_url: "/uploads/wedding_varmala_rose_shower.jpg",
        button_text: "Discover The Artist's Story",
        button_link: "/about",
      },
    },
    {
      section_key: "featured_projects",
      title: "Featured Project Stories",
      sort_order: 3,
      configuration: {
        heading: "Master Series & Stories",
        subheading: "Curated multi-series documenting royal destination weddings, sacred Vedic rituals, and architectural monographs.",
      },
      data: {
        projects: [
          {
            id: "pr000000-0000-0000-0000-000000000001",
            title: "Royal Heritage & Destination Wedding Celebrations",
            slug: "lake-como-grand-villa-celebrations",
            short_description: "An intimate, royal destination wedding capturing grand heritage mandaps, cascading rose petal showers, and sacred Vedic rituals.",
            description: "Commissioned multi-day destination wedding documentary capturing royal Indian heritage, sacred Vedic rites, and grand celebrations. Preserving authentic human emotion and timeless romance in radiant lighting.",
            cover_image_url: "/uploads/wedding_royal_red_lehenga.jpg",
            category_name: "Weddings",
            category_slug: "weddings",
            location: "The Leela Palace, Jaipur & Udaipur",
            is_published: true,
            is_featured: true,
            is_visible: true,
            sort_order: 1,
            photo_count: 5,
            created_at: "",
            updated_at: "",
          },
          {
            id: "pr000000-0000-0000-0000-000000000002",
            title: "Tuscan Atelier Craftsmen & Heritage",
            slug: "tuscan-atelier-craftsmen-heritage",
            short_description: "An intimate artisanal monograph documenting master woodworking, studio light, and generational handcrafting.",
            description: "Published across European design journals, this project explores master artisans in their historic workshops, celebrating the tactile intersection of wood, chisel, and quiet focus.",
            cover_image_url: "/uploads/craftsman_workshop.jpg",
            category_name: "Editorial",
            category_slug: "editorial",
            location: "Florence & Tuscany, Italy",
            is_published: true,
            is_featured: true,
            is_visible: true,
            sort_order: 2,
            photo_count: 3,
            created_at: "",
            updated_at: "",
          },
          {
            id: "pr000000-0000-0000-0000-000000000003",
            title: "Alpine Horizons & Dolomites Monograph",
            slug: "alpine-horizons-dolomites-monograph",
            short_description: "Exploring jagged mountain ridges, solitary expeditions, and transcendent sunset atmospheres in the Dolomites.",
            description: "A continuous fine art monograph exploring alpine geology, natural golden light dynamics, and human scale amidst majestic mountain landscapes.",
            cover_image_url: "/uploads/mountain_sunset.jpg",
            category_name: "Architecture",
            category_slug: "architecture",
            location: "Tre Cime di Lavaredo, Dolomites, Italy",
            is_published: true,
            is_featured: true,
            is_visible: true,
            sort_order: 3,
            photo_count: 2,
            created_at: "",
            updated_at: "",
          },
        ],
      },
    },
    {
      section_key: "categories",
      title: "Portfolio Categories",
      sort_order: 4,
      configuration: {
        heading: "Curated Disciplines",
        subheading: "Explore specialized visual archives spanning haute couture, destination celebrations, intimate portraits, and architectural form.",
        show_counts: true,
      },
      data: {
        categories: [
          { id: "c1", name: "Editorial", slug: "editorial", photo_count: 18, project_count: 5, sort_order: 1, is_active: true, is_visible: true, created_at: "", updated_at: "" },
          { id: "c2", name: "Portraits", slug: "portraits", photo_count: 14, project_count: 3, sort_order: 2, is_active: true, is_visible: true, created_at: "", updated_at: "" },
          { id: "c3", name: "Weddings", slug: "weddings", photo_count: 12, project_count: 3, sort_order: 3, is_active: true, is_visible: true, created_at: "", updated_at: "" },
          { id: "c4", name: "Architecture", slug: "architecture", photo_count: 4, project_count: 1, sort_order: 4, is_active: true, is_visible: true, created_at: "", updated_at: "" },
        ],
      },
    },
    {
      section_key: "selected_work",
      title: "Selected Photography",
      sort_order: 5,
      configuration: {
        heading: "Curated Gallery Highlights",
        subheading: "Individual masterworks captured on medium-format Hasselblad and Leica systems with vintage German optics.",
      },
      data: {
        photos: [
          {
            id: "p1",
            title: "Royal Heritage Mandap & Zardozi Grandeur",
            slug: "royal-heritage-mandap-zardozi-grandeur",
            image_url: "/uploads/wedding_royal_red_lehenga.jpg",
            thumbnail_url: "/uploads/thumb_wedding_royal_red_lehenga.jpg",
            alt_text: "Regal Indian wedding couple in grand floral archway, bride in intricate red and gold zardozi lehenga and groom in cream sherwani with safa",
            category_name: "Weddings",
            location: "The Leela Palace, Jaipur",
            is_published: true,
            is_featured: true,
            is_visible: true,
            sort_order: 1,
            created_at: "",
            updated_at: "",
          },
          {
            id: "p2",
            title: "Ivory Varmala & Cascading Rose Petal Shower",
            slug: "ivory-varmala-cascading-rose-shower",
            image_url: "/uploads/wedding_varmala_rose_shower.jpg",
            thumbnail_url: "/uploads/thumb_wedding_varmala_rose_shower.jpg",
            alt_text: "Bride and groom exchanging varmala garlands under falling red rose petals shower in elegant ivory bridal attire",
            category_name: "Weddings",
            location: "Taj Lake Palace, Udaipur",
            is_published: true,
            is_featured: true,
            is_visible: true,
            sort_order: 2,
            created_at: "",
            updated_at: "",
          },
          {
            id: "p3",
            title: "Sacred Talambralu & Golden Turmeric Blessing",
            slug: "sacred-talambralu-golden-turmeric-blessing",
            image_url: "/uploads/wedding_sacred_talambralu.jpg",
            thumbnail_url: "/uploads/thumb_wedding_sacred_talambralu.jpg",
            alt_text: "Radiant Indian bride and groom laughing together during holy Talambralu turmeric rice ceremony with warm golden lighting",
            category_name: "Weddings",
            location: "Temple Grand Pavilion, Hyderabad",
            is_published: true,
            is_featured: true,
            is_visible: true,
            sort_order: 3,
            created_at: "",
            updated_at: "",
          },
          {
            id: "p4",
            title: "The Serene Oonjal Swing & Kanchipuram Silk",
            slug: "serene-oonjal-swing-kanchipuram-silk",
            image_url: "/uploads/wedding_traditional_oonjal.jpg",
            thumbnail_url: "/uploads/thumb_wedding_traditional_oonjal.jpg",
            alt_text: "Newlywed couple seated on traditional floral swing decorated with yellow blossoms in golden silk attire",
            category_name: "Weddings",
            location: "Heritage Grove, Chennai",
            is_published: true,
            is_featured: true,
            is_visible: true,
            sort_order: 4,
            created_at: "",
            updated_at: "",
          },
        ],
      },
    },
    {
      section_key: "about_preview",
      title: "About The Photographer",
      sort_order: 6,
      configuration: {
        eyebrow: "BIOGRAPHY & DISTINCTION",
        heading: "Alex Mercer — Principal Visual Artist",
        bio_paragraphs: [
          "With over a decade documenting the world's most intimate celebrations and prominent fashion monographs, Alex blends editorial precision with unfiltered human presence.",
          "Regularly featured across Vogue Weddings, Harper's Bazaar, Elle Decor, and Architectural Digest. Dedicated to capturing legacy imagery that transcends trends.",
        ],
        portrait_image_url: "/uploads/portrait_woman.jpg",
        accolades: [
          { label: "Years Experience", value: "14+" },
          { label: "Global Destinations", value: "32" },
          { label: "International Honours", value: "28" },
        ],
        cta_text: "View Biography & Press Archive",
        cta_link: "/about",
      },
    },
    {
      section_key: "cta",
      title: "Call to Action",
      sort_order: 7,
      configuration: {
        heading: "Let Us Create Something Unforgettable",
        subheading: "Now accepting limited private commissions and destination wedding dates worldwide for the upcoming seasons.",
        button_text: "Begin The Dialogue",
        button_link: "/contact",
        bg_image_url: "/uploads/family_golden_hour.jpg",
      },
    },
  ];

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        const res = await homepageService.getPublicHomepage();
        if (res && res.sections && res.sections.length > 0) {
          setData(res);
        } else {
          setData({ sections: FALLBACK_SECTIONS });
        }
      } catch (err) {
        console.warn("Failed to load public homepage, using luxury fallback:", err);
        setData({ sections: FALLBACK_SECTIONS });
      } finally {
        setIsLoading(false);
      }
    };
    loadHomepage();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080a] text-secondary text-xs uppercase tracking-[0.3em] font-mono">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-full border border-accent/30 border-t-accent animate-spin" />
          <span>Curating Atelier Archive...</span>
        </div>
      </div>
    );
  }

  const sections = data?.sections && data.sections.length > 0 ? data.sections : FALLBACK_SECTIONS;

  const renderSection = (sec: PublicHomepageSection) => {
    switch (sec.section_key) {
      case "hero": {
        const { headline, subheadline, media_url, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link } = sec.configuration;
        return (
          <section key={sec.section_key} className="relative min-h-[96vh] flex items-center justify-center overflow-hidden">
            {/* Cinematic Hero Backdrop with subtle zoom & depth */}
            <motion.div
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1.03, opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-0"
            >
              <img
                src={media_url || "/uploads/wedding_royal_red_lehenga.jpg"}
                alt="Fine Art & Editorial Photography Hero"
                className="w-full h-full object-cover brightness-[0.32]"
              />
              {/* Radial gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-black/60" />
            </motion.div>

            {/* Asymmetrical Floating Polaroid Composition (Desktop) */}
            <div className="hidden lg:block absolute right-10 xl:right-24 top-1/4 z-20 pointer-events-auto">
              <FloatingPolaroid
                src="/uploads/wedding_varmala_rose_shower.jpg"
                alt="Ivory Varmala & Rose Petal Shower"
                caption="Varmala Rose Shower • Udaipur"
                initialRotate={3.5}
                imageClassName="w-48 h-64"
                dataCursor="EXPLORE"
              />
            </div>
            <div className="hidden lg:block absolute left-8 xl:left-20 bottom-24 z-20 pointer-events-auto">
              <FloatingPolaroid
                src="/uploads/wedding_sacred_talambralu.jpg"
                alt="Sacred Talambralu Turmeric Blessing"
                caption="Sacred Talambralu • Hyderabad"
                initialRotate={-3}
                imageClassName="w-44 h-56"
                dataCursor="EXPLORE"
              />
            </div>

            {/* Hero Text & Accents */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8 pt-12">
              {/* Studio Pill Badge */}
              <ScrollReveal variant="fade-up" delay={0.1}>
                <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-accent text-[11px] uppercase tracking-[0.25em] shadow-2xl">
                  <Sparkles className="w-3.5 h-3.5 text-accent animate-spin duration-3000" />
                  <span className="font-semibold">Alex Mercer Atelier — Fine Art & Editorial</span>
                </div>
              </ScrollReveal>

              {/* Monolithic Title with Word Reveal Animation */}
              <TextSplitReveal
                as="h1"
                text={headline || "Moments Sculpted in Light & Emotion"}
                className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-primary tracking-tight leading-[1.05]"
                splitBy="words"
                delay={0.15}
              />

              {/* Subtitle */}
              {subheadline && (
                <ScrollReveal variant="fade-up" delay={0.4}>
                  <p className="text-sm sm:text-base md:text-lg text-secondary/90 max-w-2xl mx-auto font-light leading-relaxed">
                    {subheadline}
                  </p>
                </ScrollReveal>
              )}

              {/* Action Buttons with Magnetic Touch */}
              <ScrollReveal variant="fade-up" delay={0.55}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <MagneticButton to={primary_btn_link || "/portfolio"}>
                    <div className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-9 py-4 bg-accent text-[#09090b] text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 shadow-2xl shadow-accent/20">
                      <span>{primary_btn_text || "Explore Portfolio"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </MagneticButton>

                  <MagneticButton to={secondary_btn_link || "/contact"}>
                    <div className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 bg-white/[0.05] backdrop-blur-xl border border-white/15 text-primary text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:border-accent hover:text-accent hover:bg-white/[0.08] transition-all duration-300">
                      <span>{secondary_btn_text || "Reserve Commission"}</span>
                    </div>
                  </MagneticButton>
                </div>
              </ScrollReveal>

              {/* Quick Distinction Metrics */}
              <ScrollReveal variant="fade-up" delay={0.7}>
                <div className="pt-12 grid grid-cols-3 max-w-xl mx-auto gap-4 border-t border-white/[0.08] text-center">
                  <div>
                    <p className="font-sans text-2xl sm:text-3xl text-accent font-semibold tracking-tight">14+</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-secondary mt-0.5">Years Behind Lens</p>
                  </div>
                  <div>
                    <p className="font-sans text-2xl sm:text-3xl text-accent font-semibold tracking-tight">32</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-secondary mt-0.5">Countries Documented</p>
                  </div>
                  <div>
                    <p className="font-serif text-xl sm:text-2xl text-accent font-light">Vogue</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-secondary mt-0.5">& Bazaar Featured</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Scroll Cue */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-secondary/60 flex flex-col items-center space-y-1 animate-bounce">
              <span className="text-[9px] uppercase tracking-[0.3em] font-mono">Scroll</span>
              <ChevronDown className="w-4 h-4 text-accent" />
            </div>
          </section>
        );
      }

      case "intro": {
        const { eyebrow, heading, description, image_url, button_text, button_link } = sec.configuration;
        return (
          <section key={sec.section_key} className="py-28 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Text Side */}
              <div className="lg:col-span-7 space-y-8">
                {eyebrow && (
                  <ScrollReveal variant="fade-up">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-[1px] bg-accent" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                        {eyebrow}
                      </span>
                    </div>
                  </ScrollReveal>
                )}

                <ScrollReveal variant="mask" delay={0.1}>
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-primary leading-[1.15]">
                    {heading}
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fade-up" delay={0.2}>
                  <p className="text-sm sm:text-base text-secondary/90 leading-relaxed font-light">
                    {description}
                  </p>
                </ScrollReveal>

                {button_text && (
                  <ScrollReveal variant="fade-up" delay={0.3}>
                    <div className="pt-2">
                      <AnimatedLink
                        to={button_link || "/about"}
                        className="text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-accent-hover inline-flex items-center space-x-2"
                      >
                        <span>{button_text}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </AnimatedLink>
                    </div>
                  </ScrollReveal>
                )}
              </div>

              {/* Portrait Side with Mask Reveal */}
              {image_url && (
                <div className="lg:col-span-5">
                  <ScrollReveal variant="mask" delay={0.25}>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel p-2 shadow-2xl group" data-cursor="VIEW">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <img
                          src={image_url}
                          alt="Fine Art Editorial Portrait"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                          <span className="text-[10px] uppercase tracking-widest text-accent font-mono">
                            Paris Studio Session
                          </span>
                          <p className="font-serif text-lg text-primary">Alex Mercer, 2026</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              )}
            </div>
          </section>
        );
      }

      case "featured_projects": {
        const { heading, subheading } = sec.configuration;
        const projects = sec.data?.projects || [];
        if (projects.length === 0) return null;

        return (
          <section key={sec.section_key} className="py-28 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <ScrollReveal variant="fade-up" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-[1px] bg-accent" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                    Selected Monographs
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary">
                  {heading || "Master Series & Stories"}
                </h2>
                {subheading && <p className="text-xs sm:text-sm text-secondary max-w-xl font-light">{subheading}</p>}
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.2}>
                <AnimatedLink
                  to="/portfolio"
                  className="text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-accent-hover self-start sm:self-end px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] inline-flex items-center space-x-2"
                >
                  <span>View Full Archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </AnimatedLink>
              </ScrollReveal>
            </div>

            {/* Project Cards Grid with Staggered ScrollReveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((proj, idx) => (
                <ScrollReveal key={proj.id} variant="fade-up" delay={idx * 0.12}>
                  <Link
                    to={`/portfolio/${proj.slug}`}
                    data-cursor="VIEW STORY"
                    className="group relative bg-[#0e0e13] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-500 flex flex-col shadow-xl hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-[16/11] bg-surface-raised overflow-hidden">
                      <img
                        src={proj.cover_image_url || "/uploads/wedding_arch.jpg"}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-semibold tracking-wider text-accent font-mono">
                          {proj.category_name || "Master Series"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        {proj.location && (
                          <div className="flex items-center space-x-1 text-[10px] uppercase tracking-wider text-secondary/80 font-mono">
                            <MapPin className="w-3 h-3 text-accent" />
                            <span>{proj.location}</span>
                          </div>
                        )}
                        <h3 className="font-serif text-xl text-primary font-normal mt-1 group-hover:text-accent transition-colors leading-snug">
                          {proj.title}
                        </h3>
                        {proj.short_description && (
                          <p className="text-xs text-secondary/80 line-clamp-2 mt-2 leading-relaxed font-light">
                            {proj.short_description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-secondary">
                        <span className="inline-flex items-center space-x-1.5 text-[11px] font-mono">
                          <Layers className="w-3.5 h-3.5 text-accent" />
                          <span>{proj.photo_count || 3} Masterworks</span>
                        </span>
                        <span className="text-[11px] text-accent font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                          <span>Explore</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      }

      case "categories": {
        const { heading, subheading, show_counts } = sec.configuration;
        const categories = sec.data?.categories || [];
        if (categories.length === 0) return null;

        const disciplineImages: Record<string, string> = {
          editorial: "/uploads/craftsman_workshop.jpg",
          portraits: "/uploads/portrait_woman.jpg",
          weddings: "/uploads/wedding_royal_red_lehenga.jpg",
          architecture: "/uploads/mountain_sunset.jpg",
        };

        return (
          <section key={sec.section_key} className="py-28 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] space-y-16">
            <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 text-accent">
                <Compass className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] font-mono">
                  Curated Disciplines
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary">
                {heading || "Curated Disciplines"}
              </h2>
              {subheading && <p className="text-xs sm:text-sm text-secondary font-light">{subheading}</p>}
            </ScrollReveal>

            {/* Disciplines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, idx) => {
                const bg = disciplineImages[cat.slug] || "/uploads/wedding_royal_red_lehenga.jpg";
                return (
                  <ScrollReveal key={cat.id} variant="fade-up" delay={idx * 0.1}>
                    <Link
                      to={`/portfolio?category=${cat.slug}`}
                      data-cursor="VIEW"
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-accent/60 transition-all duration-500 shadow-lg block"
                    >
                      <img
                        src={bg}
                        alt={cat.name}
                        className="w-full h-full object-cover brightness-[0.4] group-hover:scale-110 group-hover:brightness-[0.45] transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      <div className="absolute inset-0 p-6 flex flex-col justify-end space-y-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-mono">
                          Discipline
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal group-hover:text-accent transition-colors">
                          {cat.name}
                        </h3>
                        {show_counts && (
                          <p className="text-[10px] uppercase tracking-wider text-secondary font-mono pt-1">
                            {cat.photo_count || 12}+ Photographs
                          </p>
                        )}
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        );
      }

      case "selected_work": {
        const { heading, subheading } = sec.configuration;
        const photos = sec.data?.photos || [];
        if (photos.length === 0) return null;

        return (
          <section key={sec.section_key} className="py-28 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <ScrollReveal variant="fade-up" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-[1px] bg-accent" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                    Artisan Highlights
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary">
                  {heading || "Curated Masterworks"}
                </h2>
                {subheading && <p className="text-xs sm:text-sm text-secondary font-light max-w-xl">{subheading}</p>}
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.2}>
                <AnimatedLink
                  to="/portfolio"
                  className="text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-accent-hover inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08]"
                >
                  <span>Full Gallery Index</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </AnimatedLink>
              </ScrollReveal>
            </div>

            {/* Curated Photographs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {photos.map((photo, idx) => (
                <ScrollReveal key={photo.id} variant="fade-up" delay={idx * 0.1}>
                  <Link
                    to="/portfolio"
                    data-cursor="ZOOM"
                    className="group relative aspect-[4/5] bg-surface-raised rounded-2xl overflow-hidden border border-white/[0.08] shadow-xl hover:border-accent/60 transition-all duration-500 block"
                  >
                    <img
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.alt_text}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-xs">
                      <span className="text-accent text-[9px] uppercase font-bold font-mono tracking-widest">
                        {photo.category_name || "Artwork"}
                      </span>
                      <p className="text-primary font-serif text-base font-normal truncate mt-1">
                        {photo.title}
                      </p>
                      {photo.location && (
                        <p className="text-[10px] text-secondary/80 flex items-center space-x-1 mt-1 font-mono">
                          <MapPin className="w-2.5 h-2.5 text-accent" />
                          <span>{photo.location}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      }

      case "about_preview": {
        const { eyebrow, heading, bio_paragraphs, portrait_image_url, accolades, cta_text, cta_link } = sec.configuration;
        return (
          <section key={sec.section_key} className="py-28 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {portrait_image_url && (
                <div className="lg:col-span-5 order-2 lg:order-1">
                  <ScrollReveal variant="mask">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-panel p-2 shadow-2xl" data-cursor="VIEW">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <img
                          src={portrait_image_url}
                          alt="Photographer Portrait"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                          <span className="text-[10px] uppercase tracking-widest text-accent font-mono">
                            Alex Mercer
                          </span>
                          <p className="text-xs text-secondary">Hasselblad & Leica Artisan</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              )}

              <div className={`space-y-8 ${portrait_image_url ? "lg:col-span-7" : "lg:col-span-12"} order-1 lg:order-2`}>
                {eyebrow && (
                  <ScrollReveal variant="fade-up">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-[1px] bg-accent" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                        {eyebrow}
                      </span>
                    </div>
                  </ScrollReveal>
                )}

                <ScrollReveal variant="mask" delay={0.1}>
                  <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary leading-tight">
                    {heading}
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fade-up" delay={0.2}>
                  <div className="space-y-4 text-sm sm:text-base text-secondary/90 leading-relaxed font-light">
                    {(bio_paragraphs || []).map((para: string, idx: number) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </ScrollReveal>

                {/* Accolades Counters */}
                {accolades && accolades.length > 0 && (
                  <ScrollReveal variant="fade-up" delay={0.3}>
                    <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/[0.08]">
                      {accolades.map((acc: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <p className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-accent">{acc.value}</p>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-mono">{acc.label}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                )}

                {cta_text && (
                  <ScrollReveal variant="fade-up" delay={0.4}>
                    <div className="pt-2">
                      <AnimatedLink
                        to={cta_link || "/about"}
                        className="text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-accent-hover inline-flex items-center space-x-2"
                      >
                        <span>{cta_text}</span>
                        <ArrowRight className="w-4 h-4" />
                      </AnimatedLink>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </section>
        );
      }

      case "cta": {
        const { heading, subheading, button_text, button_link, bg_image_url } = sec.configuration;
        return (
          <section key={sec.section_key} id="contact-section" className="relative py-32 overflow-hidden border-t border-white/[0.06]">
            {bg_image_url && (
              <div className="absolute inset-0 z-0">
                <img
                  src={bg_image_url}
                  alt="Destination Backdrop"
                  className="w-full h-full object-cover brightness-[0.2] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/75 to-[#08080a]" />
              </div>
            )}

            <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-10">
              <ScrollReveal variant="fade-up">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-accent text-[11px] uppercase tracking-[0.25em] font-mono shadow-xl">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  <span>Private Commissions & Inquiries</span>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.1}>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-primary tracking-tight leading-tight max-w-4xl mx-auto">
                  {heading || "Let Us Create Something Unforgettable"}
                </h2>
              </ScrollReveal>

              {subheading && (
                <ScrollReveal variant="fade-up" delay={0.2}>
                  <p className="text-sm sm:text-base md:text-lg text-secondary/90 font-light max-w-2xl mx-auto leading-relaxed">
                    {subheading}
                  </p>
                </ScrollReveal>
              )}

              {/* Direct Quick Contact Badges */}
              <ScrollReveal variant="fade-up" delay={0.3}>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-secondary">
                  <a
                    href={`mailto:${config.contact.email}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-accent hover:text-primary transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span>{config.contact.email || "studio@alexmercer.com"}</span>
                  </a>
                  {config.contact.whatsappNumber && (
                    <a
                      href={`https://wa.me/${config.contact.whatsappNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-accent hover:text-primary transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-accent" />
                      <span>WhatsApp VIP Concierge</span>
                    </a>
                  )}
                  <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-secondary/80">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span>{config.contact.location || "Europe • Asia • Worldwide"}</span>
                  </span>
                </div>
              </ScrollReveal>

              {/* Prominent Action Buttons */}
              <ScrollReveal variant="fade-up" delay={0.4}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <MagneticButton to={button_link || "/contact"}>
                    <div className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-10 py-4 bg-accent text-[#09090b] text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-accent-hover transition-all duration-300 shadow-2xl shadow-accent/25">
                      <span>{button_text || "Reserve Commission Date"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </MagneticButton>

                  <MagneticButton to="/about">
                    <div className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/[0.05] border border-white/15 text-primary text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:border-accent hover:text-accent hover:bg-white/[0.08] transition-all duration-300">
                      <span>Explore Artist Philosophy</span>
                    </div>
                  </MagneticButton>
                </div>
              </ScrollReveal>
            </div>
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-primary">
      {sections.map(renderSection)}
    </div>
  );
};

export default HomeView;
