import React, { useEffect } from "react";
import { useSiteConfig } from "../../features/public/context/SiteConfigContext";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: string;
}

export const SEO: React.FC<SeoProps> = ({
  title,
  description,
  image,
  url,
  keywords,
  type = "website",
}) => {
  const { config } = useSiteConfig();
  const globalSeo = config.seo;
  const siteName = config.site.name || config.site.photographerName;

  const resolvedTitle = title
    ? `${title} | ${siteName}`
    : globalSeo.siteTitle || siteName;

  const resolvedDescription = description || globalSeo.metaDescription;
  const resolvedImage = image || globalSeo.ogImage || config.branding.ogImage;
  const resolvedUrl = url || globalSeo.canonicalUrl || window.location.href;
  const resolvedKeywords = keywords || globalSeo.metaKeywords;

  useEffect(() => {
    // 1. Title
    document.title = resolvedTitle;

    // Helper to create or update meta tag
    const setMetaTag = (selector: string, attr: string, value: string) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const parts = selector.replace(/[\[\]"]/g, "").split("=");
        if (parts.length === 2) {
          el.setAttribute(parts[0], parts[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Standard Meta
    setMetaTag('meta[name="description"]', "content", resolvedDescription);
    setMetaTag('meta[name="keywords"]', "content", resolvedKeywords);
    setMetaTag(
      'meta[name="robots"]',
      "content",
      `${globalSeo.robotsIndex ? "index" : "noindex"}, ${
        globalSeo.robotsFollow ? "follow" : "nofollow"
      }`
    );

    // OpenGraph
    setMetaTag('meta[property="og:title"]', "content", resolvedTitle);
    setMetaTag('meta[property="og:description"]', "content", resolvedDescription);
    setMetaTag('meta[property="og:image"]', "content", resolvedImage);
    setMetaTag('meta[property="og:url"]', "content", resolvedUrl);
    setMetaTag('meta[property="og:type"]', "content", type);

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaTag(
      'meta[name="twitter:title"]',
      "content",
      globalSeo.twitterTitle || resolvedTitle
    );
    setMetaTag(
      'meta[name="twitter:description"]',
      "content",
      globalSeo.twitterDescription || resolvedDescription
    );
    if (resolvedImage) {
      setMetaTag('meta[name="twitter:image"]', "content", resolvedImage);
    }

    // Favicon update if configured
    if (config.branding.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        document.head.appendChild(link);
      }
      link.href = config.branding.favicon;
    }
  }, [
    resolvedTitle,
    resolvedDescription,
    resolvedImage,
    resolvedUrl,
    resolvedKeywords,
    globalSeo,
    config.branding.favicon,
    type,
  ]);

  return null;
};
