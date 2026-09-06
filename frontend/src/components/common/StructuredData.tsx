import React, { useEffect } from "react";
import { useSiteConfig } from "../../features/public/context/SiteConfigContext";

interface StructuredDataProps {
  type?: "website" | "photographer" | "project";
  projectData?: {
    title: string;
    description?: string;
    imageUrl?: string;
    datePublished?: string;
    slug?: string;
  };
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  type = "website",
  projectData,
}) => {
  const { config } = useSiteConfig();
  const siteUrl = config.seo.canonicalUrl || window.location.origin;

  useEffect(() => {
    let schema: any = {};

    if (type === "project" && projectData) {
      schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: projectData.title,
        description: projectData.description || config.seo.metaDescription,
        image: projectData.imageUrl || config.branding.ogImage,
        datePublished: projectData.datePublished || new Date().toISOString(),
        author: {
          "@type": "Person",
          name: config.site.photographerName || "Alex Mercer",
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: config.branding.brandName || config.site.name,
          logo: {
            "@type": "ImageObject",
            url: config.branding.logo || config.branding.ogImage,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteUrl}/portfolio/${projectData.slug || ""}`,
        },
      };
    } else {
      // Global Photographer & Studio Business Schema
      schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: config.branding.brandName || config.site.name || "Alex Mercer Studio Atelier",
        description: config.seo.metaDescription,
        url: siteUrl,
        telephone: config.contact.phone,
        email: config.contact.email,
        priceRange: "$$$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: config.contact.location || "Paris",
          addressCountry: "FR",
        },
        founder: {
          "@type": "Person",
          name: config.site.photographerName || "Alex Mercer",
          jobTitle: "Fine Art & Editorial Photographer",
          sameAs: config.socialLinks.map((s) => s.url),
        },
      };
    }

    const scriptId = `jsonld-${type}`;
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [type, projectData, config, siteUrl]);

  return null;
};
