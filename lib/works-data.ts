export type WorkCategory = 'brand-identity' | 'digital-campaigns' | 'video-production' | 'event-branding';

export interface PortfolioItem {
  id: string;
  category: WorkCategory;
  clientName: string;
  projectTitle: string;
  year: string;
  accentColor: string;

  thumbnail: {
    image: string;
    alt: string;
  };

  hero: {
    coverImage: string;
    tagline: string;
    description: string;
    stats: Array<{
      label: string;
      value: string;
    }>;
  };

  overview: {
    challenge: string;
    solution: string;
    approach: string[];
    deliverables: string[];
  };

  beforeAfter?: {
    beforeImage: string;
    afterImage: string;
    description: string;
  };

  gallery: Array<{
    type: 'image' | 'video';
    src: string;
    alt?: string;
    thumbnail?: string;
  }>;

  results: Array<{
    metric: string;
    value: string;
    label: string;
  }>;

  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };

  relatedProjects: string[];
}

export const portfolioData: Record<string, PortfolioItem> = {
  'sulaymaniyah-anniversary-2025': {
    id: 'sulaymaniyah-anniversary-2025',
    category: 'event-branding',
    clientName: 'Sulaymaniyah Governorate',
    projectTitle: 'Suli Day — City Anniversary 2025',
    year: '2025',
    accentColor: '#00e92c',

    thumbnail: {
      image: '/images/works/sulaymaniyah-anniversary-2025/sulaymaniyah-anniversary-160x120.webp',
      alt: 'Suli Day 2025 — Sulaymaniyah City Anniversary',
    },

    hero: {
      coverImage: '/images/works/sulaymaniyah-anniversary-2025/sulaymaniyah-anniversary- 600×400px.webp',
      tagline: 'Honoring Nali — The Poet Who Gave the City Its Soul',
      description:
        'This year, Suli Day celebrated the spirit of Nali, one of Kurdistan\'s legendary poets. We brought the theme to life through captivating visuals, thoughtful branding, and immersive event coverage, honoring culture, poetry, and community while turning every moment into a memorable story.',
      stats: [
        { value: 'Nali', label: 'Theme' },
        { value: '2025', label: 'Year' },
        { value: 'Sulaymaniyah', label: 'City' },
      ],
    },

    overview: {
      challenge:
        'Suli Day needed a cohesive visual identity that honored the depth of Kurdish culture and the legacy of the poet Nali, while resonating with modern audiences across social media, outdoor activations, and live event coverage.',
      solution:
        'We developed a full event branding system rooted in Kurdish heritage — from custom-illustrated stamps bearing Nali\'s portrait to traditional motif patterns, culturally rich typography, and immersive event content that captured the city\'s spirit.',
      approach: [
        'Deep cultural research into Nali\'s poetry and Sulaymaniyah\'s heritage',
        'Custom illustration system inspired by Kurdish stamps and traditional art',
        'Full social media content calendar for pre-event, live, and post-event phases',
        'On-ground event coverage with a dedicated photography and video team',
        'Branded collateral design for outdoor activations and stage backdrops',
      ],
      deliverables: [
        'Event visual identity system (logo, color palette, patterns)',
        'Custom Nali stamp illustration and branded poster series',
        'Social media content — posts, stories, and reels',
        'Event photography and videography coverage',
        'Stage and outdoor activation design assets',
        'Cultural program booklet and printed materials',
      ],
    },

    gallery: [
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 1.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 1' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 2.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 2' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 3.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 3' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 4.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 4' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 5.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 5' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 6.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 6' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 7.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 7' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 8.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 8' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 9.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 9' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 10.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 10' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 11.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 11' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 12.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 12' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 13.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 13' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/1 - 14.webp', alt: 'Sulaymaniyah Anniversary 2025 — Image 14' },
    ],

    results: [
      { metric: 'theme', value: 'Nali', label: 'Cultural Theme' },
      { metric: 'coverage', value: 'Full', label: 'Event Coverage' },
      { metric: 'assets', value: '50+', label: 'Assets Delivered' },
      { metric: 'city', value: 'Suli', label: 'City of Sulaymaniyah' },
    ],

    testimonial: {
      quote:
        'Agenz brought the soul of our city to life. Every visual, every post, every moment of coverage felt deeply rooted in who we are — a city of culture, poetry, and pride.',
      author: 'Sulaymaniyah Governorate',
      role: 'City Anniversary Committee',
      company: 'Sulaymaniyah, Kurdistan Region',
    },

    relatedProjects: ['galawezh-festival', 'bla-awards'],
  },

  'galawezh-festival': {
    id: 'galawezh-festival',
    category: 'event-branding',
    clientName: 'Galawezh International Festival',
    projectTitle: 'Galawezh Festival — Event Branding',
    year: '2024',
    accentColor: '#00e92c',

    thumbnail: {
      image: '/images/works/galawezh-festival/160x120 px.webp',
      alt: 'Galawezh Festival — Event Branding',
    },

    hero: {
      coverImage: '/images/works/galawezh-festival/600x400 px.webp',
      tagline: 'Culturally Rooted Design for an Iconic Festival',
      description:
        'We crafted sleek, culturally rooted designs for Galawezh Festival, capturing the event\'s iconic spirit. The visuals honored its legacy while appealing to modern audiences — blending heritage motifs, bold typography, and a cohesive visual language that resonated across every touchpoint.',
      stats: [
        { value: 'Cultural', label: 'Theme' },
        { value: '2024', label: 'Year' },
        { value: 'Branding', label: 'Scope' },
      ],
    },

    overview: {
      challenge:
        'Galawezh Festival needed a visual identity that honored its deep cultural roots while feeling fresh and compelling to modern audiences — a system that could translate across posters, digital media, stage design, and printed collateral.',
      solution:
        'We built a comprehensive event branding system that fused Kurdish heritage aesthetics with contemporary design principles. Rich calligraphy, botanical motifs, and earthy tones were woven into a cohesive identity that elevated every aspect of the festival experience.',
      approach: [
        "Cultural research into Galawezh Festival's history and visual heritage",
        'Development of a bilingual typographic system (Kurdish / Arabic / Latin)',
        'Custom illustration system drawing from botanical and calligraphic motifs',
        'Full asset suite covering print, digital, and environmental design',
        'Social media content designed for pre-event, live, and post-event phases',
      ],
      deliverables: [
        'Full event visual identity (logo, color palette, typography, patterns)',
        'Poster series and printed collateral',
        'Stage and environmental design assets',
        'Social media graphics and story templates',
        'Digital campaign assets',
      ],
    },

    gallery: [],

    results: [
      { metric: 'theme', value: 'Cultural', label: 'Heritage Theme' },
      { metric: 'scope', value: 'Full', label: 'Event Identity' },
      { metric: 'assets', value: '40+', label: 'Assets Delivered' },
      { metric: 'event', value: 'Festival', label: 'Event Branding' },
    ],

    testimonial: {
      quote:
        'Agenz gave Galawezh Festival a visual identity that felt both timeless and alive — deeply rooted in our culture yet bold enough to captivate a new generation of audiences.',
      author: 'Galawezh International Festival',
      role: 'Festival Committee',
      company: 'Galawezh Festival, 2024',
    },

    relatedProjects: ['sulaymaniyah-anniversary-2025', 'bla-awards'],
  },

  'bla-awards': {
    id: 'bla-awards',
    category: 'event-branding',
    clientName: 'BLA Awards',
    projectTitle: 'BLA Awards — Visual Identity & Branding',
    year: '2024',
    accentColor: '#00e92c',

    thumbnail: {
      image: '/images/works/bla-awards/160x120 px.webp',
      alt: 'BLA Awards — Visual Identity & Branding',
    },

    hero: {
      coverImage: '/images/works/bla-awards/600x400 px.webp',
      tagline: 'Celebrating the Brilliance of Writers and Poets',
      description:
        'We crafted the visual identity and branding for the BLA Awards, celebrating the brilliance of renowned writers and poets. From elegant graphics to cohesive event design, our work highlighted the prestige, creativity, and inspiration of the literary world, turning each moment into a lasting impression.',
      stats: [
        { value: 'Literary', label: 'Theme' },
        { value: '2024', label: 'Year' },
        { value: 'Branding', label: 'Scope' },
      ],
    },

    overview: {
      challenge:
        'The BLA Awards needed a visual identity that conveyed literary prestige and artistic depth — an aesthetic that would resonate with writers, poets, and cultural institutions while feeling both timeless and contemporary.',
      solution:
        'We developed a cohesive branding system anchored in elegance and creative expression. Every element — from typography to graphic language — was crafted to reflect the prestige of literature and the vibrant energy of the awards ceremony.',
      approach: [
        'In-depth research into literary awards aesthetics and cultural references',
        'Custom visual identity system with logo, color palette, and typography',
        'Cohesive event design spanning stage, print, and digital touchpoints',
        'Branded collateral designed to elevate every moment of the ceremony',
      ],
      deliverables: [
        'Full visual identity system (logo, color palette, typography)',
        'Event branding and stage design assets',
        'Printed materials and ceremony collateral',
        'Digital graphics and social media templates',
      ],
    },

    gallery: [],

    results: [
      { metric: 'theme', value: 'Literary', label: 'Creative Theme' },
      { metric: 'scope', value: 'Full', label: 'Brand Identity' },
      { metric: 'assets', value: '30+', label: 'Assets Delivered' },
      { metric: 'event', value: 'Awards', label: 'Event Branding' },
    ],

    testimonial: {
      quote:
        'Agenz transformed our vision into a visual language that truly honored the spirit of literature. The branding gave our awards ceremony the prestige and elegance it deserved.',
      author: 'BLA Awards',
      role: 'Awards Committee',
      company: 'BLA Awards, 2024',
    },

    relatedProjects: [],
  },
};

export function getAllPortfolio(): PortfolioItem[] {
  return Object.values(portfolioData);
}

export function getPortfolioByCategory(category: WorkCategory): PortfolioItem[] {
  return Object.values(portfolioData).filter((item) => item.category === category);
}

export function getPortfolioById(id: string): PortfolioItem | undefined {
  return portfolioData[id];
}

export function getCategoryLabel(category: WorkCategory): string {
  const labels: Record<WorkCategory, string> = {
    'brand-identity': 'Brand Identity',
    'digital-campaigns': 'Digital Campaigns',
    'video-production': 'Video Production',
    'event-branding': 'Event Branding',
  };
  return labels[category];
}

export function getCategoryColor(category: WorkCategory): string {
  const colors: Record<WorkCategory, string> = {
    'brand-identity': '#00ffff',
    'digital-campaigns': '#00d4aa',
    'video-production': '#00e92c',
    'event-branding': '#00e92c',
  };
  return colors[category];
}
