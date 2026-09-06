import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, ArrowLeft, Mail } from "lucide-react";
import { useSiteConfig } from "./context/SiteConfigContext";
import { SEO } from "../../components/common/SEO";

interface LegalPolicyViewProps {
  type: "privacy" | "terms";
}

export const LegalPolicyView: React.FC<LegalPolicyViewProps> = ({ type }) => {
  const { config } = useSiteConfig();
  const brandName = config.branding.brandName || config.site.name || "Alex Mercer Studio";
  const contactEmail = config.contact.email || "studio@alexmercer.com";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [type]);

  const isPrivacy = type === "privacy";

  return (
    <div className="min-h-screen bg-[#08080a] text-primary">
      <SEO
        title={`${isPrivacy ? "Privacy Policy" : "Terms & Conditions"} | ${brandName}`}
        description={`Legal disclosures, data protection, copyright terms, and client agreement for ${brandName}.`}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 space-y-12">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Atelier</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-mono uppercase tracking-widest">
            {isPrivacy ? <ShieldCheck className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{isPrivacy ? "Data Protection & Privacy" : "Client Service Agreement"}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-light text-primary tracking-tight">
            {isPrivacy ? "Privacy & Data Policy" : "Terms of Commission"}
          </h1>
          <p className="text-xs text-secondary font-mono">
            Last Updated · September 2026 · {brandName}
          </p>
        </div>

        {/* Content Body */}
        {isPrivacy ? (
          <div className="space-y-8 text-sm text-secondary leading-relaxed font-sans font-light">
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">1. Principles of Discretion</h2>
              <p>
                At {brandName}, we hold client confidentiality, privacy, and personal data protection in the utmost regard. Whether commissioning an intimate destination wedding or an editorial campaign, your submitted inquiries and private gallery assets remain strictly confidential.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">2. Information We Collect</h2>
              <p>
                We collect information directly provided through our commission enquiry forms (including your full name, email address, phone number, event dates, and venue locations). Additionally, non-personally identifiable telemetry (such as screen resolution, Core Web Vitals, and browser type) is collected to optimize high-resolution image delivery and layout performance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">3. Image Rights & Private Galleries</h2>
              <p>
                Private client stories and unreleased proofing selections are restricted to password-protected or signed URL access. No private gallery media is indexed in search engines or displayed publicly without express client authorization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">4. Contacting Data Protection</h2>
              <p>
                To request data deletion, modification, or disclosure under GDPR/CCPA regulations, please reach out directly to our studio atelier at{" "}
                <a href={`mailto:${contactEmail}`} className="text-accent underline">
                  {contactEmail}
                </a>
                .
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-8 text-sm text-secondary leading-relaxed font-sans font-light">
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">1. Studio Engagement & Booking</h2>
              <p>
                Commission dates for destination weddings, fashion editorials, and commercial visual productions are secured upon execution of a formal commission agreement and deposit retainer.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">2. Copyright & Intellectual Property</h2>
              <p>
                All photographs, digital negatives, and creative productions hosted on this domain are the exclusive copyright of {brandName}. Clients receive private reproduction and archival licenses for personal or commercial usage as stipulated in their bespoke commission contracts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">3. High-Resolution Delivery</h2>
              <p>
                Digital deliveries and retouched master plates are preserved in encrypted high-availability storage and made accessible via client galleries with lifetime archival availability options.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl text-primary font-medium">4. Inquiries & Legal Notices</h2>
              <p>
                For licensing inquiries or legal notices, contact{" "}
                <a href={`mailto:${contactEmail}`} className="text-accent underline">
                  {contactEmail}
                </a>
                .
              </p>
            </section>
          </div>
        )}

        {/* Footer Contact Box */}
        <div className="p-6 bg-surface border border-surface-border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-primary font-semibold">Have questions?</h4>
            <p className="text-xs text-secondary">Our studio manager is available to assist with any bespoke agreements.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent text-background text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover transition-colors shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
