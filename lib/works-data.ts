/**
 * Portfolio/Works Data
 *
 * This file contains portfolio items showcasing client work across 3 categories:
 * - Brand Identity
 * - Digital Campaigns
 * - Video Production
 */

export type WorkCategory = 'brand-identity' | 'digital-campaigns' | 'video-production';

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
    thumbnail?: string; // For videos
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

  relatedProjects: string[]; // Array of IDs
}

// ============================================
// PORTFOLIO DATA
// ============================================

export const portfolioData: Record<string, PortfolioItem> = {
  // ========================================
  // BRAND IDENTITY #1: TechFlow Rebrand
  // ========================================
  'techflow-rebrand': {
    id: 'techflow-rebrand',
    category: 'brand-identity',
    clientName: 'TechFlow Inc.',
    projectTitle: 'Complete Brand Transformation',
    year: '2024',
    accentColor: '#00ffff', // Cyan

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'TechFlow brand identity showcase',
    },

    hero: {
      coverImage: '/images/works/hero/techflow-hero.jpg',
      tagline: 'From Generic SaaS to Industry Leader',
      description: 'A complete brand transformation that repositioned TechFlow as an innovative technology leader, resulting in 90% brand recognition and a confident sales team.',
      stats: [
        { value: '90%', label: 'Brand Recognition' },
        { value: '50+', label: 'Assets Delivered' },
        { value: '3 Months', label: 'Timeline' },
      ],
    },

    overview: {
      challenge: 'TechFlow\'s brand identity felt generic and dated. They looked like every other SaaS company with blue/gray branding and couldn\'t differentiate in a crowded B2B market. Their marketing materials lacked cohesion, and the sales team struggled to convey the company\'s innovative edge.',
      solution: 'We developed a bold, modern brand identity that breaks B2B conventions while maintaining credibility. The new system features vibrant gradients, geometric patterns inspired by data flow, and dynamic typography that conveys movement and innovation.',
      approach: [
        'Competitive audit of 20+ SaaS competitors to identify differentiation opportunities',
        'Stakeholder interviews with executives, sales, and customers to define brand attributes',
        'Multiple design explorations testing different visual directions',
        'Development of comprehensive brand guidelines with real-world application examples',
      ],
      deliverables: [
        'Complete visual identity system (logo, color palette, typography)',
        'Brand guidelines documentation (80-page brand book)',
        'Presentation templates (PowerPoint, Google Slides, Keynote)',
        'Marketing collateral (business cards, letterheads, email signatures)',
        'Social media asset templates and profile graphics',
        'Website design system and UI components',
      ],
    },

    beforeAfter: {
      beforeImage: '/images/works/thumbnails/techflow.jpg',
      afterImage: '/images/works/thumbnails/techflow.jpg',
      description: 'Transformation from a generic blue SaaS identity to a bold, distinctive brand that commands attention.',
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'TechFlow logo variants' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Brand color system' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Typography specimens' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Business card designs' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Presentation templates' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Social media mockups' },
    ],

    results: [
      { metric: 'recognition', value: '90%', label: 'Brand Recognition', icon: '/icons/brand.svg' },
      { metric: 'assets', value: '50+', label: 'Assets Delivered', icon: '/icons/package.svg' },
      { metric: 'sales', value: '65%', label: 'Sales Confidence Increase', icon: '/icons/growth.svg' },
      { metric: 'engagement', value: '3.2x', label: 'Social Engagement', icon: '/icons/analytics.svg' },
    ],

    testimonial: {
      quote: 'The rebrand gave our sales team the confidence they needed. We finally look like the innovative company we are, not just another SaaS tool. The investment paid for itself in the first quarter.',
      author: 'Sarah Chen',
      role: 'VP of Marketing',
      company: 'TechFlow Inc.',
    },

    relatedProjects: ['startupxyz-launch', 'luxe-hotels-campaign'],
  },

  // ========================================
  // BRAND IDENTITY #2: Organics Co. Packaging
  // ========================================
  'organics-packaging': {
    id: 'organics-packaging',
    category: 'brand-identity',
    clientName: 'Organics Co.',
    projectTitle: 'Premium Packaging System',
    year: '2024',
    accentColor: '#00e92c', // Green

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Organics Co. packaging design',
    },

    hero: {
      coverImage: '/images/works/hero/organics-hero.jpg',
      tagline: 'Elevating Organic Wellness to Premium Status',
      description: 'A complete packaging redesign that transformed shelf appeal and positioning, resulting in a 40% sales increase and industry recognition.',
      stats: [
        { value: '65%', label: 'Shelf Appeal Increase' },
        { value: '40%', label: 'Sales Growth' },
        { value: '12', label: 'Product Lines' },
      ],
    },

    overview: {
      challenge: 'Organics Co.\'s packaging looked outdated compared to competitors. Their products were getting lost on shelves, and the brand didn\'t communicate the premium quality of their organic ingredients. Customer perception was "budget brand" despite premium pricing.',
      solution: 'We designed a sophisticated packaging system featuring minimalist aesthetics, earth-tone colors, and tactile finishes (soft-touch lamination, embossing). Emphasized ingredient transparency with illustrated botanical elements and clear hierarchy.',
      approach: [
        'Retail shelf audit at major retailers to analyze competitor positioning',
        'Customer focus groups testing packaging concepts and messaging',
        'Sustainable material research for eco-conscious brand alignment',
        'Print production testing to perfect finishes and color accuracy',
      ],
      deliverables: [
        'Packaging design for 12 product lines (bottles, boxes, labels)',
        'Illustrated botanical element library (30+ custom illustrations)',
        'Print specifications and vendor guidelines',
        'Retail display mockups and POS materials',
        'Packaging photography for e-commerce and marketing',
      ],
    },

    beforeAfter: {
      beforeImage: '/images/works/thumbnails/techflow.jpg',
      afterImage: '/images/works/thumbnails/techflow.jpg',
      description: 'From cluttered, dated packaging to a clean, premium system that stands out on shelves.',
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Product lineup' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Botanical illustrations' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Packaging details' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Retail shelf mockup' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Unboxing experience' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Label closeups' },
    ],

    results: [
      { metric: 'shelf-appeal', value: '65%', label: 'Shelf Appeal Increase', icon: '/icons/brand.svg' },
      { metric: 'sales', value: '40%', label: 'Sales Growth', icon: '/icons/growth.svg' },
      { metric: 'award', value: '🏆', label: 'Packaging Award', icon: '/icons/award.svg' },
      { metric: 'retail', value: '150+', label: 'New Retail Locations', icon: '/icons/distribution.svg' },
    ],

    testimonial: {
      quote: 'Our new packaging transformed our brand perception overnight. Customers now see us as the premium option, and retail buyers are actively seeking us out. The investment was worth every penny.',
      author: 'Elena Vasquez',
      role: 'Founder & CEO',
      company: 'Organics Co.',
    },

    relatedProjects: ['techflow-rebrand', 'cascade-festival'],
  },

  // ========================================
  // DIGITAL CAMPAIGNS #1: Luxe Hotels Campaign
  // ========================================
  'luxe-hotels-campaign': {
    id: 'luxe-hotels-campaign',
    category: 'digital-campaigns',
    clientName: 'Luxe Hotels Group',
    projectTitle: 'Instagram Transformation Campaign',
    year: '2024',
    accentColor: '#00d4aa', // Teal

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Luxe Hotels social media campaign',
    },

    hero: {
      coverImage: '/images/works/hero/luxe-hero.jpg',
      tagline: 'Attracting Younger Travelers Through Visual Storytelling',
      description: 'A comprehensive Instagram strategy that transformed Luxe Hotels\' digital presence, achieving 250% follower growth and a 45% increase in direct bookings.',
      stats: [
        { value: '250%', label: 'Follower Growth' },
        { value: '45%', label: 'Booking Increase' },
        { value: '12%', label: 'Engagement Rate' },
      ],
    },

    overview: {
      challenge: 'Luxe Hotels wanted to attract younger travelers (25-40) to their boutique properties but their Instagram presence felt outdated and wasn\'t driving bookings. Content lacked consistency, and engagement was below 2%.',
      solution: 'We created a visual storytelling strategy showcasing unique experiences, local culture, and behind-the-scenes content. Launched Instagram Stories and Reels series featuring guest testimonials and staff recommendations, plus Instagram Shopping for direct booking.',
      approach: [
        'Content audit and competitor analysis across 15 boutique hotel brands',
        'Influencer partnership strategy with travel micro-influencers',
        'Instagram Shopping integration with booking engine',
        'Monthly content calendar with seasonal campaigns',
      ],
      deliverables: [
        'Complete Instagram strategy and content calendar',
        '120+ high-quality posts (photos, Reels, Stories)',
        'Instagram Shopping catalog setup and optimization',
        'Influencer collaboration campaigns (8 partnerships)',
        'Community management and engagement strategy',
        'Monthly performance reports and optimization',
      ],
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Instagram grid preview' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Story highlights' },
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Instagram Reels compilation', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Influencer content' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Behind the scenes' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Guest testimonials' },
    ],

    results: [
      { metric: 'followers', value: '250%', label: 'Follower Growth', icon: '/icons/community.svg' },
      { metric: 'bookings', value: '45%', label: 'Booking Increase', icon: '/icons/growth.svg' },
      { metric: 'engagement', value: '12%', label: 'Engagement Rate', icon: '/icons/analytics.svg' },
      { metric: 'revenue', value: '$2.4M', label: 'Attributed Revenue', icon: '/icons/revenue.svg' },
    ],

    testimonial: {
      quote: 'Our Instagram transformed into a vibrant community of travelers who genuinely connect with our brand. The booking impact was immediate and sustained. Best marketing investment we\'ve made.',
      author: 'Marcus Rivera',
      role: 'Chief Marketing Officer',
      company: 'Luxe Hotels Group',
    },

    relatedProjects: ['startupxyz-launch', 'regional-auto'],
  },

  // ========================================
  // DIGITAL CAMPAIGNS #2: StartupXYZ Launch
  // ========================================
  'startupxyz-launch': {
    id: 'startupxyz-launch',
    category: 'digital-campaigns',
    clientName: 'StartupXYZ',
    projectTitle: 'Product Launch Campaign',
    year: '2024',
    accentColor: '#00b8ff', // Blue

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'StartupXYZ product launch',
    },

    hero: {
      coverImage: '/images/works/hero/startupxyz-hero.jpg',
      tagline: 'From Zero to 12K Signups in 30 Days',
      description: 'A comprehensive product launch campaign combining thought leadership, LinkedIn ads, and webinars that secured $5M in funding and 12,000 early adopters.',
      stats: [
        { value: '$5M', label: 'Funding Secured' },
        { value: '12K', label: 'Signups in 30 Days' },
        { value: '8x', label: 'ROI on Ad Spend' },
      ],
    },

    overview: {
      challenge: 'StartupXYZ, a B2B SaaS startup, needed to generate qualified leads and build credibility for their Series A fundraising. Their LinkedIn engagement was below 1%, and content wasn\'t resonating with IT decision-makers.',
      solution: 'We developed a thought leadership strategy featuring executive interviews, industry insights, and customer success stories. Implemented LinkedIn Ads with precision targeting for IT directors and CTOs, plus weekly educational webinars.',
      approach: [
        'LinkedIn optimization for all executive profiles',
        'Content strategy focused on pain points of IT decision-makers',
        'Webinar series with industry experts and early customers',
        'Account-based marketing for target companies',
      ],
      deliverables: [
        'LinkedIn advertising campaign (3-month duration)',
        'Thought leadership content series (24 articles, 12 videos)',
        'Webinar series production and promotion (6 events)',
        'Email nurture sequences for leads',
        'Sales enablement materials and pitch decks',
        'Real-time performance dashboard and weekly optimization',
      ],
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'LinkedIn ad creative' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Webinar promotion' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Thought leadership posts' },
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Product demo video', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Email campaigns' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Analytics dashboard' },
    ],

    results: [
      { metric: 'signups', value: '12,000', label: 'Signups in 30 Days', icon: '/icons/growth.svg' },
      { metric: 'funding', value: '$5M', label: 'Series A Funding', icon: '/icons/revenue.svg' },
      { metric: 'roi', value: '8x', label: 'ROI on Ad Spend', icon: '/icons/analytics.svg' },
      { metric: 'engagement', value: '340%', label: 'Engagement Increase', icon: '/icons/community.svg' },
    ],

    testimonial: {
      quote: 'The team transformed our LinkedIn from a static profile into our #1 lead generation channel. The strategic approach and data-driven optimization delivered results beyond our expectations and helped us close our Series A.',
      author: 'David Park',
      role: 'Co-Founder & CEO',
      company: 'StartupXYZ',
    },

    relatedProjects: ['techflow-rebrand', 'luxe-hotels-campaign'],
  },

  // ========================================
  // DIGITAL CAMPAIGNS #3: Regional Auto
  // ========================================
  'regional-auto': {
    id: 'regional-auto',
    category: 'digital-campaigns',
    clientName: 'Regional Auto Group',
    projectTitle: 'Multi-Channel Dealership Campaign',
    year: '2024',
    accentColor: '#00ffff', // Cyan

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Regional Auto Group campaign',
    },

    hero: {
      coverImage: '/images/works/hero/regional-auto-hero.jpg',
      tagline: 'Driving Showroom Traffic Across 8 Dealerships',
      description: 'A multi-channel media strategy combining local TV, radio, digital retargeting, and geo-fencing that generated 60% more showroom traffic and $2.8M in attributed revenue.',
      stats: [
        { value: '60%', label: 'Traffic Increase' },
        { value: '320', label: 'Vehicles Sold' },
        { value: '$2.8M', label: 'Revenue Impact' },
      ],
    },

    overview: {
      challenge: 'Regional Auto Group needed to drive showroom traffic across 8 dealerships in 3 markets, but their TV and radio campaigns weren\'t trackable or optimized. They had no attribution and couldn\'t prove ROI to the CFO.',
      solution: 'Created a multi-channel strategy combining local TV during prime automotive shopping times, targeted radio during commute hours, digital retargeting for website visitors, and geo-fenced mobile ads near competitor dealerships.',
      approach: [
        'Call tracking implementation for attribution',
        'TV and radio spot production with unique URLs',
        'Geo-fencing around competitor dealerships and auto shows',
        'Retargeting campaigns for website visitors by vehicle interest',
      ],
      deliverables: [
        'Local TV commercial production (3 spots)',
        'Radio ad campaign (15-second and 30-second spots)',
        'Digital retargeting campaign setup',
        'Geo-fence mobile advertising strategy',
        'Call tracking system implementation',
        'Multi-touch attribution dashboard',
      ],
    },

    gallery: [
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'TV commercial', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Radio campaign assets' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Digital ad creative' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Geo-fence map' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Attribution dashboard' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Showroom traffic data' },
    ],

    results: [
      { metric: 'traffic', value: '60%', label: 'Showroom Traffic Increase', icon: '/icons/growth.svg' },
      { metric: 'vehicles', value: '320', label: 'Vehicles Sold (Attributed)', icon: '/icons/award.svg' },
      { metric: 'revenue', value: '$2.8M', label: 'Revenue Impact', icon: '/icons/revenue.svg' },
      { metric: 'roi', value: '5.2x', label: 'Return on Ad Spend', icon: '/icons/analytics.svg' },
    ],

    testimonial: {
      quote: 'They transformed our scattershot approach into a precision instrument. We know exactly which ads drive sales and can prove ROI to our CFO. Game-changing work.',
      author: 'Jennifer Collins',
      role: 'Marketing Director',
      company: 'Regional Auto Group',
    },

    relatedProjects: ['startupxyz-launch', 'cascade-festival'],
  },

  // ========================================
  // VIDEO PRODUCTION #1: Cascade Music Festival
  // ========================================
  'cascade-festival': {
    id: 'cascade-festival',
    category: 'video-production',
    clientName: 'Cascade Music Festival',
    projectTitle: 'Festival Recap Film',
    year: '2024',
    accentColor: '#00e92c', // Green

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Cascade Music Festival film',
    },

    hero: {
      coverImage: '/images/works/hero/cascade-hero.jpg',
      tagline: 'Capturing the Energy of 8,000 Music Lovers',
      description: 'A cinematic festival recap film that became a viral sensation, earning a Vimeo Staff Pick and selling out the following year\'s event in record time.',
      stats: [
        { value: '500K+', label: 'Organic Views' },
        { value: '🏆', label: 'Vimeo Staff Pick' },
        { value: '8K', label: 'Tickets Sold' },
      ],
    },

    overview: {
      challenge: 'Cascade Music Festival needed to create buzz for their inaugural event and attract both attendees and sponsors without an established brand presence. They had no video content to showcase the festival experience.',
      solution: 'We produced a 5-minute cinematic recap film featuring aerial drone footage, intimate artist performances, crowd reactions, and the cultural vibe of the event. Combined with a psychedelic-inspired original score and dynamic editing.',
      approach: [
        'Multi-camera setup (5 cameras, 2 drone operators)',
        'Real-time event coverage over 3 days',
        'Artist interviews and behind-the-scenes access',
        'Custom music composition matching festival\'s artistic vision',
      ],
      deliverables: [
        '5-minute festival recap film (4K)',
        'Social media cut-downs (15s, 30s, 60s)',
        'Artist highlight videos (10 individual videos)',
        'Sponsor recognition segments',
        'Custom original score and sound design',
        'Raw footage archive for future use',
      ],
    },

    gallery: [
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Festival recap film', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Aerial drone shots' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Artist performances' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Crowd energy' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Behind the scenes' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Festival atmosphere' },
    ],

    results: [
      { metric: 'views', value: '500K+', label: 'Organic Views', icon: '/icons/analytics.svg' },
      { metric: 'award', value: '🏆', label: 'Vimeo Staff Pick', icon: '/icons/award.svg' },
      { metric: 'tickets', value: '8,000', label: 'Tickets Sold (Year 1)', icon: '/icons/community.svg' },
      { metric: 'sponsors', value: '15', label: 'Major Sponsors', icon: '/icons/revenue.svg' },
    ],

    testimonial: {
      quote: 'This film captures the soul of our festival better than anything we could have imagined. It\'s not just marketing—it\'s art that happens to sell tickets and attract sponsors.',
      author: 'Alex Thompson',
      role: 'Festival Director',
      company: 'Cascade Music Festival',
    },

    relatedProjects: ['ecotech-series', 'organics-packaging'],
  },

  // ========================================
  // VIDEO PRODUCTION #2: EcoTech Educational Series
  // ========================================
  'ecotech-series': {
    id: 'ecotech-series',
    category: 'video-production',
    clientName: 'EcoTech Solutions',
    projectTitle: 'Solar Education Video Series',
    year: '2024',
    accentColor: '#00d4aa', // Teal

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'EcoTech educational videos',
    },

    hero: {
      coverImage: '/images/works/hero/ecotech-hero.jpg',
      tagline: 'Simplifying Solar Technology for Homeowners',
      description: 'A 5-video educational series that demystified solar technology, resulting in a 180% increase in conversion rates and making complex tech accessible.',
      stats: [
        { value: '180%', label: 'Conversion Increase' },
        { value: '5', label: 'Video Series' },
        { value: '45 sec', label: 'Avg Watch Time' },
      ],
    },

    overview: {
      challenge: 'EcoTech needed to explain their complex solar technology to residential customers who found technical jargon overwhelming and intimidating. Their sales team spent hours educating prospects before closing deals.',
      solution: 'Produced a series of 5 educational videos (60-90 seconds each) using motion graphics, simple analogies, and real customer installations. Each video focused on one concern: cost, installation, maintenance, savings, and environmental impact.',
      approach: [
        'Customer research to identify top 5 objections',
        'Script development with sales team input',
        'Motion graphics and animation for technical explanations',
        'Real customer testimonials and installation footage',
      ],
      deliverables: [
        '5 educational videos (60-90 seconds each)',
        'Motion graphics and animated explainers',
        'Customer installation footage',
        'Closed captions and transcripts for accessibility',
        'Social media versions (square, vertical formats)',
        'Email campaign integration',
      ],
    },

    gallery: [
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Video 1: Cost breakdown', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Video 2: Installation process', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Motion graphics stills' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Customer testimonials' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Installation footage' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Animated diagrams' },
    ],

    results: [
      { metric: 'conversion', value: '180%', label: 'Conversion Rate Increase', icon: '/icons/growth.svg' },
      { metric: 'videos', value: '5', label: 'Complete Video Series', icon: '/icons/camera.svg' },
      { metric: 'watch-time', value: '45 sec', label: 'Avg Watch Time', icon: '/icons/analytics.svg' },
      { metric: 'sales-cycle', value: '-40%', label: 'Shorter Sales Cycle', icon: '/icons/revenue.svg' },
    ],

    testimonial: {
      quote: 'These videos turned our most complex selling point into our biggest advantage. Prospects now arrive at sales calls already educated and ready to buy. Absolutely transformative.',
      author: 'Jennifer Moore',
      role: 'VP of Sales',
      company: 'EcoTech Solutions',
    },

    relatedProjects: ['cascade-festival', 'luxe-hotels-campaign'],
  },

  // ========================================
  // BRAND IDENTITY #3: Nexus Digital Rebrand
  // ========================================
  'nexus-digital-rebrand': {
    id: 'nexus-digital-rebrand',
    category: 'brand-identity',
    clientName: 'Nexus Digital',
    projectTitle: 'Tech Startup Identity Overhaul',
    year: '2023',
    accentColor: '#00b8ff', // Blue

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Nexus Digital brand identity showcase',
    },

    hero: {
      coverImage: '/images/works/hero/nexus-hero.jpg',
      tagline: 'Building Trust Through Modern Design',
      description: 'A comprehensive brand transformation for a rising tech startup, establishing credibility and differentiation in a competitive SaaS marketplace.',
      stats: [
        { value: '85%', label: 'Market Recognition' },
        { value: '40+', label: 'Brand Assets' },
        { value: '2 Months', label: 'Timeline' },
      ],
    },

    overview: {
      challenge: 'Nexus Digital struggled with a generic identity that failed to communicate their innovative solutions. Their brand felt unpolished and didn\'t inspire confidence with enterprise clients. Inconsistent visual assets made them appear fragmented.',
      solution: 'We developed a cohesive brand system featuring bold typography, a modern color palette, and geometric patterns representing digital connectivity. Created comprehensive guidelines ensuring consistency across all touchpoints.',
      approach: [
        'Stakeholder workshops to define brand values and positioning',
        'Competitive analysis of 15+ tech startups to identify opportunities',
        'Multiple design directions exploring different visual approaches',
        'Comprehensive brand guidelines with implementation examples',
      ],
      deliverables: [
        'Complete brand identity (logo suite, color system, typography)',
        '60-page brand guidelines documentation',
        'Marketing templates (pitch decks, one-pagers, email signatures)',
        'Digital assets (social media templates, web UI components)',
        'Print collateral (business cards, letterheads, folders)',
      ],
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Logo variations' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Color palette' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Typography system' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Business cards' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Digital templates' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Brand applications' },
    ],

    results: [
      { metric: 'recognition', value: '85%', label: 'Market Recognition', icon: '/icons/brand.svg' },
      { metric: 'assets', value: '40+', label: 'Brand Assets', icon: '/icons/package.svg' },
      { metric: 'trust', value: '70%', label: 'Trust Score Increase', icon: '/icons/growth.svg' },
      { metric: 'consistency', value: '95%', label: 'Brand Consistency', icon: '/icons/analytics.svg' },
    ],

    testimonial: {
      quote: 'The rebrand gave us the professional edge we needed to compete with established players. Our sales team finally has confidence presenting to enterprise clients.',
      author: 'Michael Chen',
      role: 'CEO & Founder',
      company: 'Nexus Digital',
    },

    relatedProjects: ['techflow-rebrand', 'startupxyz-launch'],
  },

  // ========================================
  // BRAND IDENTITY #4: Summit Wellness
  // ========================================
  'summit-wellness': {
    id: 'summit-wellness',
    category: 'brand-identity',
    clientName: 'Summit Wellness Co.',
    projectTitle: 'Holistic Health Brand System',
    year: '2023',
    accentColor: '#00e92c', // Green

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Summit Wellness brand identity',
    },

    hero: {
      coverImage: '/images/works/hero/summit-hero.jpg',
      tagline: 'Bringing Calm to Healthcare Branding',
      description: 'A soothing, nature-inspired brand identity for a holistic wellness center, creating a sense of tranquility and trust for health-conscious clients.',
      stats: [
        { value: '3x', label: 'Client Inquiries' },
        { value: '35+', label: 'Brand Elements' },
        { value: '90%', label: 'Client Satisfaction' },
      ],
    },

    overview: {
      challenge: 'Summit Wellness needed to differentiate from clinical healthcare brands and convey their holistic, natural approach. Their existing identity felt cold and impersonal, contradicting their warm, personalized service philosophy.',
      solution: 'Created a calming brand system using earth tones, organic shapes, and nature-inspired imagery. Developed a visual language emphasizing balance, growth, and natural healing through mindful design choices.',
      approach: [
        'Brand discovery sessions with founders and practitioners',
        'Client persona development and journey mapping',
        'Visual direction exploration balancing professionalism and warmth',
        'Comprehensive touchpoint design across physical and digital spaces',
      ],
      deliverables: [
        'Brand identity system (logo, color palette, typography)',
        'Nature-inspired visual elements and patterns',
        'Interior signage and wayfinding system',
        'Website design and digital marketing templates',
        'Print materials (brochures, appointment cards, packaging)',
        '50-page brand guidelines',
      ],
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Logo design' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Color and typography' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Nature patterns' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Interior signage' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Print collateral' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Digital applications' },
    ],

    results: [
      { metric: 'inquiries', value: '3x', label: 'Client Inquiries', icon: '/icons/growth.svg' },
      { metric: 'assets', value: '35+', label: 'Brand Elements', icon: '/icons/package.svg' },
      { metric: 'satisfaction', value: '90%', label: 'Client Satisfaction', icon: '/icons/analytics.svg' },
      { metric: 'retention', value: '85%', label: 'Client Retention', icon: '/icons/community.svg' },
    ],

    testimonial: {
      quote: 'Our new brand perfectly captures our philosophy of holistic wellness. Clients immediately feel the warmth and care we provide, even before stepping into our center.',
      author: 'Dr. Sarah Williams',
      role: 'Founder & Wellness Director',
      company: 'Summit Wellness Co.',
    },

    relatedProjects: ['organics-packaging', 'ecotech-series'],
  },

  // ========================================
  // DIGITAL CAMPAIGNS #4: Metro Transit Campaign
  // ========================================
  'metro-transit-campaign': {
    id: 'metro-transit-campaign',
    category: 'digital-campaigns',
    clientName: 'Metro Transit Authority',
    projectTitle: 'Ridership Recovery Social Push',
    year: '2024',
    accentColor: '#00ffff', // Cyan

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Metro Transit social campaign',
    },

    hero: {
      coverImage: '/images/works/hero/metro-hero.jpg',
      tagline: 'Getting People Moving Again',
      description: 'A multi-channel social media campaign that revitalized public transit ridership post-pandemic, achieving 35% growth in monthly passes and restoring community trust.',
      stats: [
        { value: '35%', label: 'Ridership Growth' },
        { value: '150K+', label: 'Social Reach' },
        { value: '18%', label: 'Engagement Rate' },
      ],
    },

    overview: {
      challenge: 'Metro Transit faced declining ridership post-pandemic, with public perception focused on safety concerns and convenience issues. Social media engagement was minimal, and messaging felt bureaucratic and impersonal.',
      solution: 'Launched a human-centered campaign featuring real riders, staff stories, and community benefits. Created engaging video content, interactive polls, and user-generated content initiatives highlighting the diverse Metro community.',
      approach: [
        'Community listening sessions and rider surveys',
        'Content strategy focusing on safety, convenience, and community',
        'Influencer partnerships with local content creators',
        'Monthly themed campaigns (e.g., "Meet Your Neighbors," "Hidden Gems")',
      ],
      deliverables: [
        'Social media campaign across Instagram, Facebook, TikTok (3-month duration)',
        '80+ original content pieces (photos, videos, stories)',
        'Influencer collaboration program (12 local creators)',
        'User-generated content campaign with branded hashtag',
        'Community event sponsorships and activations',
        'Performance analytics dashboard and monthly reports',
      ],
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Social content grid' },
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Campaign video', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Rider stories' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Community events' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Influencer content' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'User-generated posts' },
    ],

    results: [
      { metric: 'ridership', value: '35%', label: 'Ridership Growth', icon: '/icons/growth.svg' },
      { metric: 'reach', value: '150K+', label: 'Social Media Reach', icon: '/icons/community.svg' },
      { metric: 'engagement', value: '18%', label: 'Engagement Rate', icon: '/icons/analytics.svg' },
      { metric: 'passes', value: '12K', label: 'New Monthly Passes', icon: '/icons/award.svg' },
    ],

    testimonial: {
      quote: 'This campaign transformed how our community sees public transit. We\'re not just a transportation service—we\'re a vital part of the urban fabric connecting people and neighborhoods.',
      author: 'James Rodriguez',
      role: 'Director of Marketing',
      company: 'Metro Transit Authority',
    },

    relatedProjects: ['regional-auto', 'luxe-hotels-campaign'],
  },

  // ========================================
  // DIGITAL CAMPAIGNS #5: Artisan Coffee Ads
  // ========================================
  'artisan-coffee-ads': {
    id: 'artisan-coffee-ads',
    category: 'digital-campaigns',
    clientName: 'Artisan Coffee Co.',
    projectTitle: 'Instagram Storytelling Campaign',
    year: '2023',
    accentColor: '#00d4aa', // Teal

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Artisan Coffee Instagram campaign',
    },

    hero: {
      coverImage: '/images/works/hero/artisan-hero.jpg',
      tagline: 'Brewing Community One Post at a Time',
      description: 'An authentic Instagram strategy that transformed a local coffee shop into a vibrant community hub, growing followers by 400% and increasing foot traffic by 55%.',
      stats: [
        { value: '400%', label: 'Follower Growth' },
        { value: '55%', label: 'Foot Traffic Increase' },
        { value: '22%', label: 'Engagement Rate' },
      ],
    },

    overview: {
      challenge: 'Artisan Coffee struggled to stand out among major coffee chains and other local cafes. Their Instagram presence was sporadic and lacked visual cohesion. They needed to build community loyalty beyond just selling coffee.',
      solution: 'Developed a content strategy celebrating coffee craftsmanship, local partnerships, and customer stories. Focused on behind-the-scenes content, barista spotlights, and showcasing the cozy atmosphere that makes the cafe special.',
      approach: [
        'Visual style guide ensuring cohesive feed aesthetic',
        'Content pillars: craft, community, culture, coffee education',
        'Instagram Stories series featuring regulars and baristas',
        'User-generated content reposts with customer feature program',
      ],
      deliverables: [
        'Instagram content strategy and 6-month calendar',
        '100+ high-quality posts (photos, Reels, Stories)',
        'Barista training on content creation and storytelling',
        'Community engagement playbook and response templates',
        'Local business collaboration campaign',
        'Monthly analytics reports with optimization recommendations',
      ],
    },

    gallery: [
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Instagram grid' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Barista spotlights' },
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Reels compilation', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Customer features' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Coffee education' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Community events' },
    ],

    results: [
      { metric: 'followers', value: '400%', label: 'Follower Growth', icon: '/icons/community.svg' },
      { metric: 'traffic', value: '55%', label: 'Foot Traffic Increase', icon: '/icons/growth.svg' },
      { metric: 'engagement', value: '22%', label: 'Engagement Rate', icon: '/icons/analytics.svg' },
      { metric: 'sales', value: '$85K', label: 'Attributed Revenue', icon: '/icons/revenue.svg' },
    ],

    testimonial: {
      quote: 'Our Instagram became our most powerful marketing tool. Customers now visit specifically to be part of our community, not just for the coffee. The campaign exceeded every expectation.',
      author: 'Emma Davis',
      role: 'Owner & Head Roaster',
      company: 'Artisan Coffee Co.',
    },

    relatedProjects: ['luxe-hotels-campaign', 'startupxyz-launch'],
  },

  // ========================================
  // VIDEO PRODUCTION #3: Horizon Documentary
  // ========================================
  'horizon-documentary': {
    id: 'horizon-documentary',
    category: 'video-production',
    clientName: 'Horizon Documentary Films',
    projectTitle: 'Environmental Impact Mini-Series',
    year: '2024',
    accentColor: '#00e92c', // Green

    thumbnail: {
      image: '/images/works/thumbnails/techflow.jpg',
      alt: 'Horizon Documentary series',
    },

    hero: {
      coverImage: '/images/works/hero/horizon-hero.jpg',
      tagline: 'Stories That Inspire Change',
      description: 'A 4-part documentary mini-series exploring grassroots environmental initiatives, garnering 800K+ views and inspiring 50+ new community projects across the region.',
      stats: [
        { value: '800K+', label: 'Total Views' },
        { value: '4', label: 'Episode Series' },
        { value: '50+', label: 'Community Projects' },
      ],
    },

    overview: {
      challenge: 'Horizon Documentary Films needed to create engaging environmental content that avoided preachiness while inspiring action. Environmental documentaries often feel overwhelming or disconnected from individual impact.',
      solution: 'Produced a 4-episode series profiling everyday people making extraordinary impact through small, replicable initiatives. Combined cinematic storytelling with practical how-to segments, making environmental action feel accessible.',
      approach: [
        'Community outreach identifying inspiring local changemakers',
        'Cinematic interview and b-roll production (12 days filming)',
        'Narrative structure balancing emotion with practical takeaways',
        'Strategic distribution across YouTube, social media, and local screenings',
      ],
      deliverables: [
        '4-episode documentary series (20-25 minutes each)',
        'Extended interviews and bonus content',
        'Social media promotional campaign',
        'Community screening events and discussion guides',
        'Behind-the-scenes mini-documentaries',
        'Educational resources for schools and organizations',
      ],
    },

    gallery: [
      { type: 'video', src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', alt: 'Series trailer', thumbnail: '/images/works/thumbnails/techflow.jpg' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Cinematography stills' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Interview moments' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Community impact' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Screening events' },
      { type: 'image', src: '/images/works/thumbnails/techflow.jpg', alt: 'Behind the scenes' },
    ],

    results: [
      { metric: 'views', value: '800K+', label: 'Total Views', icon: '/icons/analytics.svg' },
      { metric: 'episodes', value: '4', label: 'Episode Series', icon: '/icons/camera.svg' },
      { metric: 'projects', value: '50+', label: 'Community Projects Launched', icon: '/icons/growth.svg' },
      { metric: 'awards', value: '🏆', label: 'Film Festival Recognition', icon: '/icons/award.svg' },
    ],

    testimonial: {
      quote: 'This series did exactly what we hoped—it inspired action without overwhelming viewers. People saw themselves in these stories and realized they could make a difference too.',
      author: 'Rachel Martinez',
      role: 'Executive Producer',
      company: 'Horizon Documentary Films',
    },

    relatedProjects: ['cascade-festival', 'ecotech-series'],
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
  };
  return labels[category];
}

export function getCategoryColor(category: WorkCategory): string {
  const colors: Record<WorkCategory, string> = {
    'brand-identity': '#00ffff', // Cyan
    'digital-campaigns': '#00d4aa', // Teal
    'video-production': '#00e92c', // Green
  };
  return colors[category];
}
