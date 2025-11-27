export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  features: string[];
  testimonial: {
    quote: string;
    author: string;
    company: string;
  };
  clientLogos: string[];
  icon: string;
  iconType: 'svg';
  accentColor: string;
  ctaText: string;
  ctaLink: string;
  gridSize: 'medium' | 'wide' | 'tall';
}

export const servicesData: Service[] = [
  {
    id: 'advertising',
    number: '01',
    title: 'Advertising & Social Media',
    description:
      'Strategic campaigns that amplify your brand across digital platforms with data-driven precision and creative excellence.',
    features: [
      'Social Media Strategy & Management',
      'Paid Advertising Campaigns (Google, Meta)',
      'Content Creation & Copywriting',
      'Analytics & Performance Reporting',
    ],
    testimonial: {
      quote:
        'Their social media strategy increased our engagement by 340% in just 3 months. The ROI has been incredible.',
      author: 'Sarah Chen',
      company: 'TechFlow Inc.',
    },
    clientLogos: [
      '/images/clients/client-1.svg',
      '/images/clients/client-2.svg',
      '/images/clients/client-3.svg',
      '/images/clients/client-4.svg',
    ],
    icon: '/icons/service-advertising.svg',
    iconType: 'svg',
    accentColor: '#00ffff', // Cyan
    ctaText: 'Explore Services',
    ctaLink: '/services/advertising',
    gridSize: 'medium',
  },
  {
    id: 'video',
    number: '02',
    title: 'Video Production & Music',
    description:
      'Cinematic storytelling combined with custom soundscapes to create unforgettable brand experiences that resonate.',
    features: [
      'Commercial Video Production',
      'Brand Storytelling & Narratives',
      'Custom Music Composition',
      'Audio Post-Production & Sound Design',
    ],
    testimonial: {
      quote:
        'The brand video they produced captured our vision perfectly. The custom soundtrack made it truly unforgettable.',
      author: 'Marcus Rivera',
      company: 'Luxe Hotels Group',
    },
    clientLogos: [
      '/images/clients/client-5.svg',
      '/images/clients/client-6.svg',
      '/images/clients/client-7.svg',
      '/images/clients/client-8.svg',
    ],
    icon: '/icons/service-video.svg',
    iconType: 'svg',
    accentColor: '#00e92c', // Green
    ctaText: 'View Portfolio',
    ctaLink: '/services/video',
    gridSize: 'wide',
  },
  {
    id: 'design',
    number: '03',
    title: 'Print & Graphic Design',
    description:
      'Timeless visual identities that bridge digital and physical touchpoints with creative excellence and attention to detail.',
    features: [
      'Brand Identity & Logo Design',
      'Print Collateral (Brochures, Posters)',
      'Packaging Design',
      'Digital Graphics & UI Elements',
    ],
    testimonial: {
      quote:
        'Our new brand identity has elevated our entire business. The packaging design alone increased shelf appeal by 65%.',
      author: 'Elena Vasquez',
      company: 'Organics Co.',
    },
    clientLogos: [
      '/images/clients/client-9.svg',
      '/images/clients/client-10.svg',
      '/images/clients/client-11.svg',
      '/images/clients/client-12.svg',
    ],
    icon: '/icons/service-design.svg',
    iconType: 'svg',
    accentColor: '#00d4aa', // Teal
    ctaText: 'See Our Work',
    ctaLink: '/services/design',
    gridSize: 'medium',
  },
  {
    id: 'strategy',
    number: '04',
    title: 'Strategic Media Services',
    description:
      'Comprehensive media planning and buying that maximizes ROI through intelligent channel optimization and market insights.',
    features: [
      'Media Planning & Buying',
      'Market Research & Audience Insights',
      'Campaign Optimization & A/B Testing',
      'Performance Analytics & Reporting',
    ],
    testimonial: {
      quote:
        'Their data-driven approach to media buying reduced our acquisition costs by 45% while doubling our reach.',
      author: 'David Park',
      company: 'StartupXYZ',
    },
    clientLogos: [
      '/images/clients/client-13.svg',
      '/images/clients/client-14.svg',
      '/images/clients/client-15.svg',
      '/images/clients/client-16.svg',
    ],
    icon: '/icons/service-strategy.svg',
    iconType: 'svg',
    accentColor: '#00b8ff', // Blue
    ctaText: 'Get Started',
    ctaLink: '/services/strategy',
    gridSize: 'tall',
  },
];
