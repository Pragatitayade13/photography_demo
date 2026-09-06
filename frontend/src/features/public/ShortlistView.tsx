import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Trash2,
  Share2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Layers,
  CheckCircle,
  Mail,
} from "lucide-react";
import { useShortlist } from "../../utils/shortlistStore";
import { SEO } from "../../components/common/SEO";

export const ShortlistView: React.FC = () => {
  const { shortlist, removeFromShortlist, clearShortlist, count } = useShortlist();
  const [copied, setCopied] = useState<boolean>(false);

  const handleShareShortlist = () => {
    if (navigator.share) {
      navigator.share({
        title: "Alex Mercer Photography — My Shortlist",
        text: `Here are the ${count} photography projects I saved on Alex Mercer Studio.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const projectSlugsParam = shortlist.map((p) => p.slug).join(",");
  const enquiryUrl = `/contact?shortlist=${encodeURIComponent(projectSlugsParam)}&source=shortlist`;

  return (
    <div className="min-h-screen bg-[#08080a] text-primary pb-24">
      <SEO
        title="My Curation Shortlist"
        description="Review and enquire about your saved photography monographs and stories."
      />

      {/* Header Banner */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] text-center space-y-6">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-accent text-[11px] uppercase tracking-[0.25em] shadow-lg">
          <Heart className="w-3.5 h-3.5 fill-accent" />
          <span>Client Private Shortlist</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight max-w-3xl mx-auto">
          Your Curated Collection
        </h1>

        <p className="text-xs sm:text-sm text-secondary max-w-xl mx-auto leading-relaxed">
          Review your favorite stories, share your moodboard selections with collaborators, and initiate a tailored commission inquiry.
        </p>

        {count > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={enquiryUrl}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-accent hover:bg-accent/90 text-black text-xs uppercase tracking-widest font-semibold shadow-lg shadow-accent/20 transition-all transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Inquire With {count} Saved Project{count === 1 ? "" : "s"}</span>
            </Link>

            <button
              onClick={handleShareShortlist}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-secondary hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? "Link Copied!" : "Share Shortlist"}</span>
            </button>

            <button
              onClick={clearShortlist}
              className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-full bg-transparent hover:bg-danger/10 text-secondary hover:text-danger text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {count === 0 ? (
          <div className="text-center py-20 space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-secondary/50">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-primary font-light">Your Shortlist is Empty</h3>
              <p className="text-xs text-secondary mt-2 leading-relaxed">
                As you explore our monograph archive, click the heart icon on any project card to bookmark it here for comparison.
              </p>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-accent text-black text-xs uppercase tracking-widest font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Portfolio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shortlist.map((proj) => (
              <div
                key={proj.id}
                className="group relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.08] hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-raised">
                    {proj.cover_image_url ? (
                      <img
                        src={proj.cover_image_url}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/40">
                        <Layers className="w-8 h-8" />
                      </div>
                    )}

                    {/* Quick Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromShortlist(proj.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-danger text-accent hover:text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg z-10"
                      title="Remove from shortlist"
                    >
                      <Heart className="w-4 h-4 fill-accent hover:fill-white" />
                    </button>

                    {/* Category badge */}
                    {proj.category_name && (
                      <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase font-semibold text-accent">
                        {proj.category_name}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl text-primary group-hover:text-accent transition-colors">
                      {proj.title}
                    </h3>
                    {proj.short_description && (
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                        {proj.short_description}
                      </p>
                    )}

                    {proj.location && (
                      <div className="flex items-center space-x-1 text-xs text-secondary/80">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{proj.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer links */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/[0.04] mt-4">
                  <Link
                    to={`/portfolio/${proj.slug}`}
                    className="text-xs font-semibold text-primary group-hover:text-accent flex items-center space-x-1.5 transition-colors"
                  >
                    <span>View Story Monograph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/contact?project=${proj.slug}&source=shortlist`}
                    className="text-[11px] font-semibold text-accent hover:underline"
                  >
                    Inquire Story
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
