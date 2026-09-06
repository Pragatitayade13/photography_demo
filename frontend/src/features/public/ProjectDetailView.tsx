import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";

export const ProjectDetailView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 space-y-12">
      <Link
        to="/portfolio"
        className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portfolio</span>
      </Link>

      <div className="space-y-4">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">
          Project Story
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-primary">
          {slug ? slug.replace(/-/g, " ").toUpperCase() : "Editorial Project"}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-xs text-secondary pt-2">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 2026 Edition</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Paris, France</span>
          <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> Editorial</span>
        </div>
      </div>

      <div className="w-full aspect-[16/9] bg-surface rounded-lg border border-surface-border flex items-center justify-center text-secondary text-sm">
        Project Hero Image Preview
      </div>
    </div>
  );
};
