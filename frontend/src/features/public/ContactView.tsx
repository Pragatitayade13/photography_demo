import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  Sparkles,
  Compass,
  AlertCircle,
} from "lucide-react";
import { enquiryService } from "../contact/services/enquiryService";
import { useSiteConfig } from "./context/SiteConfigContext";
import { ScrollReveal } from "../../components/motion/ScrollReveal";
import { TextSplitReveal } from "../../components/motion/TextSplitReveal";

export const ContactView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get("project") || "";
  const shortlistParam = searchParams.get("shortlist") || "";
  const sourceParam = searchParams.get("source") || "contact_page";
  const { config } = useSiteConfig();

  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry_type: "wedding",
    event_date: "",
    location: "",
    budget_range: "₹50,000 - ₹1,00,000",
    message: "",
    consent: true,
    honeypot: "", // invisible spam bot trap
  });

  useEffect(() => {
    if (shortlistParam) {
      setFormData((prev) => ({
        ...prev,
        message: `Inquiring regarding my curated shortlist portfolio selections: ${shortlistParam}\n\nI would like to explore availability and commission details for a bespoke editorial package.`,
      }));
    } else if (projectParam) {
      setFormData((prev) => ({
        ...prev,
        message: `Inquiring regarding story commission inspired by '${projectParam}'.\n\n`,
      }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [projectParam, shortlistParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await enquiryService.submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        enquiry_type: formData.enquiry_type,
        event_date: formData.event_date,
        location: formData.location,
        budget_range: formData.budget_range,
        message: formData.message,
        consent: formData.consent,
        source: projectParam ? "project" : (sourceParam as any),
        source_project_id: projectParam || undefined,
        honeypot: formData.honeypot,
      });

      if (res && res.reference_number) {
        setReferenceNumber(res.reference_number);
        setSubmitted(true);
      } else {
        setReferenceNumber("ENQ-" + Math.floor(100000 + Math.random() * 900000));
        setSubmitted(true);
      }
    } catch (err: any) {
      console.error("Enquiry submit error:", err);
      setErrorMessage(err?.response?.data?.error?.message || "Failed to submit inquiry. Please try again or reach out directly via email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactEmail = config.contact.email || "studio@alexmercer.photography";
  const contactWhatsapp = config.contact.whatsappNumber || "+44 20 7946 0912";
  const contactLocation = config.contact.location || "Paris, France & Lake Como, Italy";
  const contactResponse = config.contact.responseTime || "Typically responds within 24 hours";

  return (
    <div className="min-h-screen bg-[#08080a] text-primary">
      {/* Editorial Header */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/[0.06] text-center space-y-6">
        <ScrollReveal variant="fade-up">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-accent text-[11px] uppercase tracking-[0.25em] shadow-lg font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Commissions & Inquiries</span>
          </div>
        </ScrollReveal>

        <TextSplitReveal
          as="h1"
          text="Let Us Create Something Unforgettable"
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight max-w-4xl mx-auto leading-[1.1]"
          delay={0.15}
        />

        <ScrollReveal variant="fade-up" delay={0.25}>
          <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto font-light leading-relaxed">
            Accepting a strictly limited number of international destination wedding commissions and high-fashion editorial assignments annually.
          </p>
        </ScrollReveal>
      </section>

      {/* Main Content: Info & Form */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-4 space-y-6">
            <ScrollReveal variant="fade-up" delay={0.1}>
              <div className="p-8 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-4">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent font-mono">
                    Direct Email
                  </span>
                  <p className="text-sm font-medium text-primary mt-1">{contactEmail}</p>
                  <p className="text-xs text-secondary/70 mt-1">For editorial proposals & bridal dates</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.2}>
              <div className="p-8 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-4">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent">
                  <MessageSquare className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent font-mono">
                    WhatsApp VIP Line
                  </span>
                  <p className="text-sm font-medium text-primary mt-1">{contactWhatsapp}</p>
                  <p className="text-xs text-secondary/70 mt-1">{contactResponse}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.3}>
              <div className="p-8 rounded-2xl bg-[#0e0e13] border border-white/[0.07] space-y-4">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent">
                  <Compass className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent font-mono">
                    Atelier Locations
                  </span>
                  <p className="text-sm font-medium text-primary mt-1">{contactLocation}</p>
                  <p className="text-xs text-secondary/70 mt-1">Available for commissions worldwide</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Booking Inquiry Form */}
          <div className="lg:col-span-8">
            <ScrollReveal variant="fade-up" delay={0.15}>
              <div className="bg-[#0e0e13] border border-white/[0.08] rounded-2xl p-8 sm:p-12 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mx-auto">
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent">
                      Reference: {referenceNumber}
                    </span>
                    <h3 className="font-serif text-3xl font-light text-primary">Inquiry Received</h3>
                    <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out. Alex and our studio concierge will review your project details and respond within 24 hours.
                    </p>
                    <div className="pt-6">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            enquiry_type: "wedding",
                            event_date: "",
                            location: "",
                            budget_range: "₹50,000 - ₹1,00,000",
                            message: "",
                            consent: true,
                            honeypot: "",
                          });
                        }}
                        className="px-6 py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent font-mono">
                        Project Questionnaire
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-light text-primary">
                        Tell us about your upcoming project
                      </h3>
                    </div>

                    {errorMessage && (
                      <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center space-x-3 text-danger text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Honeypot field for bot protection */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.honeypot}
                        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. eleanor@example.com"
                          className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                          Commission Nature *
                        </label>
                        <select
                          value={formData.enquiry_type}
                          onChange={(e) => setFormData({ ...formData, enquiry_type: e.target.value })}
                          className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                        >
                          <option value="wedding">Destination Wedding Story</option>
                          <option value="editorial">Fashion & Editorial Assignment</option>
                          <option value="portrait">Intimate Studio / Fine-Art Portrait</option>
                          <option value="architecture">Architectural & Spatial Monograph</option>
                          <option value="commercial">Commercial Campaign & Licensing</option>
                          <option value="other">Private Inquiry / Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                          Direct Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +44 7911 123456"
                          className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                          Event Date or Timeframe
                        </label>
                        <input
                          type="text"
                          value={formData.event_date}
                          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                          placeholder="e.g. September 2026 or Flexible"
                          className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                          Budget Range
                        </label>
                        <select
                          value={formData.budget_range}
                          onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                          className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                        >
                          <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                          <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                          <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                          <option value="₹5,00,000+">₹5,00,000+ (Master Commission)</option>
                          <option value="Flexible / Not Stated">Flexible / Undecided</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                        Shoot Destination or Venue
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Villa Balbianello, Lake Como or Paris, France"
                        className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.18em] text-secondary font-mono">
                        Project Narrative & Creative Concept *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your aesthetic vision, guest scale, anticipated schedule, and any particular moods you wish to capture..."
                        className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-4 py-3.5 text-xs text-primary focus:outline-none focus:border-accent transition-colors leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <input
                        type="checkbox"
                        id="consent"
                        required
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-[#14141a] text-accent focus:ring-accent"
                      />
                      <label htmlFor="consent" className="text-xs text-secondary/80 font-light">
                        I agree to be contacted regarding this photography inquiry.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-10 py-4 bg-accent text-[#08080a] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-accent-hover transition-all rounded-full shadow-xl shadow-accent/20 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Commission Request"}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
