import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Camera,
  Sparkles,
  ArrowUpRight,
  Compass,
  Instagram,
  Youtube,
  Globe,
  MessageCircle,
  Heart,
} from "lucide-react";
import { useSiteConfig } from "../features/public/context/SiteConfigContext";
import { useShortlist } from "../utils/shortlistStore";
import { SEO } from "../components/common/SEO";
import { MaintenanceScreen } from "../components/common/MaintenanceScreen";
import { ScrollProgress } from "../components/motion/ScrollProgress";
import { CustomCursor } from "../components/motion/CustomCursor";
import { PageTransitionOverlay } from "../components/motion/PageTransitionOverlay";
import { MagneticButton } from "../components/motion/MagneticButton";
import { AnimatedLink } from "../components/motion/AnimatedLink";

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { config } = useSiteConfig();
  const { count: shortlistCount } = useShortlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // If site is in Maintenance Mode, render maintenance screen
  if (config.maintenance.isMaintenance) {
    return (
      <>
        <SEO />
        <MaintenanceScreen />
      </>
    );
  }

  // Core navigation items guaranteed
  const defaultNavItems = [
    { id: "nav-1", label: "Portfolio", url: "/portfolio", type: "INTERNAL" as const, sortOrder: 1, openNewTab: false },
    { id: "nav-2", label: "About", url: "/about", type: "INTERNAL" as const, sortOrder: 2, openNewTab: false },
    { id: "nav-3", label: "Contact", url: "/contact", type: "INTERNAL" as const, sortOrder: 3, openNewTab: false },
  ];

  // Dynamic Navigation Items from CMS with fallback & guarantees
  const rawNav = (config.navigation && config.navigation.length > 0) ? config.navigation : defaultNavItems;
  const hasAbout = rawNav.some((n) => n.url === "/about" || n.label.toLowerCase() === "about");
  const hasContact = rawNav.some((n) => n.url === "/contact" || n.label.toLowerCase() === "contact");

  const navItems = [...rawNav];
  if (!hasAbout) {
    navItems.splice(1, 0, { id: "nav-about-fixed", label: "About", url: "/about", type: "INTERNAL", sortOrder: 2, openNewTab: false });
  }
  if (!hasContact) {
    navItems.push({ id: "nav-contact-fixed", label: "Contact", url: "/contact", type: "INTERNAL", sortOrder: 3, openNewTab: false });
  }

  const brandName = config.branding.brandName || config.site.name || config.site.photographerName || "Alex Mercer";
  const brandTagline = config.branding.brandTagline || config.site.tagline || "Studio Atelier";
  const logoUrl = config.branding.logo;

  const renderSocialIcon = (iconName: string) => {
    const lower = iconName.toLowerCase();
    if (lower.includes("instagram")) return <Instagram className="w-4 h-4" />;
    if (lower.includes("youtube") || lower.includes("video")) return <Youtube className="w-4 h-4" />;
    if (lower.includes("whatsapp") || lower.includes("message")) return <MessageCircle className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-primary selection:bg-accent selection:text-background font-sans relative">
      <SEO />

      {/* Global Luxury Scroll Progress Line */}
      <ScrollProgress />

      {/* Interactive Editorial Custom Cursor (Desktop Fine Pointer Only) */}
      <CustomCursor />

      {/* Ambient background glow accents */}
      <div className="ambient-glow bg-[#d4af37] w-[600px] h-[600px] -top-48 -left-48 fixed pointer-events-none" />
      <div className="ambient-glow bg-[#4f46e5] w-[500px] h-[500px] top-1/2 -right-48 fixed pointer-events-none" />

      {/* Luxury Navigation Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0c0c10]/85 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/40"
            : "bg-transparent border-b border-white/[0.04] py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo & Studio Mark */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="h-9 w-auto object-contain rounded group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-surface-raised border border-white/10 flex items-center justify-center group-hover:border-accent/60 transition-all duration-300 shadow-inner">
                <Camera className="w-4 h-4 text-accent transition-transform duration-500 group-hover:rotate-12" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.18em] uppercase font-light text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                {brandName}
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-secondary/70 font-mono -mt-0.5">
                {brandTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs uppercase tracking-[0.2em] font-medium">
            {navItems.map((item) => {
              const isInternal = item.type === "INTERNAL";
              const isActive = isInternal && location.pathname === item.url;

              if (isInternal) {
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "text-primary bg-white/[0.06] border border-white/[0.1] font-semibold"
                        : "text-secondary hover:text-primary hover:bg-white/[0.03]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent animate-pulse" />
                    )}
                  </Link>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.openNewTab ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full text-secondary hover:text-primary hover:bg-white/[0.03] transition-all duration-300 inline-flex items-center space-x-1"
                >
                  <span>{item.label}</span>
                  {item.openNewTab && <ArrowUpRight className="w-3 h-3 text-secondary/50" />}
                </a>
              );
            })}

            <div className="h-4 w-[1px] bg-white/10 mx-2" />

            {/* Shortlist / Favorites Button */}
            <Link
              to="/shortlist"
              className={`relative inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-all duration-300 text-xs tracking-wider uppercase font-medium ${
                location.pathname === "/shortlist"
                  ? "border-rose-500/60 bg-rose-500/10 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                  : "border-white/10 hover:border-rose-500/40 text-secondary hover:text-primary hover:bg-white/[0.04]"
              }`}
              title="View Curated Shortlist"
            >
              <Heart className={`w-3.5 h-3.5 ${shortlistCount > 0 ? "fill-rose-500 text-rose-500 animate-pulse" : "text-secondary"}`} />
              <span>Shortlist</span>
              {shortlistCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-sans font-bold rounded-full bg-rose-500 text-white leading-none">
                  {shortlistCount}
                </span>
              )}
            </Link>

            {/* Inquire Action Button with Magnetic Hover on Desktop */}
            <MagneticButton to={config.site.defaultCtaUrl || "/contact"}>
              <div className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-full bg-accent/10 border border-accent/40 text-accent text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-background transition-all duration-300 shadow-sm">
                <span>{config.site.defaultCtaText || "Inquire"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </MagneticButton>

            {/* CMS Portal Access Link */}
            <Link
              to="/admin/login"
              className="text-[10px] uppercase tracking-[0.2em] text-secondary/40 hover:text-accent transition-colors ml-2 px-2.5 py-1.5 rounded"
              title="Photographer CMS Login"
            >
              CMS
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-secondary hover:text-primary p-2 rounded-lg bg-surface border border-surface-border focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-accent" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e0e13]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const isInternal = item.type === "INTERNAL";
                if (isInternal) {
                  return (
                    <Link
                      key={item.id}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm uppercase tracking-[0.2em] py-2.5 px-3 rounded-lg transition-colors ${
                        location.pathname === item.url
                          ? "text-accent bg-white/5 font-semibold"
                          : "text-secondary hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.openNewTab ? "_blank" : "_self"}
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-[0.2em] py-2.5 px-3 rounded-lg text-secondary hover:text-primary transition-colors inline-flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-secondary/60" />
                  </a>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
              <Link
                to="/shortlist"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between py-2.5 px-4 bg-white/[0.04] border border-white/10 text-primary rounded-lg text-xs uppercase tracking-[0.2em] font-medium"
              >
                <span className="flex items-center space-x-2">
                  <Heart className={`w-4 h-4 ${shortlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-secondary"}`} />
                  <span>My Shortlist</span>
                </span>
                {shortlistCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-sans font-bold rounded-full bg-rose-500 text-white">
                    {shortlistCount}
                  </span>
                )}
              </Link>
              <Link
                to={config.site.defaultCtaUrl || "/contact"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-accent text-background rounded-lg text-xs uppercase tracking-[0.2em] font-semibold"
              >
                {config.site.defaultCtaText || "Inquire Commission"}
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-[11px] uppercase tracking-[0.2em] text-secondary hover:text-accent py-2"
              >
                Admin CMS Portal →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content with Soft Route Transition */}
      <main className="flex-grow z-10">
        <PageTransitionOverlay>
          <Outlet />
        </PageTransitionOverlay>
      </main>

      {/* Luxury Editorial Footer */}
      <footer className="bg-[#0b0b0e] border-t border-white/[0.07] mt-32 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
            {/* Studio Info */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-serif text-2xl tracking-[0.15em] uppercase text-primary font-light">
                  {brandName}
                </span>
              </div>
              <p className="text-secondary text-xs sm:text-sm font-light max-w-md leading-relaxed">
                {config.footer.description ||
                  "Fine art & editorial photography dedicated to capturing monumental architectural form, high-fashion storytelling, and destination weddings across Europe and Asia."}
              </p>
              {config.contact.location && (
                <div className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.25em] text-accent/80 pt-2 font-mono">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{config.contact.location}</span>
                </div>
              )}

              {/* Social links row */}
              {config.footer.showSocialLinks && config.socialLinks.length > 0 && (
                <div className="flex items-center space-x-4 pt-4">
                  {config.socialLinks.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-secondary hover:text-accent hover:border-accent/40 transition-all hover:scale-110"
                      title={`${soc.platform} (${soc.label})`}
                    >
                      {renderSocialIcon(soc.icon || soc.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links Column */}
            {config.footer.showNavigation && (
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent">
                  Navigation
                </h4>
                <ul className="space-y-2 text-xs uppercase tracking-[0.18em] text-secondary">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      {item.type === "INTERNAL" ? (
                        <AnimatedLink to={item.url} className="hover:text-accent">
                          {item.label}
                        </AnimatedLink>
                      ) : (
                        <AnimatedLink href={item.url} target={item.openNewTab ? "_blank" : "_self"} rel="noreferrer" className="hover:text-accent">
                          {item.label}
                        </AnimatedLink>
                      )}
                    </li>
                  ))}
                  <li>
                    <AnimatedLink to="/admin/login" className="hover:text-accent">
                      CMS Management
                    </AnimatedLink>
                  </li>
                </ul>
              </div>
            )}

            {/* Inquiries & Representation Column */}
            {config.footer.showContact && (
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent">
                  Commissions & Inquiries
                </h4>
                <p className="text-xs text-secondary font-light">
                  {config.contact.availability || "For private commissions, bridal editorial dates, and commercial licensing:"}
                </p>
                {config.contact.email && (
                  <AnimatedLink
                    href={`mailto:${config.contact.email}`}
                    className="block text-sm text-primary font-medium hover:text-accent"
                  >
                    {config.contact.email}
                  </AnimatedLink>
                )}
                {config.contact.phone && (
                  <p className="text-[11px] text-secondary/70">Direct: {config.contact.phone}</p>
                )}
                {config.contact.whatsappNumber && (
                  <p className="text-[11px] text-secondary/70">WhatsApp VIP: {config.contact.whatsappNumber}</p>
                )}
              </div>
            )}
          </div>

          {/* Copyright & Sub-footer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary/60">
            <p>
              &copy; {new Date().getFullYear()} {config.footer.copyrightText || `${brandName}. All rights reserved.`}
            </p>
            <div className="flex items-center space-x-6 text-[11px] uppercase tracking-widest text-secondary/60">
              <AnimatedLink to="/privacy-policy" className="hover:text-accent">Privacy</AnimatedLink>
              <span>•</span>
              <AnimatedLink to="/terms" className="hover:text-accent">Terms & Licensing</AnimatedLink>
              <span>•</span>
              <AnimatedLink to="/admin/login" className="hover:text-accent">Admin Portal</AnimatedLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
