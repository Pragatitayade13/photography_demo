import React, { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  MessageSquareQuote,
  ExternalLink,
} from "lucide-react";
import { aboutService } from "../about/services/aboutService";
import { PublicAboutData, AboutSection } from "../about/types/about.types";
import { ScrollReveal } from "../../components/motion/ScrollReveal";
import { TextSplitReveal } from "../../components/motion/TextSplitReveal";
import { MagneticButton } from "../../components/motion/MagneticButton";
import { AnimatedLink } from "../../components/motion/AnimatedLink";

export const AboutView: React.FC = () => {
  const [data, setData] = useState<PublicAboutData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await aboutService.getPublicAbout();
        setData(res);
      } catch (err) {
        console.warn("Could not load dynamic about data, using default fallback:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAbout();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08080a] text-secondary text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
        Unfolding Studio Monograph...
      </div>
    );
  }

  // Fallback profile if loading
  const profile = data?.profile || {
    display_name: "Alex Mercer",
    professional_title: "Principal Visual Artist & Founder",
    short_bio: "Documenting human vulnerability, high-fashion monographs, and monolithic architecture across Europe, Japan, and the Americas.",
    location: "Paris • Tokyo • Milan",
    years_experience: 14,
    profile_image_url: "/uploads/portrait_woman.jpg",
  };

  const accolades = data?.accolades || [
    { value: "14+", label: "Years of Practice" },
    { value: "32", label: "Countries Documented" },
    { value: "180+", label: "Destination Celebrations" },
    { value: "28", label: "International Awards" },
  ];

  const press = data?.press || [
    "Vogue Weddings",
    "Harper's Bazaar",
    "Architectural Digest",
    "Elle Décor",
    "GQ Style",
    "Leica Fotografie International",
  ];

  const sections = data?.sections || [];

  const renderSection = (sec: AboutSection) => {
    switch (sec.section_key) {
      case "story": {
        const { eyebrow, heading, paragraphs, image_url, image_caption } = sec.configuration;
        return (
          <section key={sec.section_key} className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Portrait Side with Mask Reveal */}
              {image_url && (
                <div className="lg:col-span-5">
                  <ScrollReveal variant="mask">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-panel p-2 shadow-2xl group" data-cursor="VIEW">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <img
                          src={image_url}
                          alt={heading || "The Photographer's Story"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {image_caption && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                            <p className="text-[10px] text-accent font-mono uppercase tracking-widest">{image_caption}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              )}

              {/* Narrative Text */}
              <div className={image_url ? "lg:col-span-7 space-y-8" : "lg:col-span-12 space-y-8 max-w-3xl mx-auto text-center"}>
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
                  <div className="space-y-5 text-sm sm:text-base text-secondary/90 leading-relaxed font-light">
                    {(paragraphs || []).map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fade-up" delay={0.3}>
                  <div className="pt-2">
                    <MagneticButton to="/contact">
                      <div className="inline-flex items-center space-x-2 px-8 py-3.5 bg-accent text-[#08080a] text-xs uppercase tracking-[0.2em] font-semibold rounded-full hover:bg-accent-hover transition-all shadow-xl shadow-accent/20">
                        <span>Reserve Date</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </MagneticButton>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      }

      case "philosophy": {
        const { eyebrow, heading, description, principles } = sec.configuration;
        return (
          <section key={sec.section_key} className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] space-y-16">
            <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
              {eyebrow && (
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                  {eyebrow}
                </span>
              )}
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary">
                {heading}
              </h2>
              {description && <p className="text-xs sm:text-sm text-secondary font-light">{description}</p>}
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(principles || []).map((pr: any, i: number) => (
                <ScrollReveal key={i} variant="fade-up" delay={i * 0.1}>
                  <div className="p-8 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-4 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between h-full">
                    <span className="text-xs font-mono text-accent font-bold">{pr.number}</span>
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl text-primary font-normal">{pr.title}</h3>
                      <p className="text-xs text-secondary/80 leading-relaxed font-light">{pr.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      }

      case "services": {
        const { eyebrow, heading, description, services } = sec.configuration;
        const visibleServices = (services || []).filter((s: any) => s.is_visible !== false);
        if (visibleServices.length === 0) return null;

        return (
          <section key={sec.section_key} className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <ScrollReveal variant="fade-up" className="space-y-2">
                {eyebrow && (
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-[1px] bg-accent" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                      {eyebrow}
                    </span>
                  </div>
                )}
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary">
                  {heading}
                </h2>
                {description && <p className="text-xs sm:text-sm text-secondary max-w-xl font-light">{description}</p>}
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={0.2}>
                <AnimatedLink
                  to="/contact"
                  className="text-xs uppercase tracking-[0.2em] font-semibold text-accent hover:text-accent-hover px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] inline-flex items-center space-x-2"
                >
                  <span>Inquire Rates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </AnimatedLink>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleServices.map((srv: any, idx: number) => (
                <ScrollReveal key={srv.id || srv.number} variant="fade-up" delay={idx * 0.1}>
                  <div className="p-8 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-4 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <span className="text-xs font-mono text-accent font-bold tracking-widest">{srv.number}</span>
                      <h3 className="font-serif text-2xl text-primary font-light">{srv.title}</h3>
                      <p className="text-xs sm:text-sm text-secondary font-light leading-relaxed">{srv.short_description}</p>
                    </div>

                    {srv.deliverables && srv.deliverables.length > 0 && (
                      <div className="pt-4 border-t border-white/[0.06] space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-mono">Deliverables:</p>
                        <ul className="space-y-1.5">
                          {srv.deliverables.map((item: string, dIdx: number) => (
                            <li key={dIdx} className="text-xs text-secondary/90 flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      }

      case "process": {
        const { eyebrow, heading, description, steps } = sec.configuration;
        return (
          <section key={sec.section_key} className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] space-y-16">
            <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
              {eyebrow && (
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                  {eyebrow}
                </span>
              )}
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary">
                {heading}
              </h2>
              {description && <p className="text-xs sm:text-sm text-secondary font-light">{description}</p>}
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {(steps || []).map((st: any, idx: number) => (
                <ScrollReveal key={idx} variant="fade-up" delay={idx * 0.08}>
                  <div className="p-6 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-3 relative group hover:border-accent/50 transition-all duration-300 h-full">
                    <span className="text-2xl font-serif text-accent/60 font-light">{st.step}</span>
                    <h4 className="font-serif text-lg text-primary">{st.title}</h4>
                    <p className="text-xs text-secondary/80 font-light leading-relaxed">{st.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      }

      case "testimonials": {
        const { eyebrow, heading, testimonials } = sec.configuration;
        const visibleTestimonials = (testimonials || []).filter((t: any) => t.is_visible !== false);
        if (visibleTestimonials.length === 0) return null;

        return (
          <section key={sec.section_key} className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] space-y-16">
            <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
              {eyebrow && (
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                  {eyebrow}
                </span>
              )}
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary">
                {heading}
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleTestimonials.map((item: any, idx: number) => (
                <ScrollReveal key={item.id} variant="fade-up" delay={idx * 0.1}>
                  <div className="p-8 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-6 flex flex-col justify-between hover:border-accent/40 transition-colors h-full">
                    <MessageSquareQuote className="w-8 h-8 text-accent/60" />
                    <p className="text-sm sm:text-base text-secondary/90 font-light italic leading-relaxed">
                      "{item.quote}"
                    </p>
                    <div className="border-t border-white/[0.06] pt-4">
                      <p className="font-serif text-lg text-primary">{item.client_names}</p>
                      <p className="text-xs text-accent font-mono">{item.event_type} {item.location ? `• ${item.location}` : ""}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      }

      case "social": {
        const { eyebrow, heading, description, profiles } = sec.configuration;
        const visibleProfiles = (profiles || []).filter((p: any) => p.is_visible !== false);

        return (
          <section key={sec.section_key} className="py-20 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] text-center space-y-8">
            <ScrollReveal variant="fade-up" className="max-w-2xl mx-auto space-y-2">
              {eyebrow && (
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                  {eyebrow}
                </span>
              )}
              <h3 className="font-serif text-2xl sm:text-4xl font-light text-primary">{heading}</h3>
              {description && <p className="text-xs text-secondary font-light">{description}</p>}
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {visibleProfiles.map((soc: any, idx: number) => (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-accent hover:text-accent transition-all text-xs hover:scale-105"
                  >
                    <span className="font-mono uppercase tracking-wider text-[11px]">{soc.platform}</span>
                    <span className="text-secondary/60 text-[10px]">{soc.label}</span>
                    <ExternalLink className="w-3 h-3 text-secondary" />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-primary">
      {/* Editorial Hero Header */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] text-center space-y-6">
        <ScrollReveal variant="fade-up">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-accent text-[11px] uppercase tracking-[0.25em] shadow-lg font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artist Monograph & Profile</span>
          </div>
        </ScrollReveal>

        <TextSplitReveal
          as="h1"
          text={profile.display_name}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight max-w-4xl mx-auto leading-[1.1]"
          delay={0.15}
        />

        <ScrollReveal variant="fade-up" delay={0.25}>
          <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto font-light leading-relaxed">
            {profile.professional_title} — {profile.location}
          </p>
        </ScrollReveal>

        {/* Accolades Bar */}
        <ScrollReveal variant="fade-up" delay={0.35}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/[0.06]">
            {accolades.map((acc, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-accent">{acc.value}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-secondary font-mono">{acc.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Render Dynamic Configured Sections */}
      {sections.map(renderSection)}

      {/* Press & Publications Feature Bar */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8">
        <ScrollReveal variant="fade-up" className="text-center space-y-8">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-secondary/60 font-mono">
            Selected Press & Editorial Features
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm sm:text-lg font-serif uppercase tracking-[0.2em] text-secondary/70">
            {press.map((prItem, i) => (
              <span key={i} className="hover:text-accent transition-colors cursor-default">
                {prItem}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default AboutView;
