const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'works-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix all broken escaped paths
content = content.replace(/'\\/images\\/works\\/\\1\.jpg\.svg(?:\.svg)?'/g, 'PLACEHOLDER');

// Now fix them properly by project
const fixes = [
  // TechFlow
  { search: /thumbnails\/PLACEHOLDER',\s+alt: 'TechFlow/g, replace: "thumbnails/techflow.jpg.svg',\n      alt: 'TechFlow" },
  { search: /hero\/PLACEHOLDER',\s+tagline: 'From Generic/g, replace: "hero/techflow-hero.jpg.svg',\n      tagline: 'From Generic" },
  { search: /beforeImage: 'PLACEHOLDER',\s+afterImage: 'PLACEHOLDER',\s+description: 'Transformation from a generic/g, replace: "beforeImage: '/images/works/before-after/techflow-before.jpg.svg',\n      afterImage: '/images/works/before-after/techflow-after.jpg.svg',\n      description: 'Transformation from a generic" },
  { search: /gallery\/PLACEHOLDER', alt: 'TechFlow logo variants/g, replace: "gallery/techflow-1.jpg.svg', alt: 'TechFlow logo variants" },
  { search: /gallery\/PLACEHOLDER', alt: 'Brand color system/g, replace: "gallery/techflow-2.jpg.svg', alt: 'Brand color system" },
  { search: /gallery\/PLACEHOLDER', alt: 'Typography specimens/g, replace: "gallery/techflow-3.jpg.svg', alt: 'Typography specimens" },
  { search: /gallery\/PLACEHOLDER', alt: 'Business card designs/g, replace: "gallery/techflow-4.jpg.svg', alt: 'Business card designs" },
  { search: /gallery\/PLACEHOLDER', alt: 'Presentation templates/g, replace: "gallery/techflow-5.jpg.svg', alt: 'Presentation templates" },
  { search: /gallery\/PLACEHOLDER', alt: 'Social media mockups/g, replace: "gallery/techflow-6.jpg.svg', alt: 'Social media mockups" },

  // Organics
  { search: /thumbnails\/PLACEHOLDER',\s+alt: 'Organics/g, replace: "thumbnails/organics.jpg.svg',\n      alt: 'Organics" },
  { search: /hero\/PLACEHOLDER',\s+tagline: 'Elevating/g, replace: "hero/organics-hero.jpg.svg',\n      tagline: 'Elevating" },
  { search: /beforeImage: 'PLACEHOLDER',\s+afterImage: 'PLACEHOLDER',\s+description: 'From cluttered/g, replace: "beforeImage: '/images/works/before-after/organics-before.jpg.svg',\n      afterImage: '/images/works/before-after/organics-after.jpg.svg',\n      description: 'From cluttered" },
  { search: /gallery\/PLACEHOLDER', alt: 'Product lineup/g, replace: "gallery/organics-1.jpg.svg', alt: 'Product lineup" },
  { search: /gallery\/PLACEHOLDER', alt: 'Botanical illustrations/g, replace: "gallery/organics-2.jpg.svg', alt: 'Botanical illustrations" },
  { search: /gallery\/PLACEHOLDER', alt: 'Packaging details/g, replace: "gallery/organics-3.jpg.svg', alt: 'Packaging details" },
  { search: /gallery\/PLACEHOLDER', alt: 'Retail shelf mockup/g, replace: "gallery/organics-4.jpg.svg', alt: 'Retail shelf mockup" },
  { search: /gallery\/PLACEHOLDER', alt: 'Unboxing experience/g, replace: "gallery/organics-5.jpg.svg', alt: 'Unboxing experience" },
  { search: /gallery\/PLACEHOLDER', alt: 'Label closeups/g, replace: "gallery/organics-6.jpg.svg', alt: 'Label closeups" },

  // Luxe
  { search: /thumbnails\/PLACEHOLDER',\s+alt: 'Luxe/g, replace: "thumbnails/luxe.jpg.svg',\n      alt: 'Luxe" },
  { search: /hero\/PLACEHOLDER',\s+tagline: 'Attracting/g, replace: "hero/luxe-hero.jpg.svg',\n      tagline: 'Attracting" },
  { search: /gallery\/PLACEHOLDER', alt: 'Instagram grid preview/g, replace: "gallery/luxe-1.jpg.svg', alt: 'Instagram grid preview" },
  { search: /gallery\/PLACEHOLDER', alt: 'Story highlights/g, replace: "gallery/luxe-2.jpg.svg', alt: 'Story highlights" },
  { search: /thumbnail: 'PLACEHOLDER' }/g, replace: "thumbnail: '/images/works/gallery/luxe-3.jpg.svg' }" },
  { search: /gallery\/PLACEHOLDER', alt: 'Influencer content/g, replace: "gallery/luxe-4.jpg.svg', alt: 'Influencer content" },
  { search: /gallery\/PLACEHOLDER', alt: 'Behind the scenes/g, replace: "gallery/luxe-5.jpg.svg', alt: 'Behind the scenes" },
  { search: /gallery\/PLACEHOLDER', alt: 'Guest testimonials/g, replace: "gallery/luxe-6.jpg.svg', alt: 'Guest testimonials" },

  // StartupXYZ
  { search: /thumbnails\/PLACEHOLDER',\s+alt: 'StartupXYZ/g, replace: "thumbnails/startupxyz.jpg.svg',\n      alt: 'StartupXYZ" },
  { search: /hero\/PLACEHOLDER',\s+tagline: 'From Zero/g, replace: "hero/startupxyz-hero.jpg.svg',\n      tagline: 'From Zero" },
  { search: /gallery\/PLACEHOLDER', alt: 'LinkedIn ad creative/g, replace: "gallery/startupxyz-1.jpg.svg', alt: 'LinkedIn ad creative" },
  { search: /gallery\/PLACEHOLDER', alt: 'Webinar promotion/g, replace: "gallery/startupxyz-2.jpg.svg', alt: 'Webinar promotion" },
  { search: /gallery\/PLACEHOLDER', alt: 'Thought leadership posts/g, replace: "gallery/startupxyz-3.jpg.svg', alt: 'Thought leadership posts" },
  { search: /gallery\/PLACEHOLDER', alt: 'Email campaigns/g, replace: "gallery/startupxyz-5.jpg.svg', alt: 'Email campaigns" },
  { search: /gallery\/PLACEHOLDER', alt: 'Analytics dashboard/g, replace: "gallery/startupxyz-6.jpg.svg', alt: 'Analytics dashboard" },

  // Regional Auto
  { search: /thumbnails\/PLACEHOLDER',\s+alt: 'Regional/g, replace: "thumbnails/regional-auto.jpg.svg',\n      alt: 'Regional" },
  { search: /hero\/PLACEHOLDER',\s+tagline: 'Driving/g, replace: "hero/regional-auto-hero.jpg.svg',\n      tagline: 'Driving" },
  { search: /gallery\/PLACEHOLDER', alt: 'Radio campaign assets/g, replace: "gallery/regional-auto-2.jpg.svg', alt: 'Radio campaign assets" },
  { search: /gallery\/PLACEHOLDER', alt: 'Digital ad creative/g, replace: "gallery/regional-auto-3.jpg.svg', alt: 'Digital ad creative" },
  { search: /gallery\/PLACEHOLDER', alt: 'Geo-fence map/g, replace: "gallery/regional-auto-4.jpg.svg', alt: 'Geo-fence map" },
  { search: /gallery\/PLACEHOLDER', alt: 'Attribution dashboard/g, replace: "gallery/regional-auto-5.jpg.svg', alt: 'Attribution dashboard" },
  { search: /gallery\/PLACEHOLDER', alt: 'Showroom traffic data/g, replace: "gallery/regional-auto-6.jpg.svg', alt: 'Showroom traffic data" },

  // Cascade
  { search: /thumbnails\/PLACEHOLDER',\s+alt: 'Cascade/g, replace: "thumbnails/cascade.jpg.svg',\n      alt: 'Cascade" },
  { search: /hero\/PLACEHOLDER',\s+tagline: 'Capturing/g, replace: "hero/cascade-hero.jpg.svg',\n      tagline: 'Capturing" },
  { search: /gallery\/PLACEHOLDER', alt: 'Aerial drone shots/g, replace: "gallery/cascade-2.jpg.svg', alt: 'Aerial drone shots" },
  { search: /gallery\/PLACEHOLDER', alt: 'Artist performances/g, replace: "gallery/cascade-3.jpg.svg', alt: 'Artist performances" },
  { search: /gallery\/PLACEHOLDER', alt: 'Crowd energy/g, replace: "gallery/cascade-4.jpg.svg', alt: 'Crowd energy" },
  { search: /gallery\/PLACEHOLDER', alt: 'Behind the scenes/g, replace: "gallery/cascade-5.jpg.svg', alt: 'Behind the scenes" },
  { search: /gallery\/PLACEHOLDER', alt: 'Festival atmosphere/g, replace: "gallery/cascade-6.jpg.svg', alt: 'Festival atmosphere" },

  // EcoTech
  { search: /thumbnails\/PLACEHOLDER',\s+alt: 'EcoTech/g, replace: "thumbnails/ecotech.jpg.svg',\n      alt: 'EcoTech" },
  { search: /hero\/PLACEHOLDER',\s+tagline: 'Simplifying/g, replace: "hero/ecotech-hero.jpg.svg',\n      tagline: 'Simplifying" },
  { search: /gallery\/PLACEHOLDER', alt: 'Motion graphics stills/g, replace: "gallery/ecotech-3.jpg.svg', alt: 'Motion graphics stills" },
  { search: /gallery\/PLACEHOLDER', alt: 'Customer testimonials/g, replace: "gallery/ecotech-4.jpg.svg', alt: 'Customer testimonials" },
  { search: /gallery\/PLACEHOLDER', alt: 'Installation footage/g, replace: "gallery/ecotech-5.jpg.svg', alt: 'Installation footage" },
  { search: /gallery\/PLACEHOLDER', alt: 'Animated diagrams/g, replace: "gallery/ecotech-6.jpg.svg', alt: 'Animated diagrams" },
];

// Fix video thumbnails separately (they appear twice in content)
content = content.replace(/thumbnail: 'PLACEHOLDER'/g, "thumbnail: '/images/works/gallery/video-thumb.jpg.svg'");

// Apply all fixes
fixes.forEach(fix => {
  content = content.replace(fix.search, fix.replace);
});

// Fix any remaining PLACEHOLDER with a generic fallback
content = content.replace(/PLACEHOLDER/g, "'/images/works/thumbnails/placeholder.jpg.svg'");

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed all image paths in works-data.ts');
