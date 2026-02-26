/**
 * Service Detail Pages - Complete Content Data
 *
 * This file contains detailed content for all 4 service pages:
 * - Advertising & Social Media
 * - Video Production
 * - Print & Graphic Design
 * - Strategic Media Services
 */

import type { LucideIcon } from 'lucide-react';
import {
  TrendingUp, Target, PenLine, Users, BarChart2, Star, SplitSquareHorizontal, ShieldAlert,
  Film, BookOpen, Volume2, Sparkles, Navigation, Radio, Share2,
  Fingerprint, Printer, Package, Monitor, Megaphone, PieChart, BookMarked, Building2,
  Calendar, Search, SlidersHorizontal, Activity, Network, Cpu, GitBranch, Calculator,
} from 'lucide-react';

export interface ServiceDetail {
  id: string;
  number: string;
  title: string;
  accentColor: string;

  hero: {
    tagline: string;
    description: string;
    stats: Array<{
      label: string;
      value: string;
    }>;
  };

  overview: {
    heading: string;
    paragraphs: string[];
    benefits: string[];
  };

  features: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;

  caseStudies: Array<{
    clientName: string;
    clientLogo: string;
    industry: string;
    challenge: string;
    solution: string;
    results: Array<{
      metric: string;
      value: string;
      label: string;
    }>;
    testimonial: {
      quote: string;
      author: string;
      role: string;
    };
  }>;

  faqs: Array<{
    question: string;
    answer: string;
  }>;

  cta: {
    heading: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export const serviceDetailsData: Record<string, ServiceDetail> = {
  // ========================================
  // SERVICE 1: ADVERTISING & SOCIAL MEDIA
  // ========================================
  advertising: {
    id: 'advertising',
    number: '01',
    title: 'Advertising & Social Media',
    accentColor: '#00ffff', // Cyan

    hero: {
      tagline: 'Amplify Your Brand Across Digital Platforms',
      description: 'Strategic campaigns that drive engagement, build communities, and deliver measurable ROI through data-driven precision and creative excellence.',
      stats: [
        { value: '340%', label: 'Avg Engagement Growth' },
        { value: '50+', label: 'Active Clients' },
        { value: '98%', label: 'ROI Achievement' },
      ],
    },

    overview: {
      heading: 'Transforming Social Presence into Business Growth',
      paragraphs: [
        'In today\'s digital-first world, your social media presence is your most powerful asset. We don\'t just post content—we build strategic narratives that resonate with your audience, spark conversations, and drive measurable business results.',
        'Our data-driven approach combines creative storytelling with advanced analytics to ensure every campaign delivers maximum impact. From Instagram and TikTok to LinkedIn and emerging platforms, we meet your audience where they are.',
        'Whether you\'re launching a new product, building brand awareness, or driving conversions, our team of strategists, creators, and analysts work together to amplify your message and achieve your goals.',
      ],
      benefits: [
        'Multi-platform strategy tailored to your audience demographics',
        'Real-time campaign optimization based on performance data',
        '24/7 community management and engagement',
        'Crisis communication and reputation management',
        'Comprehensive monthly reporting with actionable insights',
        'Integration with your existing marketing stack',
      ],
    },

    features: [
      {
        icon: TrendingUp,
        title: 'Social Media Strategy',
        description: 'Comprehensive platform analysis, audience research, content calendars, and growth roadmaps tailored to your business objectives.',
      },
      {
        icon: Target,
        title: 'Paid Advertising Campaigns',
        description: 'Expert management of Google Ads, Meta (Facebook/Instagram), LinkedIn, TikTok, and Twitter campaigns with advanced targeting.',
      },
      {
        icon: PenLine,
        title: 'Content Creation & Copywriting',
        description: 'High-quality visual content, engaging copy, video scripts, and storytelling that captures attention and drives action.',
      },
      {
        icon: Users,
        title: 'Community Management',
        description: 'Proactive engagement, comment moderation, DM responses, and building loyal brand communities that advocate for you.',
      },
      {
        icon: BarChart2,
        title: 'Analytics & Reporting',
        description: 'In-depth performance tracking, ROI analysis, competitor benchmarking, and monthly strategy sessions with your team.',
      },
      {
        icon: Star,
        title: 'Influencer Partnerships',
        description: 'Strategic collaborations with micro and macro influencers, contract negotiation, and campaign performance tracking.',
      },
      {
        icon: SplitSquareHorizontal,
        title: 'A/B Testing & Optimization',
        description: 'Continuous experimentation with ad creative, messaging, targeting, and timing to maximize campaign effectiveness.',
      },
      {
        icon: ShieldAlert,
        title: 'Crisis Management',
        description: '24/7 monitoring, rapid response protocols, and reputation protection strategies to safeguard your brand during challenges.',
      },
    ],

    caseStudies: [
      {
        clientName: 'TechFlow Inc.',
        clientLogo: '/images/clients/techflow-logo.svg',
        industry: 'SaaS Technology',
        challenge: 'TechFlow, a B2B SaaS startup, struggled to generate qualified leads through their LinkedIn presence. Their engagement rate was below 1%, and content wasn\'t resonating with decision-makers.',
        solution: 'We developed a thought leadership strategy featuring executive interviews, industry insights, and customer success stories. Implemented LinkedIn Ads with precision targeting for IT directors and CTOs, plus weekly educational webinars.',
        results: [
          { metric: 'engagement', value: '340%', label: 'Engagement Increase' },
          { metric: 'qualified-leads', value: '150', label: 'Qualified Leads/Month' },
          { metric: 'roi', value: '8x', label: 'ROI on Ad Spend' },
        ],
        testimonial: {
          quote: 'The team transformed our LinkedIn from a static profile into our #1 lead generation channel. The strategic approach and data-driven optimization delivered results beyond our expectations.',
          author: 'Sarah Chen',
          role: 'VP of Marketing, TechFlow Inc.',
        },
      },
      {
        clientName: 'Luxe Hotels Group',
        clientLogo: '/images/clients/luxe-logo.svg',
        industry: 'Hospitality',
        challenge: 'Luxe Hotels wanted to attract younger travelers (25-40) to their boutique properties but their Instagram presence felt outdated and wasn\'t driving bookings.',
        solution: 'Created a visual storytelling strategy showcasing unique experiences, local culture, and behind-the-scenes content. Launched Instagram Stories and Reels series featuring guest testimonials and staff recommendations. Implemented Instagram Shopping for direct booking links.',
        results: [
          { metric: 'follower-growth', value: '250%', label: 'Follower Growth' },
          { metric: 'bookings', value: '45%', label: 'Booking Increase' },
          { metric: 'engagement-rate', value: '12%', label: 'Engagement Rate' },
        ],
        testimonial: {
          quote: 'Our Instagram transformed into a vibrant community of travelers who genuinely connect with our brand. The booking impact was immediate and sustained.',
          author: 'Marcus Rivera',
          role: 'Chief Marketing Officer, Luxe Hotels Group',
        },
      },
      {
        clientName: 'Organics Co.',
        clientLogo: '/images/clients/organics-logo.svg',
        industry: 'E-commerce (Health & Wellness)',
        challenge: 'Organics Co. faced fierce competition in the organic supplements market. Their social ads weren\'t profitable, with a high cost per acquisition and low conversion rates.',
        solution: 'Developed a content strategy focused on education rather than hard selling. Created carousel ads showcasing product benefits with scientific backing, UGC content from real customers, and retargeting campaigns with limited-time offers.',
        results: [
          { metric: 'cpa-reduction', value: '65%', label: 'Lower CPA' },
          { metric: 'roas', value: '3.2x', label: 'ROAS' },
          { metric: 'conversion-rate', value: '180%', label: 'Conversion Rate Increase' },
        ],
        testimonial: {
          quote: 'For the first time, our social advertising is genuinely profitable. The creative strategy and targeting precision made all the difference.',
          author: 'Elena Vasquez',
          role: 'Founder & CEO, Organics Co.',
        },
      },
    ],

    faqs: [
      {
        question: 'Which social media platforms do you recommend for my business?',
        answer: 'Platform selection depends on your target audience, industry, and business goals. We conduct thorough audience research to identify where your customers spend their time. B2B companies often see strong results on LinkedIn and Twitter, while B2C brands thrive on Instagram, TikTok, and Facebook. We typically recommend starting with 2-3 platforms and expanding based on performance data.',
      },
      {
        question: 'How do you measure ROI on social media campaigns?',
        answer: 'We track both hard metrics (sales, leads, conversions, revenue) and soft metrics (engagement, reach, brand sentiment) using advanced analytics tools. You\'ll receive monthly reports showing cost per acquisition, customer lifetime value, engagement rates, and attribution across all touchpoints. We integrate with your CRM and analytics platform for complete visibility.',
      },
      {
        question: 'What\'s included in your community management service?',
        answer: 'Our community management includes monitoring all comments and messages, responding within 2 hours during business hours, engaging with relevant conversations in your industry, managing user-generated content, and escalating issues that require your input. We create response templates aligned with your brand voice and handle both positive engagement and negative feedback professionally.',
      },
      {
        question: 'Can you handle crisis communications on social media?',
        answer: 'Yes, we offer 24/7 crisis monitoring and rapid response protocols. If a crisis emerges, we immediately alert your team, draft response strategies, coordinate messaging across platforms, and monitor sentiment in real-time. We\'ve successfully managed product recalls, negative PR incidents, and viral criticism for our clients while protecting brand reputation.',
      },
      {
        question: 'How often will you post content on our behalf?',
        answer: 'Posting frequency depends on the platform and your package tier. Typically, we recommend 3-5 posts per week on Instagram, daily posts on Twitter/X, 2-3 LinkedIn articles weekly, and daily Stories or Reels. We provide content calendars 2 weeks in advance for your approval and remain flexible to adjust for trending topics or breaking news in your industry.',
      },
      {
        question: 'Do you work with influencers in my industry?',
        answer: 'Absolutely. We have partnerships with influencers across industries (tech, fashion, wellness, B2B, etc.) and can identify, negotiate with, and manage influencer collaborations on your behalf. We handle contract terms, content approval, performance tracking, and ROI analysis. Our influencer network includes micro-influencers (5-50K followers) for authentic engagement and macro-influencers for broader reach.',
      },
    ],

    cta: {
      heading: 'Ready to Amplify Your Brand?',
      description: 'Let\'s discuss how our social media and advertising strategies can drive measurable growth for your business.',
      buttonText: 'Get Started Today',
      buttonLink: '/contact',
    },
  },

  // ========================================
  // SERVICE 2: VIDEO PRODUCTION
  // ========================================
  video: {
    id: 'video',
    number: '02',
    title: 'Video Production',
    accentColor: '#00e92c', // Green

    hero: {
      tagline: 'Cinematic Storytelling That Resonates',
      description: 'Award-winning video production to create unforgettable brand experiences that captivate audiences and drive action.',
      stats: [
        { value: '100+', label: 'Videos Produced' },
        { value: '15M+', label: 'Total Views' },
        { value: '5-Star', label: 'Average Rating' },
      ],
    },

    overview: {
      heading: 'From Concept to Screen, We Bring Your Vision to Life',
      paragraphs: [
        'In a world where attention is currency, exceptional video content isn\'t optional—it\'s essential. We craft cinematic brand stories that don\'t just look beautiful, but drive real business results.',
        'Our full-service production studio handles everything from concept development and scriptwriting to filming, editing, and post-production. Whether you need a 30-second commercial, a feature-length brand documentary, or an entire video series, we deliver content that stands out.',
        'What sets us apart? Our meticulous attention to storytelling and visual quality. Every project is crafted to reflect your brand\'s identity, creating a truly unique audiovisual experience that your audience will remember.',
      ],
      benefits: [
        'Full-service production from pre-production to final delivery',
        'In-house studio with 4K and cinema-quality equipment',
        'Professional audio post-production and sound design',
        'Drone cinematography and aerial footage',
        'Multi-format delivery optimized for every platform',
        'Unlimited revisions until you\'re 100% satisfied',
      ],
    },

    features: [
      {
        icon: Film,
        title: 'Commercial Video Production',
        description: 'Broadcast-quality commercials for TV, streaming platforms, and social media with professional crews, lighting, and cinema cameras.',
      },
      {
        icon: BookOpen,
        title: 'Brand Storytelling',
        description: 'Documentary-style brand films, customer testimonials, founder stories, and cultural narratives that build emotional connections.',
      },
      {
        icon: Volume2,
        title: 'Audio Post-Production',
        description: 'Professional sound design, Foley effects, voiceover recording, mixing, and mastering for pristine audio quality.',
      },
      {
        icon: Sparkles,
        title: 'Motion Graphics & VFX',
        description: '2D/3D animation, visual effects, title sequences, and motion design that elevate your video to the next level.',
      },
      {
        icon: Navigation,
        title: 'Aerial Cinematography',
        description: 'Licensed drone pilots capturing stunning aerial footage for real estate, tourism, events, and brand films.',
      },
      {
        icon: Radio,
        title: 'Live Event Coverage',
        description: 'Multi-camera event filming, live streaming, conference coverage, and same-day highlight reels.',
      },
      {
        icon: Share2,
        title: 'Video SEO & Distribution',
        description: 'Strategic distribution across YouTube, Vimeo, social platforms with optimized titles, descriptions, and closed captions.',
      },
    ],

    caseStudies: [
      {
        clientName: 'StartupXYZ',
        clientLogo: '/images/clients/startupxyz-logo.svg',
        industry: 'Technology Startup',
        challenge: 'StartupXYZ needed a compelling product launch video to secure Series A funding and attract early adopters, but their previous video attempts felt generic and failed to convey their innovation.',
        solution: 'We developed a 2-minute narrative-driven video showcasing real customers using the product to solve real problems. Shot on location across 3 cities, featuring customer interviews, product demos, and dynamic sound design that built tension and excitement.',
        results: [
          { metric: 'funding', value: '$5M', label: 'Funding Secured' },
          { metric: 'video-views', value: '2M+', label: 'Video Views' },
          { metric: 'signups', value: '12,000', label: 'Signups in 30 Days' },
        ],
        testimonial: {
          quote: 'The video didn\'t just explain our product—it made investors feel our vision. The storytelling and production quality gave it an emotional weight we never expected.',
          author: 'David Park',
          role: 'Co-Founder & CEO, StartupXYZ',
        },
      },
      {
        clientName: 'Luxe Hotels Group',
        clientLogo: '/images/clients/luxe-logo.svg',
        industry: 'Hospitality',
        challenge: 'Luxe Hotels wanted a brand film that captured the essence of their boutique properties—intimate, culturally rich, and experiential—to differentiate from corporate hotel chains.',
        solution: 'Created a 5-minute cinematic brand film featuring real guests, local chefs, and cultural experiences at their flagship property. Used drone footage for sweeping vistas, intimate interviews, and carefully selected audio that reflected the location\'s artistic heritage.',
        results: [
          { metric: 'award', value: '🏆', label: 'Vimeo Staff Pick' },
          { metric: 'organic-views', value: '500K+', label: 'Organic Views' },
          { metric: 'bookings', value: '35%', label: 'Booking Increase' },
        ],
        testimonial: {
          quote: 'This film captures the soul of our brand better than anything we\'ve ever created. It\'s not just marketing—it\'s art that happens to drive bookings.',
          author: 'Marcus Rivera',
          role: 'CMO, Luxe Hotels Group',
        },
      },
      {
        clientName: 'EcoTech Solutions',
        clientLogo: '/images/clients/ecotech-logo.svg',
        industry: 'Renewable Energy',
        challenge: 'EcoTech needed to explain their complex solar technology to residential customers who found technical jargon overwhelming and intimidating.',
        solution: 'Produced a series of 5 educational videos (60-90 seconds each) using motion graphics, simple analogies, and real customer installations. Each video focused on one concern: cost, installation, maintenance, savings, and environmental impact.',
        results: [
          { metric: 'conversion-rate', value: '180%', label: 'Conversion Rate Increase' },
          { metric: 'video-count', value: '5 Videos', label: 'Complete Series' },
          { metric: 'watch-time', value: '45 sec', label: 'Avg Watch Time' },
        ],
        testimonial: {
          quote: 'These videos turned our most complex selling point into our biggest advantage. Prospects now arrive at sales calls already educated and ready to buy.',
          author: 'Jennifer Moore',
          role: 'VP of Sales, EcoTech Solutions',
        },
      },
    ],

    faqs: [
      {
        question: 'What\'s your typical production timeline from concept to delivery?',
        answer: 'Timeline varies by project scope. A simple 30-second commercial takes 2-3 weeks (pre-production, 1-2 day shoot, editing). A comprehensive brand film takes 4-6 weeks. Complex projects with animation or multiple locations may take 8-12 weeks. We provide detailed timelines during pre-production and keep you updated throughout.',
      },
      {
        question: 'Do you provide raw footage after the project?',
        answer: 'Yes, we can provide raw footage for an additional fee. Standard packages include final edited videos in multiple formats (16:9, 9:16, 1:1) optimized for different platforms. Raw footage packages include all filmed content organized by scene/take, which is useful if you want to create additional edits in-house later.',
      },
      {
        question: 'Can you handle audio and sound design for my video?',
        answer: 'Yes—our post-production team handles all audio needs including sound design, Foley effects, voiceover recording, mixing, and mastering. We source licensed tracks that fit your brand\'s tone and ensure pristine audio quality across all delivery formats.',
      },
      {
        question: 'What equipment do you use for filming?',
        answer: 'We shoot on cinema-quality cameras (RED, ARRI, Sony FX series) with high-end lenses, professional lighting packages, and cinema-grade stabilization (gimbals, dollies, drones). Our audio setup includes wireless lavs, boom mics, and field recorders. All footage is shot in 4K or higher for maximum flexibility in post-production.',
      },
      {
        question: 'How many revisions are included?',
        answer: 'Our standard package includes unlimited revisions until you\'re satisfied. We typically see 2-3 revision rounds: initial rough cut feedback, refinements, and final polish. Major scope changes (re-shoots, entirely new scenes) may incur additional costs, but refinements to editing, color, audio, and pacing are unlimited.',
      },
      {
        question: 'Can you film at multiple locations or do we need a studio?',
        answer: 'We\'re fully mobile and can film anywhere—your office, customer locations, outdoor environments, or our studio. We handle all location permits, insurance, and logistics. Our studio (available at no extra charge for qualifying projects) offers green screen, professional lighting, and acoustically treated audio recording.',
      },
    ],

    cta: {
      heading: 'Ready to Create Something Unforgettable?',
      description: 'Let\'s discuss your video project and explore how we can bring your brand story to life.',
      buttonText: 'Start Your Project',
      buttonLink: '/contact',
    },
  },

  // ========================================
  // SERVICE 3: PRINT & GRAPHIC DESIGN
  // ========================================
  design: {
    id: 'design',
    number: '03',
    title: 'Print & Graphic Design',
    accentColor: '#00d4aa', // Teal

    hero: {
      tagline: 'Timeless Visual Identities',
      description: 'Award-winning design that bridges digital and physical touchpoints, creating cohesive brand experiences that stand the test of time.',
      stats: [
        { value: '200+', label: 'Projects Delivered' },
        { value: '60', label: 'Industries Served' },
        { value: '24hr', label: 'Rush Turnaround' },
      ],
    },

    overview: {
      heading: 'Design That Communicates, Connects, and Converts',
      paragraphs: [
        'Great design is invisible until it\'s missing. We create visual identities that don\'t just look beautiful—they strategically communicate your brand values, differentiate you from competitors, and guide customers through their journey.',
        'From logo design and brand guidelines to packaging, print collateral, and digital assets, we ensure every touchpoint reinforces your brand story. Our designers combine aesthetic excellence with strategic thinking to solve business problems through design.',
        'Whether you\'re launching a new brand, refreshing an existing identity, or need design support for a specific campaign, we deliver work that elevates your brand and drives results.',
      ],
      benefits: [
        'Full brand identity systems, not just logos',
        'Print-ready files with CMYK color matching',
        'Source files provided (AI, PSD, InDD, Figma)',
        'Comprehensive style guides for consistent application',
        'Collaboration with your in-house team or agencies',
        'Print vendor partnerships for competitive pricing',
      ],
    },

    features: [
      {
        icon: Fingerprint,
        title: 'Brand Identity & Logo Design',
        description: 'Complete visual identity systems including logo, color palette, typography, brand patterns, and usage guidelines.',
      },
      {
        icon: Printer,
        title: 'Print Collateral Design',
        description: 'Brochures, flyers, posters, business cards, letterheads, and any print material designed for impact and print perfection.',
      },
      {
        icon: Package,
        title: 'Packaging Design',
        description: 'Product packaging, labels, boxes, and retail displays that stand out on shelves and create unboxing experiences.',
      },
      {
        icon: Monitor,
        title: 'Digital Graphics',
        description: 'Social media templates, email headers, presentation decks, digital ads, and UI elements for your digital presence.',
      },
      {
        icon: Megaphone,
        title: 'Marketing Materials',
        description: 'Trade show booths, banners, signage, vehicle wraps, and promotional items that extend your brand into the physical world.',
      },
      {
        icon: PieChart,
        title: 'Infographics & Data Visualization',
        description: 'Complex data transformed into engaging visual stories that make information digestible and shareable.',
      },
      {
        icon: BookMarked,
        title: 'Brand Style Guides',
        description: 'Comprehensive brand books documenting logo usage, color specs, typography, imagery style, and tone of voice.',
      },
      {
        icon: Building2,
        title: 'Environmental Graphics',
        description: 'Office branding, wall murals, wayfinding systems, and spatial design that transforms physical spaces.',
      },
    ],

    caseStudies: [
      {
        clientName: 'Organics Co.',
        clientLogo: '/images/clients/organics-logo.svg',
        industry: 'Health & Wellness',
        challenge: 'Organics Co.\'s packaging looked outdated compared to competitors. Their products were getting lost on shelves, and the brand didn\'t communicate the premium quality of their organic ingredients.',
        solution: 'Designed a complete packaging system featuring minimalist aesthetics, earth-tone colors, and tactile finishes (soft-touch lamination, embossing). Emphasized ingredient transparency with illustrated botanical elements. Created cohesive design across 12 product lines.',
        results: [
          { metric: 'shelf-appeal', value: '65%', label: 'Shelf Appeal Increase' },
          { metric: 'sales-growth', value: '40%', label: 'Sales Growth' },
          { metric: 'award', value: '🏆', label: 'Packaging Award' },
        ],
        testimonial: {
          quote: 'Our new packaging transformed our brand perception overnight. Customers now see us as the premium option, and retail buyers are actively seeking us out.',
          author: 'Elena Vasquez',
          role: 'Founder & CEO, Organics Co.',
        },
      },
      {
        clientName: 'TechFlow Inc.',
        clientLogo: '/images/clients/techflow-logo.svg',
        industry: 'B2B SaaS',
        challenge: 'TechFlow\'s brand identity felt generic and dated. They looked like every other SaaS company with blue/gray branding and couldn\'t differentiate in a crowded market.',
        solution: 'Created a bold, modern brand identity featuring vibrant gradients, geometric patterns, and dynamic typography. Developed comprehensive brand guidelines including presentation templates, social media assets, and email signatures. The identity conveyed innovation while maintaining B2B credibility.',
        results: [
          { metric: 'brand-transformation', value: 'Complete', label: 'Brand Transformation' },
          { metric: 'assets-delivered', value: '50+', label: 'Assets Delivered' },
          { metric: 'brand-recognition', value: '90%', label: 'Brand Recognition' },
        ],
        testimonial: {
          quote: 'The rebrand gave our sales team the confidence they needed. We finally look like the innovative company we are, not just another SaaS tool.',
          author: 'Sarah Chen',
          role: 'VP of Marketing, TechFlow Inc.',
        },
      },
      {
        clientName: 'Cascade Music Festival',
        clientLogo: '/images/clients/cascade-logo.svg',
        industry: 'Events & Entertainment',
        challenge: 'Cascade Music Festival needed to create buzz for their inaugural event and attract both attendees and sponsors without an established brand presence.',
        solution: 'Designed a vibrant, psychedelic-inspired brand identity with custom typography and fluid illustrations representing music\'s movement. Created poster series, social media graphics, sponsor packages, and environmental signage. The design became instantly recognizable and shareable.',
        results: [
          { metric: 'tickets-sold', value: '8,000', label: 'Tickets Sold' },
          { metric: 'sponsors', value: '15', label: 'Major Sponsors' },
          { metric: 'social-reach', value: 'Viral', label: 'Social Reach' },
        ],
        testimonial: {
          quote: 'The design work didn\'t just market the festival—it became part of the experience. People wanted the posters as art pieces.',
          author: 'Alex Thompson',
          role: 'Festival Director, Cascade Music Festival',
        },
      },
    ],

    faqs: [
      {
        question: 'How many logo concepts will I receive during the design process?',
        answer: 'Our standard package includes 3 initial logo concepts based on our discovery session and brand research. We present each concept with rationale explaining the design decisions. You\'ll select one direction to refine through 3 revision rounds. If you\'d like to see more initial concepts, we offer packages with 5-7 options.',
      },
      {
        question: 'Do you handle printing, or just provide design files?',
        answer: 'We provide print-ready files (PDF, AI, EPS) with correct bleed, color profiles (CMYK), and specifications. We can also manage printing through our trusted vendor partners who offer competitive pricing. This ensures your designs print exactly as intended with proper color matching and paper quality. You\'re also free to work with your own printer.',
      },
      {
        question: 'What file formats will I receive upon project completion?',
        answer: 'You\'ll receive comprehensive file packages including: vector files (AI, EPS, PDF), high-resolution rasters (PNG, JPG in multiple sizes), source files (InDesign, Photoshop, Figma where applicable), and web-optimized versions (SVG). All files are organized in folders by use case (print, digital, social media) for easy access.',
      },
      {
        question: 'Can you match my existing brand colors in print?',
        answer: 'Yes—we convert RGB digital colors to CMYK for print, provide Pantone color matching for precise brand consistency, and create color swatches for different materials (coated vs uncoated paper). We can also provide color samples from our print partners before full production to ensure accuracy.',
      },
      {
        question: 'Do you offer rush turnaround for urgent projects?',
        answer: 'Yes, we offer 24-hour rush service for select projects (business cards, flyers, social graphics) and 48-72 hour turnaround for more complex work (brochures, packaging mockups). Rush projects incur a 50% surcharge and require upfront payment. Contact us to confirm availability for your timeline.',
      },
      {
        question: 'Will I own the copyright to the designs you create?',
        answer: 'Upon final payment, you receive full ownership and copyright of all final deliverables. You can use, modify, and reproduce the designs without restriction. We retain work in our portfolio unless otherwise agreed. Source files and design process sketches are included in ownership transfer.',
      },
    ],

    cta: {
      heading: 'Ready to Elevate Your Brand?',
      description: 'Let\'s create a visual identity that sets you apart and drives business growth.',
      buttonText: 'Start Your Design Project',
      buttonLink: '/contact',
    },
  },

  // ========================================
  // SERVICE 4: STRATEGIC MEDIA SERVICES
  // ========================================
  strategy: {
    id: 'strategy',
    number: '04',
    title: 'Strategic Media Services',
    accentColor: '#00b8ff', // Blue

    hero: {
      tagline: 'Maximize ROI Through Intelligent Media Planning',
      description: 'Data-driven media strategy and buying that optimizes every dollar across channels, delivering measurable business results through market insights and performance analytics.',
      stats: [
        { value: '45%', label: 'Avg Cost Reduction' },
        { value: '2x', label: 'Reach Increase' },
        { value: '24/7', label: 'Performance Monitoring' },
      ],
    },

    overview: {
      heading: 'Turning Media Spend into Competitive Advantage',
      paragraphs: [
        'In today\'s fragmented media landscape, success requires more than just buying ads—it demands strategic planning, precise targeting, and continuous optimization. We help businesses navigate the complexity of media buying to achieve maximum ROI.',
        'Our approach combines deep market research, audience insights, and advanced analytics to identify the most effective channels and tactics for your specific goals. Whether you\'re launching nationally or targeting local markets, we ensure your message reaches the right people at the right time.',
        'From traditional media (TV, radio, print, outdoor) to digital channels (programmatic, social, search), we manage your entire media strategy with transparency, accountability, and a relentless focus on performance.',
      ],
      benefits: [
        'Negotiated rates 20-40% below market standard',
        'Real-time campaign dashboards with full transparency',
        'Cross-channel attribution modeling',
        'Dedicated media strategist for your account',
        'Quarterly business reviews with executive leadership',
        'Access to exclusive media inventory and partnerships',
      ],
    },

    features: [
      {
        icon: Calendar,
        title: 'Media Planning & Buying',
        description: 'Strategic channel selection, budget allocation, negotiation with media vendors, and placement optimization across all channels.',
      },
      {
        icon: Search,
        title: 'Market Research & Insights',
        description: 'Deep audience analysis, competitive intelligence, market trends, and consumer behavior research to inform strategy.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Campaign Optimization',
        description: 'Continuous A/B testing, creative rotation, bid management, and performance analysis to maximize campaign effectiveness.',
      },
      {
        icon: Activity,
        title: 'Performance Analytics',
        description: 'Comprehensive reporting, ROI tracking, attribution modeling, and actionable insights delivered weekly or monthly.',
      },
      {
        icon: Network,
        title: 'Multi-Channel Strategy',
        description: 'Integrated campaigns across TV, radio, digital, print, outdoor, and emerging channels for maximum reach and frequency.',
      },
      {
        icon: Cpu,
        title: 'Programmatic Advertising',
        description: 'Automated media buying with advanced targeting, real-time bidding, and AI-powered optimization for digital channels.',
      },
      {
        icon: GitBranch,
        title: 'Attribution Modeling',
        description: 'Multi-touch attribution to understand customer journey and assign credit to touchpoints that drive conversions.',
      },
      {
        icon: Calculator,
        title: 'Budget Allocation & Forecasting',
        description: 'Predictive modeling, scenario planning, and strategic budget recommendations to maximize ROI and minimize waste.',
      },
    ],

    caseStudies: [
      {
        clientName: 'StartupXYZ',
        clientLogo: '/images/clients/startupxyz-logo.svg',
        industry: 'Technology Startup',
        challenge: 'StartupXYZ was spending $200K/month across Google, Facebook, and LinkedIn with poor attribution and rising acquisition costs. They couldn\'t identify which channels drove actual revenue.',
        solution: 'Implemented comprehensive attribution modeling connecting ad spend to closed deals. Shifted budget from broad awareness campaigns to high-intent search and retargeting. Introduced programmatic display for remarketing and reduced CPC through bid optimization.',
        results: [
          { metric: 'cac-reduction', value: '45%', label: 'Lower CAC' },
          { metric: 'lead-volume', value: '2x', label: 'Lead Volume' },
          { metric: 'roi', value: '180%', label: 'ROI Improvement' },
        ],
        testimonial: {
          quote: 'For the first time, we have complete visibility into our media performance. The cost reductions alone paid for their services 3x over.',
          author: 'David Park',
          role: 'Co-Founder & CEO, StartupXYZ',
        },
      },
      {
        clientName: 'Regional Auto Group',
        clientLogo: '/images/clients/autogroup-logo.svg',
        industry: 'Automotive Retail',
        challenge: 'Regional Auto Group needed to drive showroom traffic across 8 dealerships in 3 markets but their TV and radio campaigns weren\'t trackable or optimized.',
        solution: 'Created a multi-channel strategy combining local TV during prime automotive shopping times, targeted radio during commute hours, digital retargeting for website visitors, and geo-fenced mobile ads near competitor dealerships. Implemented call tracking and unique URLs for attribution.',
        results: [
          { metric: 'traffic', value: '60%', label: 'Showroom Traffic Increase' },
          { metric: 'vehicles-sold', value: '320', label: 'Vehicles Sold (Attributed)' },
          { metric: 'revenue', value: '$2.8M', label: 'Revenue Impact' },
        ],
        testimonial: {
          quote: 'They transformed our scattershot approach into a precision instrument. We know exactly which ads drive sales and can prove ROI to our CFO.',
          author: 'Jennifer Collins',
          role: 'Marketing Director, Regional Auto Group',
        },
      },
      {
        clientName: 'National Healthcare Provider',
        clientLogo: '/images/clients/healthcare-logo.svg',
        industry: 'Healthcare',
        challenge: 'A national healthcare provider needed to launch urgent care centers in 12 new markets with limited brand awareness and strict compliance requirements.',
        solution: 'Developed market-specific strategies combining out-of-home advertising (billboards near hospitals and urgent cares), local search optimization, healthcare directory listings, and geo-targeted social campaigns. All creative met HIPAA and medical advertising regulations.',
        results: [
          { metric: 'markets-launched', value: '12/12', label: 'Markets Launched' },
          { metric: 'patient-visits', value: '75,000', label: 'Patient Visits (Year 1)' },
          { metric: 'break-even', value: '8 Months', label: 'Break-Even Timeline' },
        ],
        testimonial: {
          quote: 'Their multi-market expertise and compliance knowledge were invaluable. Every location exceeded patient volume projections by 20%+.',
          author: 'Dr. Michael Chen',
          role: 'CMO, National Healthcare Provider',
        },
      },
    ],

    faqs: [
      {
        question: 'What\'s the minimum media budget required to work with your team?',
        answer: 'We typically work with clients spending $50,000+ per month across all channels, though we can accommodate smaller budgets for highly focused campaigns. Our management fee is 15% of media spend (negotiable for larger budgets), with a $5,000 monthly minimum to ensure we can dedicate sufficient strategic resources.',
      },
      {
        question: 'Do you work directly with media vendors or act as an intermediary?',
        answer: 'We maintain direct relationships with media vendors (Google, Meta, TV networks, radio stations, programmatic exchanges) and negotiate on your behalf using our agency buying power. You benefit from our negotiated rates (typically 20-40% below retail) while maintaining transparency—you\'ll see exactly where every dollar goes.',
      },
      {
        question: 'How do you attribute conversions across multiple channels?',
        answer: 'We use multi-touch attribution modeling that assigns fractional credit to each touchpoint in the customer journey. We integrate with your CRM, analytics platform, and POS system to track the complete path from first touch to conversion. You\'ll see which channels work together and which can be optimized or eliminated.',
      },
      {
        question: 'What reporting will I receive and how often?',
        answer: 'You receive weekly performance dashboards (automated via Looker Studio or Tableau) showing spend, impressions, clicks, conversions, and ROI by channel. Monthly deep-dive reports include insights, recommendations, and competitive benchmarking. Quarterly business reviews with your executive team discuss strategy, results, and planning for the next quarter.',
      },
      {
        question: 'Can you help with both traditional and digital media?',
        answer: 'Yes—we\'re a full-service media agency covering TV, radio, print, outdoor (billboards, transit), digital (search, social, programmatic, display), and emerging channels (streaming audio, connected TV, podcast ads). Many clients see best results from integrated campaigns that combine traditional brand-building with digital performance tactics.',
      },
      {
        question: 'What happens if campaign performance doesn\'t meet expectations?',
        answer: 'We establish clear KPIs and performance benchmarks upfront. If campaigns underperform, we immediately diagnose the issue (creative, targeting, channel mix, landing pages) and implement fixes at no additional cost. Our success is tied to your results—if you don\'t hit goals, we work harder, not charge more. Most clients see improvement within the first 30-60 days of optimization.',
      },
    ],

    cta: {
      heading: 'Ready to Optimize Your Media Investment?',
      description: 'Let\'s analyze your current media strategy and identify opportunities to improve ROI.',
      buttonText: 'Schedule Strategy Session',
      buttonLink: '/contact',
    },
  },
};
