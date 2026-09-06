import {
  PhotographerProfile,
  AboutSectionEntity,
  PublicAboutData,
  AccoladeItem,
} from "./about.types.js";

const DEFAULT_PROFILE: PhotographerProfile = {
  display_name: "Alex Mercer",
  professional_title: "Principal Visual Artist & Founder",
  short_bio: "Documenting human vulnerability, high-fashion monographs, and monolithic architecture across Europe, Japan, and the Americas.",
  location: "Paris • Tokyo • Milan",
  years_experience: 14,
  profile_image_url: "/uploads/portrait_woman.jpg",
  cover_image_url: "/uploads/wedding_arch.jpg",
  email: "studio@alexmercer.com",
  phone: "+33 1 42 68 55 00",
  website: "https://alexmercer.com",
};

const DEFAULT_ACCOLADES: AccoladeItem[] = [
  { value: "14+", label: "Years of Practice" },
  { value: "32", label: "Countries Documented" },
  { value: "180+", label: "Destination Celebrations" },
  { value: "28", label: "International Awards" },
];

const DEFAULT_PRESS = [
  "Vogue Weddings",
  "Harper's Bazaar",
  "Architectural Digest",
  "Elle Décor",
  "GQ Style",
  "Leica Fotografie International",
];

const DEFAULT_SECTIONS: AboutSectionEntity[] = [
  {
    id: "sec-about-01",
    section_key: "story",
    title: "The Artist's Story",
    is_visible: true,
    sort_order: 1,
    configuration: {
      eyebrow: "ARTIST STATEMENT & ORIGIN",
      heading: "Capturing fleeting nuance with quiet reverence and timeless elegance.",
      paragraphs: [
        "For more than fourteen years, Alex Mercer has traversed continents documenting private weddings, high-fashion monographs, and sculptural architecture for discerning private clients and global publications.",
        "Rooted in the traditions of European classical painting and modernist cinema, his work focuses on atmospheric chiaroscuro, natural golden hour luminescence, and genuine human vulnerability.",
        "Rather than relying on fleeting trends, his photographs exist outside of time—crafted as generational heirlooms preserved on medium-format sensors and silver halide emulsion.",
      ],
      image_url: "/uploads/craftsman_workshop.jpg",
      image_caption: "Alex Mercer on assignment at the Tuscan Artisanal Atelier, 2026",
    },
  },
  {
    id: "sec-about-02",
    section_key: "philosophy",
    title: "Photography Philosophy",
    is_visible: true,
    sort_order: 2,
    configuration: {
      eyebrow: "THE FOUR PILLARS",
      heading: "How We Perceive & Preserve Time",
      description: "Our approach rejects forced poses and artificial staging. We believe in being profoundly present to honor what unfolds organically.",
      principles: [
        {
          number: "01",
          title: "Chiaroscuro & Natural Light",
          description: "Harnessing the interplay between deep shadow and ambient golden rays to reveal honest contours and uninhibited emotion without artificial flash.",
        },
        {
          number: "02",
          title: "Medium Format Tactility",
          description: "Working exclusively with Hasselblad and Leica systems equipped with handcrafted German lenses for irreplaceable tonal richness.",
        },
        {
          number: "03",
          title: "Documentary Poetics",
          description: "Refraining from rigid direction. We document your celebration as it breathes—unfolding with poise, elegance, and unscripted intimacy.",
        },
        {
          number: "04",
          title: "Generational Longevity",
          description: "Images graded and mastered for timeless permanence, defying algorithmic aesthetic trends to look as breathtaking 50 years from now.",
        },
      ],
    },
  },
  {
    id: "sec-about-03",
    section_key: "services",
    title: "Commission Offerings",
    is_visible: true,
    sort_order: 3,
    configuration: {
      eyebrow: "SERVICES & DISCIPLINES",
      heading: "Bespoke Visual Commissions",
      description: "Available globally for private commissions, destination weddings, and editorial monographs.",
      services: [
        {
          id: "srv-01",
          number: "01",
          title: "Destination Wedding Monographs",
          short_description: "Comprehensive multi-day documentary coverage of luxury celebrations worldwide. From welcome dinners to farewell brunches.",
          deliverables: ["Full weekend documentation", "Medium-format digital + 35mm film", "Curated leather-bound master album", "Private high-res client vault"],
          is_visible: true,
        },
        {
          id: "srv-02",
          number: "02",
          title: "High-Fashion & Magazine Editorials",
          short_description: "Avant-garde editorial storytelling for couture houses, luxury ateliers, and international periodicals.",
          deliverables: ["Creative art direction", "Full studio or location production", "High-end archival retouching", "Commercial licensing suite"],
          is_visible: true,
        },
        {
          id: "srv-03",
          number: "03",
          title: "Private Character Portraits",
          short_description: "Intimate studio sessions capturing individuality, quiet intensity, and unfiltered human presence.",
          deliverables: ["Studio session in Paris or New York", "Handcrafted fine art prints", "Archival certification"],
          is_visible: true,
        },
        {
          id: "srv-04",
          number: "04",
          title: "Architectural & Spatial Studies",
          short_description: "Commissioned visual monographs documenting contemporary architecture, private estates, and luxury sanctuaries.",
          deliverables: ["Interior & exterior light study", "Aerial medium-format perspectives", "Monograph publication layout"],
          is_visible: true,
        },
      ],
    },
  },
  {
    id: "sec-about-04",
    section_key: "process",
    title: "The Working Process",
    is_visible: true,
    sort_order: 4,
    configuration: {
      eyebrow: "THE CLIENT JOURNEY",
      heading: "How We Craft Your Story",
      description: "A seamless, deeply collaborative experience designed to keep you relaxed and fully immersed in the moment.",
      steps: [
        {
          step: "01",
          title: "The Dialogue",
          description: "We begin with an intimate conversation to understand your aesthetic vision, the subtleties of your celebration, and what matters most.",
        },
        {
          step: "02",
          title: "Creative Alignment",
          description: "We map the light dynamics, locations, timeline flow, and visual moodboard so every moment unfolds effortlessly on the day.",
        },
        {
          step: "03",
          title: "The Creation",
          description: "Unobtrusive, documentary coverage. You immerse yourself in the celebration while we capture life happening with quiet grace.",
        },
        {
          step: "04",
          title: "Curation & Grading",
          description: "Each frame is meticulously color-graded by hand using bespoke tonal curves to evoke deep emotion and cinematic nostalgia.",
        },
        {
          step: "05",
          title: "The Heirlooms",
          description: "Your master story is delivered in a private digital vault along with bespoke handcrafted Italian leather monographs.",
        },
      ],
    },
  },
  {
    id: "sec-about-05",
    section_key: "testimonials",
    title: "Client Testimonials",
    is_visible: true,
    sort_order: 5,
    configuration: {
      eyebrow: "WORDS FROM CLIENTS",
      heading: "Kind Reflections on Past Stories",
      testimonials: [
        {
          id: "test-01",
          client_names: "Sophia & Marc de Laurent",
          event_type: "Villa Balbiano Destination Wedding",
          location: "Lake Como, Italy",
          quote: "Working with Alex felt effortless from the first moment. He didn't just photograph our wedding; he captured the soul, the laughter, and the quiet glances we were too overwhelmed to even notice. Looking through our album brings tears every single time.",
          is_visible: true,
        },
        {
          id: "test-02",
          client_names: "Clara Vane",
          event_type: "Creative Director, Maison Noir",
          location: "Paris, France",
          quote: "Alex has a rare painterly understanding of light and fabric motion. His editorial series for our autumn monograph surpassed all expectations, balancing high-fashion drama with poetic subtlety.",
          is_visible: true,
        },
        {
          id: "test-03",
          client_names: "Elena & Kenji Takahashi",
          event_type: "Three-Day Kyoto Celebration",
          location: "Kyoto, Japan",
          quote: "Alex was like a ghost with a Leica—calm, unobtrusive, yet present for every sacred moment. The medium-format prints now hanging in our home are our most cherished possessions.",
          is_visible: true,
        },
      ],
    },
  },
  {
    id: "sec-about-06",
    section_key: "social",
    title: "Social & Direct Channels",
    is_visible: true,
    sort_order: 6,
    configuration: {
      eyebrow: "CONNECT ACROSS PLATFORMS",
      heading: "Follow The Visual Journey",
      description: "Daily behind-the-scenes, prints archive, and recent commissions shared across platforms.",
      profiles: [
        { platform: "Instagram", label: "@alexmercer.atelier", url: "https://instagram.com", is_visible: true },
        { platform: "Behance", label: "alexmercer-visuals", url: "https://behance.net", is_visible: true },
        { platform: "500px", label: "Alex Mercer Fine Art", url: "https://500px.com", is_visible: true },
        { platform: "WhatsApp", label: "Studio Private Line", url: "https://whatsapp.com", is_visible: true },
      ],
    },
  },
];

let IN_MEMORY_PROFILE: PhotographerProfile = { ...DEFAULT_PROFILE };
let IN_MEMORY_SECTIONS: AboutSectionEntity[] = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
let IN_MEMORY_ACCOLADES: AccoladeItem[] = [...DEFAULT_ACCOLADES];
let IN_MEMORY_PRESS: string[] = [...DEFAULT_PRESS];

export class AboutRepository {
  async getPublicAbout(): Promise<PublicAboutData> {
    const visibleSections = IN_MEMORY_SECTIONS.filter((s) => s.is_visible).sort(
      (a, b) => a.sort_order - b.sort_order
    );

    return {
      profile: IN_MEMORY_PROFILE,
      sections: visibleSections,
      press: IN_MEMORY_PRESS,
      accolades: IN_MEMORY_ACCOLADES,
    };
  }

  async getAdminAbout(): Promise<{
    profile: PhotographerProfile;
    sections: AboutSectionEntity[];
    press: string[];
    accolades: AccoladeItem[];
  }> {
    return {
      profile: IN_MEMORY_PROFILE,
      sections: [...IN_MEMORY_SECTIONS].sort((a, b) => a.sort_order - b.sort_order),
      press: IN_MEMORY_PRESS,
      accolades: IN_MEMORY_ACCOLADES,
    };
  }

  async updateProfile(profileData: Partial<PhotographerProfile>): Promise<PhotographerProfile> {
    IN_MEMORY_PROFILE = {
      ...IN_MEMORY_PROFILE,
      ...profileData,
    };
    return IN_MEMORY_PROFILE;
  }

  async updateSection(
    sectionKey: string,
    configuration: Record<string, any>,
    title?: string,
    is_visible?: boolean
  ): Promise<AboutSectionEntity> {
    const idx = IN_MEMORY_SECTIONS.findIndex((s) => s.section_key === sectionKey);
    if (idx === -1) {
      throw new Error(`About section ${sectionKey} not found`);
    }

    IN_MEMORY_SECTIONS[idx].configuration = {
      ...IN_MEMORY_SECTIONS[idx].configuration,
      ...configuration,
    };

    if (title !== undefined) IN_MEMORY_SECTIONS[idx].title = title;
    if (is_visible !== undefined) IN_MEMORY_SECTIONS[idx].is_visible = is_visible;
    IN_MEMORY_SECTIONS[idx].updated_at = new Date().toISOString();

    return IN_MEMORY_SECTIONS[idx];
  }

  async toggleVisibility(sectionKey: string, is_visible: boolean): Promise<AboutSectionEntity> {
    const section = IN_MEMORY_SECTIONS.find((s) => s.section_key === sectionKey);
    if (!section) {
      throw new Error(`Section ${sectionKey} not found`);
    }
    section.is_visible = is_visible;
    section.updated_at = new Date().toISOString();
    return section;
  }

  async reorderSections(orderedKeys: string[]): Promise<AboutSectionEntity[]> {
    orderedKeys.forEach((key, index) => {
      const sec = IN_MEMORY_SECTIONS.find((s) => s.section_key === key);
      if (sec) {
        sec.sort_order = index + 1;
        sec.updated_at = new Date().toISOString();
      }
    });

    return [...IN_MEMORY_SECTIONS].sort((a, b) => a.sort_order - b.sort_order);
  }

  async resetToDefault(): Promise<void> {
    IN_MEMORY_PROFILE = { ...DEFAULT_PROFILE };
    IN_MEMORY_SECTIONS = JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
    IN_MEMORY_ACCOLADES = [...DEFAULT_ACCOLADES];
    IN_MEMORY_PRESS = [...DEFAULT_PRESS];
  }
}
