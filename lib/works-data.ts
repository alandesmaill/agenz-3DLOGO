/**
 * Portfolio/Works Data
 */

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
    icon: string;
  }>;

  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };

  relatedProjects: string[];
}

// ============================================
// PORTFOLIO DATA
// ============================================

export const portfolioData: Record<string, PortfolioItem> = {
  // ========================================
  // Sulaymaniyah City Anniversary 2025
  // ========================================
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
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/gallery-1.webp', alt: 'Suli Day event coverage' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/gallery-2.webp', alt: 'Nali stamp illustration' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/gallery-3.webp', alt: 'Social media campaign' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/gallery-4.webp', alt: 'Cultural branding materials' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/gallery-5.webp', alt: 'Event photography' },
      { type: 'image', src: '/images/works/sulaymaniyah-anniversary-2025/gallery-6.webp', alt: 'Outdoor activation design' },
    ],

    results: [
      { metric: 'theme', value: 'Nali', label: 'Cultural Theme', icon: '/icons/brand.svg' },
      { metric: 'coverage', value: 'Full', label: 'Event Coverage', icon: '/icons/camera.svg' },
      { metric: 'assets', value: '50+', label: 'Assets Delivered', icon: '/icons/package.svg' },
      { metric: 'city', value: 'Suli', label: 'City of Sulaymaniyah', icon: '/icons/community.svg' },
    ],

    testimonial: {
      quote:
        'Agenz brought the soul of our city to life. Every visual, every post, every moment of coverage felt deeply rooted in who we are — a city of culture, poetry, and pride.',
      author: 'Sulaymaniyah Governorate',
      role: 'City Anniversary Committee',
      company: 'Sulaymaniyah, Kurdistan Region',
    },

    relatedProjects: [],
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

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
