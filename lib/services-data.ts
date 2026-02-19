export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  ctaText: string;
  ctaLink: string;
}

export const servicesData: Service[] = [
  {
    id: 'advertising',
    title: 'Advertising & Social Media',
    description:
      'Strategic campaigns that amplify your brand across digital platforms with data-driven precision and creative excellence.',
    icon: '/icons/service-advertising.svg',
    accentColor: '#00ffff',
    ctaText: 'Learn More',
    ctaLink: '/services/advertising',
  },
  {
    id: 'video',
    title: 'Video Production & Music',
    description:
      'Cinematic storytelling combined with custom soundscapes to create unforgettable brand experiences that resonate.',
    icon: '/icons/service-video.svg',
    accentColor: '#00e92c',
    ctaText: 'Learn More',
    ctaLink: '/services/video',
  },
  {
    id: 'design',
    title: 'Print & Graphic Design',
    description:
      'Timeless visual identities that bridge digital and physical touchpoints with creative excellence and attention to detail.',
    icon: '/icons/service-design.svg',
    accentColor: '#00d4aa',
    ctaText: 'Learn More',
    ctaLink: '/services/design',
  },
  {
    id: 'strategy',
    title: 'Strategic Media Services',
    description:
      'Comprehensive media planning and buying that maximizes ROI through intelligent channel optimization and market insights.',
    icon: '/icons/service-strategy.svg',
    accentColor: '#00b8ff',
    ctaText: 'Learn More',
    ctaLink: '/services/strategy',
  },
];
