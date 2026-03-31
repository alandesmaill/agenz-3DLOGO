import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '../lib/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Strip sslmode from connection string so Pool's ssl config takes full effect
const connectionString = (process.env.DATABASE_URL || '').replace(/[?&]sslmode=[^&]*/g, '').replace(/[?&]pgbouncer=[^&]*/g, '');
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Icon mapping: LucideIcon component display names to string names
const iconNameMap: Record<string, string> = {
  'camera-body': 'Camera',
  lenses: 'Aperture',
  memory: 'HardDrive',
  monitors: 'Monitor',
  wireless: 'Wifi',
  focus: 'SlidersHorizontal',
  filters: 'Layers',
  tripod: 'Crosshair',
  batteries: 'Battery',
  'matte-box': 'Square',
  easyrig: 'PersonStanding',
};

async function main() {
  console.log('Seeding database...');

  // ── Admin User ──────────────────────────────────────
  const email = process.env.ADMIN_EMAIL || 'admin@agenz.com';
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'changeme123';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: 'Admin' },
    create: {
      email,
      passwordHash,
      name: 'Admin',
    },
  });
  console.log(`Admin user created: ${email}`);

  // ── Camera Package: ARRI Alexa 35 ──────────────────
  const pkg = await prisma.cameraPackage.upsert({
    where: { slug: 'arri-alexa-35' },
    update: {},
    create: {
      slug: 'arri-alexa-35',
      name: 'ARRI Alexa 35 Package',
      tagline: 'Cinema-Grade Production Packages',
      description:
        'The complete ARRI Alexa 35 production package with Signature Prime lenses. Everything you need for professional cinema production — from camera body to EasyRig, lenses to monitoring — in a single comprehensive rental.',
      cameraBody: 'ARRI Alexa 35',
      packageImage: '/images/camera-rental/arri-alexa-35-package.webp',
      accentColor: '#00ffff',
      highlights: ['ARRI Alexa 35', 'Signature Primes', '19mm Studio', 'Full Package'],
      productionSetIncludes: [
        'ARRI Alexa 35 Camera Body',
        '19mm Studio Bridge Plate (BPA-7)',
        'LBUS (Lens Bus Unit) Receiver',
        'ARRI Electronic Viewfinder (EVF-2)',
        'ARRI Hand Grip Set (LGR-1)',
        'LPL Lens Mount',
        'Power & Data Junction Box',
        'LMB 4x5 Matte Box Assembly',
        'Support Rods 150mm / 240mm / 340mm',
        'Top Handle with Accessory Slot',
      ],
      published: true,
      sortOrder: 0,
    },
  });

  // Equipment categories and items
  const categories = [
    {
      slug: 'camera-body',
      name: 'Camera Body',
      description: 'Production-ready ARRI Alexa 35 in 19mm Studio configuration',
      items: [
        { name: 'Alexa 35 Production Set (19mm Studio)', brand: 'ARRI', qty: 1, image: '/images/camera-rental/camera-body/alexa-35-production-set.webp' },
      ],
    },
    {
      slug: 'lenses',
      name: 'Lenses',
      description: 'ARRI Signature Prime lenses — T1.8 across all focal lengths',
      items: [
        { name: 'Signature Prime 18mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 18mm T1.8 M.webp' },
        { name: 'Signature Prime 25mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 25mm T1.8 M.webp' },
        { name: 'Signature Prime 35mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 35mm T1.8 M.webp' },
        { name: 'Signature Prime 47mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 47mm T1.8 M.webp' },
        { name: 'Signature Prime 75mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 75mm T1.8 M.webp' },
      ],
    },
    {
      slug: 'memory',
      name: 'Memory',
      description: 'CODEX high-speed recording media and docking solutions',
      items: [
        { name: 'CODEX Memory 2TB + Dock Bundle', brand: 'CODEX', qty: 4, image: '/images/camera-rental/memory/CODEX Memory 2TB + Dock Bundle.webp' },
        { name: 'Compact Drive Dock (TB3)', brand: 'CODEX', qty: 1, image: '/images/camera-rental/memory/Compact Drive Dock (TB3).webp' },
      ],
    },
    {
      slug: 'monitors',
      name: 'Monitors',
      description: "Full monitoring suite from on-camera to large director's monitors",
      items: [
        { name: 'SmallHD Cine 24"', brand: 'SmallHD', qty: 1, image: '/images/camera-rental/monitors/SmallHD Cine 24".webp' },
        { name: 'SmallHD Cine 18"', brand: 'SmallHD', qty: 1, image: '/images/camera-rental/monitors/SmallHD Cine 18".webp' },
        { name: 'ARRI 4K 7" Monitor', brand: 'ARRI', qty: 1, image: '/images/camera-rental/monitors/ARRI 4K 7" Monitor.webp' },
        { name: 'SmallHD 7" Monitor', brand: 'SmallHD', qty: 1, image: '/images/camera-rental/monitors/SmallHD 7" Monitor.webp' },
        { name: 'TVLogic F-7HS Bundle', brand: 'TVLogic', qty: 1, image: '/images/camera-rental/monitors/TVLogic F-7HS Bundle.webp' },
      ],
    },
    {
      slug: 'wireless',
      name: 'Wireless',
      description: 'VAXIS Storm 3000 wireless video transmission system',
      items: [
        { name: 'Storm 3000 Transmitter', brand: 'VAXIS', qty: 1, image: '/images/camera-rental/wireless/Storm 3000 Transmitter.webp' },
        { name: 'Storm 3000 RX Kit', brand: 'VAXIS', qty: 3, image: '/images/camera-rental/wireless/Storm 3000 RX Kit.webp' },
        { name: 'Blade Antenna', brand: 'VAXIS', qty: 10, image: '/images/camera-rental/wireless/Blade Antenna.webp' },
        { name: 'Channel Scanner', brand: 'VAXIS', qty: 1, image: '/images/camera-rental/wireless/Channel Scanner.webp' },
        { name: 'D-tap Power Cable', brand: 'VAXIS', qty: 1, image: '/images/camera-rental/wireless/D-tap Power Cable.webp' },
        { name: 'CamRade wetSuit Cover', brand: 'CamRade', qty: 1, image: '/images/camera-rental/wireless/CamRade wetSuit Cover.webp' },
      ],
    },
    {
      slug: 'focus',
      name: 'Focus (Hi-5)',
      description: 'Hi-5 wireless follow focus system with cforce motor',
      items: [
        { name: 'Hi-5 Hand Unit Basic Set', brand: 'ARRI', qty: 1, notes: 'LBUS cables sold separately', image: '/images/camera-rental/focus/Hi-5 Hand Unit Basic Set.webp' },
        { name: 'cforce mini Basic Set 2', brand: 'ARRI', qty: 1 },
      ],
    },
    {
      slug: 'filters',
      name: 'Filters',
      description: 'ARRI FSND and specialty filter package',
      items: [
        { name: 'FSND 0.3 + Tiffen Combo', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/FSND 0.3 + Tiffen Combo.webp' },
        { name: 'FSND 0.6 + Tiffen Combo', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/FSND 0.6 + Tiffen Combo.webp' },
        { name: 'FSND 0.9 + Tiffen Combo', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/FSND 0.9 + Tiffen Combo.webp' },
        { name: 'Rota Pola Frame', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/Rota Pola Frame.webp' },
        { name: '4x5.65" Clear Filter', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/4x5.65" Clear Filter.webp' },
        { name: 'Glimmerglass 1/4', brand: 'Tiffen', qty: 1, image: '/images/camera-rental/filters/Glimmerglass 1-4.webp' },
        { name: 'Glimmerglass 1/8', brand: 'Tiffen', qty: 1, image: '/images/camera-rental/filters/Glimmerglass 1-8.webp' },
      ],
    },
    {
      slug: 'tripod',
      name: 'Tripod',
      description: 'Professional fluid head and hard tripod systems',
      items: [
        { name: 'Ultimate 2560 Fluid Head Package', brand: "O'Connor", qty: 1, image: '/images/camera-rental/tripod/Ultimate 2560 Fluid Head Package.webp' },
        { name: '150 II Hard Tripod', brand: 'Sachtler', qty: 1, image: '/images/camera-rental/tripod/150 II Hard Tripod.webp' },
      ],
    },
    {
      slug: 'batteries',
      name: 'Batteries',
      description: 'BEBOB B-Mount and V-Mount battery systems with chargers',
      items: [
        { name: 'BEBOB B-Mount 285Wh', brand: 'BEBOB', qty: 2, image: '/images/camera-rental/batteries/BEBOB B-Mount 285Wh.webp' },
        { name: 'BEBOB B-Mount 156Wh', brand: 'BEBOB', qty: 6, image: '/images/camera-rental/batteries/BEBOB B-Mount 156Wh.webp' },
        { name: 'BEBOB B-Mount Hotswap', brand: 'BEBOB', qty: 1, image: '/images/camera-rental/batteries/BEBOB B-Mount Hotswap.webp' },
        { name: 'V-Mount 285Wh', brand: 'BEBOB', qty: 6, image: '/images/camera-rental/batteries/V-Mount 285Wh.webp' },
        { name: 'Micro Battery 95Wh', brand: 'BEBOB', qty: 4, image: '/images/camera-rental/batteries/Micro Battery 95Wh.webp' },
        { name: 'B-Mount Charger', brand: 'BEBOB', qty: 2, notes: 'Included with battery sets', image: '/images/camera-rental/batteries/B-Mount Charger.webp' },
      ],
    },
    {
      slug: 'matte-box',
      name: 'Matte Box',
      description: 'ARRI LMB 4x5 full kit with support rod set',
      items: [
        { name: 'LMB 4x5 Full Kit', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/LMB 4x5 Full Kit.webp' },
        { name: 'Support Rod 150mm', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/Support Rod 150mm.webp' },
        { name: 'Support Rod 240mm', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/Support Rod 240mm.webp' },
        { name: 'Support Rod 340mm', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/Support Rod 340mm.webp' },
      ],
    },
    {
      slug: 'easyrig',
      name: 'EasyRig',
      description: 'Full EasyRig gimbal vest system for handheld operation',
      items: [
        { name: 'Vario 5 Large Easylock Gimbal Rig', brand: 'EasyRig', qty: 1, notes: 'EA033-Q + EA033-WB', image: '/images/camera-rental/easyrig/Vario 5 Large Easylock Gimbal Rig.webp' },
      ],
    },
  ];

  // Delete existing equipment data and re-seed
  await prisma.equipmentItem.deleteMany({ where: { category: { packageId: pkg.id } } });
  await prisma.equipmentCategory.deleteMany({ where: { packageId: pkg.id } });

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const iconName = iconNameMap[cat.slug] || 'Camera';

    await prisma.equipmentCategory.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        iconName,
        description: cat.description,
        sortOrder: i,
        packageId: pkg.id,
        items: {
          create: cat.items.map((item, j) => ({
            name: item.name,
            brand: item.brand,
            qty: item.qty,
            notes: (item as { notes?: string }).notes || null,
            image: item.image || null,
            sortOrder: j,
          })),
        },
      },
    });
  }
  console.log('Camera package seeded with 11 equipment categories');

  // ── Individual Rental Items ───────────────────────
  // Seed each equipment item as an individual RentalItem too
  await prisma.rentalItem.deleteMany({});

  const rentalItems: { name: string; brand: string; category: string; qty: number; description?: string; image?: string; sortOrder: number }[] = [];
  let sortIdx = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      rentalItems.push({
        name: item.name,
        brand: item.brand,
        category: cat.name,
        qty: item.qty,
        description: (item as { notes?: string }).notes || undefined,
        image: item.image || undefined,
        sortOrder: sortIdx++,
      });
    }
  }

  for (const ri of rentalItems) {
    await prisma.rentalItem.create({
      data: {
        name: ri.name,
        brand: ri.brand,
        category: ri.category,
        qty: ri.qty,
        description: ri.description || null,
        image: ri.image || null,
        available: true,
        sortOrder: ri.sortOrder,
      },
    });
  }
  console.log(`Seeded ${rentalItems.length} individual rental items`);

  // ── Services ───────────────────────────────────────
  await prisma.serviceFeature.deleteMany({});
  await prisma.service.deleteMany({});

  const services = [
    {
      slug: 'advertising',
      number: '01',
      title: 'Advertising & Social Media',
      accentColor: '#00ffff',
      overviewDescription: 'Strategic campaigns that amplify your brand across digital platforms with data-driven precision and creative excellence.',
      overviewIconName: 'Megaphone',
      ctaText: 'Learn More',
      ctaLink: '/services/advertising',
      heroTagline: 'Amplify Your Brand Across Digital Platforms',
      heroDescription: 'Strategic campaigns that drive engagement, build communities, and deliver measurable ROI through data-driven precision and creative excellence.',
      heroStats: [
        { value: '340%', label: 'Avg Engagement Growth' },
        { value: '50+', label: 'Active Clients' },
        { value: '98%', label: 'ROI Achievement' },
      ],
      overviewHeading: 'Transforming Social Presence into Business Growth',
      overviewParagraphs: [
        "In today's digital-first world, your social media presence is your most powerful asset. We don't just post content—we build strategic narratives that resonate with your audience, spark conversations, and drive measurable business results.",
        'Our data-driven approach combines creative storytelling with advanced analytics to ensure every campaign delivers maximum impact. From Instagram and TikTok to LinkedIn and emerging platforms, we meet your audience where they are.',
        "Whether you're launching a new product, building brand awareness, or driving conversions, our team of strategists, creators, and analysts work together to amplify your message and achieve your goals.",
      ],
      overviewBenefits: [
        'Multi-platform strategy tailored to your audience demographics',
        'Real-time campaign optimization based on performance data',
        '24/7 community management and engagement',
        'Crisis communication and reputation management',
        'Comprehensive monthly reporting with actionable insights',
        'Integration with your existing marketing stack',
      ],
      ctaHeading: 'Ready to Amplify Your Brand?',
      ctaDescription: "Let's discuss how our social media and advertising strategies can drive measurable growth for your business.",
      ctaButtonText: 'Get Started Today',
      ctaButtonLink: '/contact',
      metaTitle: 'Advertising & Social Media Services - AGENZ',
      metaDescription: 'Strategic campaigns that amplify your brand across digital platforms with data-driven precision and creative excellence. Expert social media advertising and brand campaigns.',
      metaKeywords: ['advertising', 'social media marketing', 'digital marketing', 'brand campaigns', 'social media strategy', 'paid social advertising', 'content marketing', 'advertising agency Sulaymaniyah', 'social media marketing Kurdistan'],
      sortOrder: 0,
      features: [
        { iconName: 'TrendingUp', title: 'Social Media Strategy', description: 'Comprehensive platform analysis, audience research, content calendars, and growth roadmaps tailored to your business objectives.' },
        { iconName: 'Target', title: 'Paid Advertising Campaigns', description: 'Expert management of Google Ads, Meta (Facebook/Instagram), LinkedIn, TikTok, and Twitter campaigns with advanced targeting.' },
        { iconName: 'PenLine', title: 'Content Creation & Copywriting', description: 'High-quality visual content, engaging copy, video scripts, and storytelling that captures attention and drives action.' },
        { iconName: 'Users', title: 'Community Management', description: 'Proactive engagement, comment moderation, DM responses, and building loyal brand communities that advocate for you.' },
        { iconName: 'BarChart2', title: 'Analytics & Reporting', description: 'In-depth performance tracking, ROI analysis, competitor benchmarking, and monthly strategy sessions with your team.' },
        { iconName: 'Star', title: 'Influencer Partnerships', description: 'Strategic collaborations with micro and macro influencers, contract negotiation, and campaign performance tracking.' },
        { iconName: 'SplitSquareHorizontal', title: 'A/B Testing & Optimization', description: 'Continuous experimentation with ad creative, messaging, targeting, and timing to maximize campaign effectiveness.' },
        { iconName: 'ShieldAlert', title: 'Crisis Management', description: '24/7 monitoring, rapid response protocols, and reputation protection strategies to safeguard your brand during challenges.' },
      ],
    },
    {
      slug: 'video',
      number: '02',
      title: 'Video Production',
      accentColor: '#00e92c',
      overviewDescription: 'Cinematic storytelling crafted with precision to create unforgettable brand experiences that captivate and resonate.',
      overviewIconName: 'Clapperboard',
      ctaText: 'Learn More',
      ctaLink: '/services/video',
      heroTagline: 'Cinematic Storytelling That Resonates',
      heroDescription: 'Award-winning video production to create unforgettable brand experiences that captivate audiences and drive action.',
      heroStats: [
        { value: '100+', label: 'Videos Produced' },
        { value: '15M+', label: 'Total Views' },
        { value: '5-Star', label: 'Average Rating' },
      ],
      overviewHeading: 'From Concept to Screen, We Bring Your Vision to Life',
      overviewParagraphs: [
        "In a world where attention is currency, exceptional video content isn't optional—it's essential. We craft cinematic brand stories that don't just look beautiful, but drive real business results.",
        'Our full-service production studio handles everything from concept development and scriptwriting to filming, editing, and post-production. Whether you need a 30-second commercial, a feature-length brand documentary, or an entire video series, we deliver content that stands out.',
        "What sets us apart? Our meticulous attention to storytelling and visual quality. Every project is crafted to reflect your brand's identity, creating a truly unique audiovisual experience that your audience will remember.",
      ],
      overviewBenefits: [
        'Full-service production from pre-production to final delivery',
        'In-house studio with 4K and cinema-quality equipment',
        'Professional audio post-production and sound design',
        'Drone cinematography and aerial footage',
        'Multi-format delivery optimized for every platform',
        "Unlimited revisions until you're 100% satisfied",
      ],
      ctaHeading: 'Ready to Create Something Unforgettable?',
      ctaDescription: "Let's discuss your video project and explore how we can bring your brand story to life.",
      ctaButtonText: 'Start Your Project',
      ctaButtonLink: '/contact',
      metaTitle: 'Video Production & Music Services - AGENZ',
      metaDescription: 'Cinematic storytelling combined with custom soundscapes to create unforgettable brand experiences that resonate. Professional video production and music composition.',
      metaKeywords: ['video production', 'music composition', 'cinematic storytelling', 'brand videos', 'commercial production', 'sound design', 'custom music', 'video production Sulaymaniyah', 'commercial video Iraq'],
      sortOrder: 1,
      features: [
        { iconName: 'Film', title: 'Commercial Video Production', description: 'Broadcast-quality commercials for TV, streaming platforms, and social media with professional crews, lighting, and cinema cameras.' },
        { iconName: 'BookOpen', title: 'Brand Storytelling', description: 'Documentary-style brand films, customer testimonials, founder stories, and cultural narratives that build emotional connections.' },
        { iconName: 'Volume2', title: 'Audio Post-Production', description: 'Professional sound design, Foley effects, voiceover recording, mixing, and mastering for pristine audio quality.' },
        { iconName: 'Sparkles', title: 'Motion Graphics & VFX', description: '2D/3D animation, visual effects, title sequences, and motion design that elevate your video to the next level.' },
        { iconName: 'Navigation', title: 'Aerial Cinematography', description: 'Licensed drone pilots capturing stunning aerial footage for real estate, tourism, events, and brand films.' },
        { iconName: 'Radio', title: 'Live Event Coverage', description: 'Multi-camera event filming, live streaming, conference coverage, and same-day highlight reels.' },
        { iconName: 'Share2', title: 'Video SEO & Distribution', description: 'Strategic distribution across YouTube, Vimeo, social platforms with optimized titles, descriptions, and closed captions.' },
        { iconName: 'Package', title: 'AgenZ Rental Service', description: 'Professional production equipment and creative resources available for rent, including cameras, lighting, audio gear, and studio essentials, empowering creators and brands to execute high-quality productions with ease.' },
      ],
    },
    {
      slug: 'design',
      number: '03',
      title: 'Print & Graphic Design',
      accentColor: '#00d4aa',
      overviewDescription: 'Timeless visual identities that bridge digital and physical touchpoints with creative excellence and attention to detail.',
      overviewIconName: 'Palette',
      ctaText: 'Learn More',
      ctaLink: '/services/design',
      heroTagline: 'Timeless Visual Identities',
      heroDescription: 'Award-winning design that bridges digital and physical touchpoints, creating cohesive brand experiences that stand the test of time.',
      heroStats: [
        { value: '200+', label: 'Projects Delivered' },
        { value: '60', label: 'Industries Served' },
        { value: '24hr', label: 'Rush Turnaround' },
      ],
      overviewHeading: 'Design That Communicates, Connects, and Converts',
      overviewParagraphs: [
        "Great design is invisible until it's missing. We create visual identities that don't just look beautiful—they strategically communicate your brand values, differentiate you from competitors, and guide customers through their journey.",
        'From logo design and brand guidelines to packaging, print collateral, and digital assets, we ensure every touchpoint reinforces your brand story. Our designers combine aesthetic excellence with strategic thinking to solve business problems through design.',
        "Whether you're launching a new brand, refreshing an existing identity, or need design support for a specific campaign, we deliver work that elevates your brand and drives results.",
      ],
      overviewBenefits: [
        'Full brand identity systems, not just logos',
        'Print-ready files with CMYK color matching',
        'Source files provided (AI, PSD, InDD, Figma)',
        'Comprehensive style guides for consistent application',
        'Collaboration with your in-house team or agencies',
        'Print vendor partnerships for competitive pricing',
      ],
      ctaHeading: 'Ready to Elevate Your Brand?',
      ctaDescription: "Let's create a visual identity that sets you apart and drives business growth.",
      ctaButtonText: 'Start Your Design Project',
      ctaButtonLink: '/contact',
      metaTitle: 'Print & Graphic Design Services - AGENZ',
      metaDescription: 'Timeless visual identities that bridge digital and physical touchpoints with creative excellence and attention to detail. Professional graphic design and print services.',
      metaKeywords: ['graphic design', 'print design', 'brand identity', 'visual design', 'logo design', 'branding', 'creative design', 'graphic design Sulaymaniyah', 'branding agency Kurdistan'],
      sortOrder: 2,
      features: [
        { iconName: 'Fingerprint', title: 'Brand Identity & Logo Design', description: 'Complete visual identity systems including logo, color palette, typography, brand patterns, and usage guidelines.' },
        { iconName: 'Printer', title: 'Print Collateral Design', description: 'Brochures, flyers, posters, business cards, letterheads, and any print material designed for impact and print perfection.' },
        { iconName: 'Package', title: 'Packaging Design', description: 'Product packaging, labels, boxes, and retail displays that stand out on shelves and create unboxing experiences.' },
        { iconName: 'Monitor', title: 'Digital Graphics', description: 'Social media templates, email headers, presentation decks, digital ads, and UI elements for your digital presence.' },
        { iconName: 'Megaphone', title: 'Marketing Materials', description: 'Trade show booths, banners, signage, vehicle wraps, and promotional items that extend your brand into the physical world.' },
        { iconName: 'PieChart', title: 'Infographics & Data Visualization', description: 'Complex data transformed into engaging visual stories that make information digestible and shareable.' },
        { iconName: 'BookMarked', title: 'Brand Style Guides', description: 'Comprehensive brand books documenting logo usage, color specs, typography, imagery style, and tone of voice.' },
        { iconName: 'Building2', title: 'Environmental Graphics', description: 'Office branding, wall murals, wayfinding systems, and spatial design that transforms physical spaces.' },
      ],
    },
    {
      slug: 'strategy',
      number: '04',
      title: 'Strategic Media Services',
      accentColor: '#00b8ff',
      overviewDescription: 'Comprehensive media planning and buying that maximizes ROI through intelligent channel optimization and market insights.',
      overviewIconName: 'Target',
      ctaText: 'Learn More',
      ctaLink: '/services/strategy',
      heroTagline: 'Maximize ROI Through Intelligent Media Planning',
      heroDescription: 'Data-driven media strategy and buying that optimizes every dollar across channels, delivering measurable business results through market insights and performance analytics.',
      heroStats: [
        { value: '45%', label: 'Avg Cost Reduction' },
        { value: '2x', label: 'Reach Increase' },
        { value: '24/7', label: 'Performance Monitoring' },
      ],
      overviewHeading: 'Turning Media Spend into Competitive Advantage',
      overviewParagraphs: [
        "In today's fragmented media landscape, success requires more than just buying ads—it demands strategic planning, precise targeting, and continuous optimization. We help businesses navigate the complexity of media buying to achieve maximum ROI.",
        'Our approach combines deep market research, audience insights, and advanced analytics to identify the most effective channels and tactics for your specific goals. Whether you\'re launching nationally or targeting local markets, we ensure your message reaches the right people at the right time.',
        'From traditional media (TV, radio, print, outdoor) to digital channels (programmatic, social, search), we manage your entire media strategy with transparency, accountability, and a relentless focus on performance.',
      ],
      overviewBenefits: [
        'Negotiated rates 20-40% below market standard',
        'Real-time campaign dashboards with full transparency',
        'Cross-channel attribution modeling',
        'Dedicated media strategist for your account',
        'Quarterly business reviews with executive leadership',
        'Access to exclusive media inventory and partnerships',
      ],
      ctaHeading: 'Ready to Optimize Your Media Investment?',
      ctaDescription: "Let's analyze your current media strategy and identify opportunities to improve ROI.",
      ctaButtonText: 'Schedule Strategy Session',
      ctaButtonLink: '/contact',
      metaTitle: 'Strategic Media Services - AGENZ',
      metaDescription: 'Comprehensive media planning and buying that maximizes ROI through intelligent channel optimization and market insights. Expert strategic media services.',
      metaKeywords: ['media planning', 'media buying', 'strategic media', 'channel optimization', 'ROI optimization', 'market insights', 'media strategy', 'media planning Kurdistan', 'marketing strategy Iraq'],
      sortOrder: 3,
      features: [
        { iconName: 'Calendar', title: 'Media Planning & Buying', description: 'Strategic channel selection, budget allocation, negotiation with media vendors, and placement optimization across all channels.' },
        { iconName: 'Search', title: 'Market Research & Insights', description: 'Deep audience analysis, competitive intelligence, market trends, and consumer behavior research to inform strategy.' },
        { iconName: 'SlidersHorizontal', title: 'Campaign Optimization', description: 'Continuous A/B testing, creative rotation, bid management, and performance analysis to maximize campaign effectiveness.' },
        { iconName: 'Activity', title: 'Performance Analytics', description: 'Comprehensive reporting, ROI tracking, attribution modeling, and actionable insights delivered weekly or monthly.' },
        { iconName: 'Network', title: 'Multi-Channel Strategy', description: 'Integrated campaigns across TV, radio, digital, print, outdoor, and emerging channels for maximum reach and frequency.' },
        { iconName: 'Cpu', title: 'Programmatic Advertising', description: 'Automated media buying with advanced targeting, real-time bidding, and AI-powered optimization for digital channels.' },
      ],
    },
  ];

  for (const svc of services) {
    const { features, overviewParagraphs, overviewBenefits, metaKeywords, ...serviceData } = svc;
    const created = await prisma.service.create({
      data: {
        ...serviceData,
        features: {
          create: features.map((f, i) => ({ ...f, sortOrder: i })),
        },
      },
    });
    // PrismaPg adapter drops String[] fields during create with spread —
    // update them separately as a workaround
    await prisma.service.update({
      where: { id: created.id },
      data: { overviewParagraphs, overviewBenefits, metaKeywords },
    });
    console.log(`Seeded service: ${created.title}`);
  }
  console.log(`Seeded ${services.length} services with features`);

  // ── Portfolio Projects ──────────────────────────────
  const projects = [
    {
      slug: 'sulaymaniyah-anniversary-2025',
      category: 'event-branding',
      clientName: 'Sulaymaniyah Governorate',
      projectTitle: 'Suli Day — City Anniversary 2025',
      year: '2025',
      accentColor: '#00e92c',
      thumbnailImage: '/images/works/sulaymaniyah-anniversary-2025/sulaymaniyah-anniversary-160x120.webp',
      thumbnailAlt: 'Suli Day 2025 — Sulaymaniyah City Anniversary',
      heroCoverImage: '/images/works/sulaymaniyah-anniversary-2025/sulaymaniyah-anniversary- 600×400px.webp',
      heroTagline: 'Honoring Nali — The Poet Who Gave the City Its Soul',
      heroDescription:
        "This year, Suli Day celebrated the spirit of Nali, one of Kurdistan's legendary poets. We brought the theme to life through captivating visuals, thoughtful branding, and immersive event coverage, honoring culture, poetry, and community while turning every moment into a memorable story.",
      overviewChallenge:
        'Suli Day needed a cohesive visual identity that honored the depth of Kurdish culture and the legacy of the poet Nali, while resonating with modern audiences across social media, outdoor activations, and live event coverage.',
      overviewSolution:
        "We developed a full event branding system rooted in Kurdish heritage — from custom-illustrated stamps bearing Nali's portrait to traditional motif patterns, culturally rich typography, and immersive event content that captured the city's spirit.",
      overviewApproach: [
        "Deep cultural research into Nali's poetry and Sulaymaniyah's heritage",
        'Custom illustration system inspired by Kurdish stamps and traditional art',
        'Full social media content calendar for pre-event, live, and post-event phases',
        'On-ground event coverage with a dedicated photography and video team',
        'Branded collateral design for outdoor activations and stage backdrops',
      ],
      overviewDeliverables: [
        'Event visual identity system (logo, color palette, patterns)',
        'Custom Nali stamp illustration and branded poster series',
        'Social media content — posts, stories, and reels',
        'Event photography and videography coverage',
        'Stage and outdoor activation design assets',
        'Cultural program booklet and printed materials',
      ],
      testimonialQuote:
        'Agenz brought the soul of our city to life. Every visual, every post, every moment of coverage felt deeply rooted in who we are — a city of culture, poetry, and pride.',
      testimonialAuthor: 'Sulaymaniyah Governorate',
      testimonialRole: 'City Anniversary Committee',
      testimonialCompany: 'Sulaymaniyah, Kurdistan Region',
      relatedSlugs: ['galawezh-festival', 'bla-awards'],
      stats: [
        { label: 'Theme', value: 'Nali' },
        { label: 'Year', value: '2025' },
        { label: 'City', value: 'Sulaymaniyah' },
      ],
      gallery: Array.from({ length: 14 }, (_, i) => ({
        type: 'image' as const,
        src: `/images/works/sulaymaniyah-anniversary-2025/1 - ${i + 1}.webp`,
        alt: `Sulaymaniyah Anniversary 2025 — Image ${i + 1}`,
      })),
      results: [
        { metric: 'theme', value: 'Nali', label: 'Cultural Theme' },
        { metric: 'coverage', value: 'Full', label: 'Event Coverage' },
        { metric: 'assets', value: '50+', label: 'Assets Delivered' },
        { metric: 'city', value: 'Suli', label: 'City of Sulaymaniyah' },
      ],
    },
    {
      slug: 'galawezh-festival',
      category: 'event-branding',
      clientName: 'Galawezh International Festival',
      projectTitle: 'Galawezh Festival — Event Branding',
      year: '2024',
      accentColor: '#00e92c',
      thumbnailImage: '/images/works/galawezh-festival/160x120 px.webp',
      thumbnailAlt: 'Galawezh Festival — Event Branding',
      heroCoverImage: '/images/works/galawezh-festival/600x400 px.webp',
      heroTagline: 'Culturally Rooted Design for an Iconic Festival',
      heroDescription:
        "We crafted sleek, culturally rooted designs for Galawezh Festival, capturing the event's iconic spirit. The visuals honored its legacy while appealing to modern audiences — blending heritage motifs, bold typography, and a cohesive visual language that resonated across every touchpoint.",
      overviewChallenge:
        'Galawezh Festival needed a visual identity that honored its deep cultural roots while feeling fresh and compelling to modern audiences — a system that could translate across posters, digital media, stage design, and printed collateral.',
      overviewSolution:
        'We built a comprehensive event branding system that fused Kurdish heritage aesthetics with contemporary design principles. Rich calligraphy, botanical motifs, and earthy tones were woven into a cohesive identity that elevated every aspect of the festival experience.',
      overviewApproach: [
        "Cultural research into Galawezh Festival's history and visual heritage",
        'Development of a bilingual typographic system (Kurdish / Arabic / Latin)',
        'Custom illustration system drawing from botanical and calligraphic motifs',
        'Full asset suite covering print, digital, and environmental design',
        'Social media content designed for pre-event, live, and post-event phases',
      ],
      overviewDeliverables: [
        'Full event visual identity (logo, color palette, typography, patterns)',
        'Poster series and printed collateral',
        'Stage and environmental design assets',
        'Social media graphics and story templates',
        'Digital campaign assets',
      ],
      testimonialQuote:
        'Agenz gave Galawezh Festival a visual identity that felt both timeless and alive — deeply rooted in our culture yet bold enough to captivate a new generation of audiences.',
      testimonialAuthor: 'Galawezh International Festival',
      testimonialRole: 'Festival Committee',
      testimonialCompany: 'Galawezh Festival, 2024',
      relatedSlugs: ['sulaymaniyah-anniversary-2025', 'bla-awards'],
      stats: [
        { label: 'Theme', value: 'Cultural' },
        { label: 'Year', value: '2024' },
        { label: 'Scope', value: 'Branding' },
      ],
      gallery: [] as { type: 'image' | 'video'; src: string; alt?: string }[],
      results: [
        { metric: 'theme', value: 'Cultural', label: 'Heritage Theme' },
        { metric: 'scope', value: 'Full', label: 'Event Identity' },
        { metric: 'assets', value: '40+', label: 'Assets Delivered' },
        { metric: 'event', value: 'Festival', label: 'Event Branding' },
      ],
    },
    {
      slug: 'bla-awards',
      category: 'event-branding',
      clientName: 'BLA Awards',
      projectTitle: 'BLA Awards — Visual Identity & Branding',
      year: '2024',
      accentColor: '#00e92c',
      thumbnailImage: '/images/works/bla-awards/160x120 px.webp',
      thumbnailAlt: 'BLA Awards — Visual Identity & Branding',
      heroCoverImage: '/images/works/bla-awards/600x400 px.webp',
      heroTagline: 'Celebrating the Brilliance of Writers and Poets',
      heroDescription:
        'We crafted the visual identity and branding for the BLA Awards, celebrating the brilliance of renowned writers and poets. From elegant graphics to cohesive event design, our work highlighted the prestige, creativity, and inspiration of the literary world, turning each moment into a lasting impression.',
      overviewChallenge:
        'The BLA Awards needed a visual identity that conveyed literary prestige and artistic depth — an aesthetic that would resonate with writers, poets, and cultural institutions while feeling both timeless and contemporary.',
      overviewSolution:
        'We developed a cohesive branding system anchored in elegance and creative expression. Every element — from typography to graphic language — was crafted to reflect the prestige of literature and the vibrant energy of the awards ceremony.',
      overviewApproach: [
        'In-depth research into literary awards aesthetics and cultural references',
        'Custom visual identity system with logo, color palette, and typography',
        'Cohesive event design spanning stage, print, and digital touchpoints',
        'Branded collateral designed to elevate every moment of the ceremony',
      ],
      overviewDeliverables: [
        'Full visual identity system (logo, color palette, typography)',
        'Event branding and stage design assets',
        'Printed materials and ceremony collateral',
        'Digital graphics and social media templates',
      ],
      testimonialQuote:
        'Agenz transformed our vision into a visual language that truly honored the spirit of literature. The branding gave our awards ceremony the prestige and elegance it deserved.',
      testimonialAuthor: 'BLA Awards',
      testimonialRole: 'Awards Committee',
      testimonialCompany: 'BLA Awards, 2024',
      relatedSlugs: [] as string[],
      stats: [
        { label: 'Theme', value: 'Literary' },
        { label: 'Year', value: '2024' },
        { label: 'Scope', value: 'Branding' },
      ],
      gallery: [] as { type: 'image' | 'video'; src: string; alt?: string }[],
      results: [
        { metric: 'theme', value: 'Literary', label: 'Creative Theme' },
        { metric: 'scope', value: 'Full', label: 'Brand Identity' },
        { metric: 'assets', value: '30+', label: 'Assets Delivered' },
        { metric: 'event', value: 'Awards', label: 'Event Branding' },
      ],
    },
  ];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];

    await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        category: p.category,
        clientName: p.clientName,
        projectTitle: p.projectTitle,
        year: p.year,
        accentColor: p.accentColor,
        sortOrder: i,
        published: true,
        thumbnailImage: p.thumbnailImage,
        thumbnailAlt: p.thumbnailAlt,
        heroCoverImage: p.heroCoverImage,
        heroTagline: p.heroTagline,
        heroDescription: p.heroDescription,
        overviewChallenge: p.overviewChallenge,
        overviewSolution: p.overviewSolution,
        overviewApproach: p.overviewApproach,
        overviewDeliverables: p.overviewDeliverables,
        testimonialQuote: p.testimonialQuote,
        testimonialAuthor: p.testimonialAuthor,
        testimonialRole: p.testimonialRole,
        testimonialCompany: p.testimonialCompany,
        relatedSlugs: p.relatedSlugs,
        heroStats: {
          create: p.stats.map((s, j) => ({ label: s.label, value: s.value, sortOrder: j })),
        },
        galleryItems: {
          create: p.gallery.map((g, j) => ({
            type: g.type,
            src: g.src,
            alt: g.alt || null,
            sortOrder: j,
          })),
        },
        results: {
          create: p.results.map((r, j) => ({
            metric: r.metric,
            value: r.value,
            label: r.label,
            sortOrder: j,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${projects.length} portfolio projects`);

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
