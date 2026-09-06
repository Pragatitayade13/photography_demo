import React from "react";
import { Link } from "react-router-dom";
import { Camera, Sparkles, Lock, Mail, Phone, Compass } from "lucide-react";
import { useSiteConfig } from "../../features/public/context/SiteConfigContext";

export const MaintenanceScreen: React.FC = () => {
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen bg-[#08080a] text-primary flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden selection:bg-accent selection:text-background">
      {/* Background ambient lighting */}
      <div className="ambient-glow bg-[#d4af37] w-[600px] h-[600px] -top-32 -left-32 fixed opacity-20" />
      <div className="ambient-glow bg-[#4f46e5] w-[500px] h-[500px] -bottom-32 -right-32 fixed opacity-20" />

      {/* Top Header */}
      <header className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-surface-raised border border-white/10 flex items-center justify-center shadow-inner">
            <Camera className="w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-[0.18em] uppercase font-light text-primary">
              {config.site.name || config.site.photographerName}
            </span>
            <p className="text-[9px] uppercase tracking-[0.35em] text-secondary/70 font-mono">
              {config.branding.brandTagline || "Studio Atelier"}
            </p>
          </div>
        </div>

        <Link
          to="/admin/login"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-secondary hover:text-accent border border-white/10 px-4 py-2 rounded-full hover:border-accent/40 transition-all bg-white/[0.02]"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Curator Access</span>
        </Link>
      </header>

      {/* Main Maintenance Focus */}
      <main className="my-auto py-16 text-center max-w-2xl mx-auto z-10 space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs uppercase tracking-[0.25em] font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Private Exhibition Under Curation</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide leading-tight text-primary">
          Artistry In Progress
        </h1>

        <p className="text-secondary text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
          {config.maintenance.message ||
            "The studio atelier archive is temporarily undergoing private curation. For urgent commissions, destination wedding dates, and press monographs, direct contact lines remain active."}
        </p>

        {/* Studio Direct Lines */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
          {config.contact.email && (
            <a
              href={`mailto:${config.contact.email}`}
              className="flex items-center space-x-2.5 px-6 py-3 rounded-full bg-surface border border-white/10 hover:border-accent/50 text-primary hover:text-accent transition-all duration-300"
            >
              <Mail className="w-4 h-4 text-accent" />
              <span>{config.contact.email}</span>
            </a>
          )}
          {config.contact.phone && (
            <a
              href={`tel:${config.contact.phone}`}
              className="flex items-center space-x-2.5 px-6 py-3 rounded-full bg-surface border border-white/10 hover:border-accent/50 text-primary hover:text-accent transition-all duration-300"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span>{config.contact.phone}</span>
            </a>
          )}
        </div>
      </main>

      {/* Footer info */}
      <footer className="flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.08] pt-6 text-xs text-secondary/60 z-10 gap-4">
        <div className="flex items-center space-x-2">
          <Compass className="w-3.5 h-3.5 text-accent/70" />
          <span className="font-mono uppercase text-[10px] tracking-widest">
            {config.site.location || "Paris · Lake Como · Worldwide"}
          </span>
        </div>
        <p className="text-[11px]">
          &copy; {new Date().getFullYear()} {config.site.photographerName}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
