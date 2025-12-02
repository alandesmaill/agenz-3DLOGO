/**
 * Generate placeholder images for the Works/Portfolio section
 *
 * Run with: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Portfolio project data with accent colors
const projects = [
  { id: 'techflow', name: 'TechFlow', color: '#00ffff' },
  { id: 'organics', name: 'Organics Co.', color: '#00e92c' },
  { id: 'luxe', name: 'Luxe Hotels', color: '#00d4aa' },
  { id: 'startupxyz', name: 'StartupXYZ', color: '#00b8ff' },
  { id: 'regional-auto', name: 'Regional Auto', color: '#00ffff' },
  { id: 'cascade', name: 'Cascade Festival', color: '#00e92c' },
  { id: 'ecotech', name: 'EcoTech', color: '#00d4aa' },
];

// Create SVG placeholder image
function createSVG(width, height, color, text, subtext = '') {
  const gradient1 = adjustColor(color, 20);
  const gradient2 = adjustColor(color, -20);

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradient1};stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:${gradient2};stop-opacity:0.8" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  ${subtext ? `<text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.7">${subtext}</text>` : ''}
</svg>`;
}

// Adjust hex color brightness
function adjustColor(color, amount) {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

// Main generation function
function generatePlaceholders() {
  const baseDir = path.join(__dirname, '..', 'public', 'images', 'works');

  // Create directory structure
  ensureDir(path.join(baseDir, 'thumbnails'));
  ensureDir(path.join(baseDir, 'hero'));
  ensureDir(path.join(baseDir, 'gallery'));
  ensureDir(path.join(baseDir, 'before-after'));

  let count = 0;

  // Generate thumbnails (500×600px)
  projects.forEach(project => {
    const svg = createSVG(500, 600, project.color, project.name, 'Thumbnail');
    fs.writeFileSync(
      path.join(baseDir, 'thumbnails', `${project.id}.jpg.svg`),
      svg
    );
    count++;
  });
  console.log(`✓ Generated ${projects.length} thumbnails`);

  // Generate hero images (1920×1080px)
  projects.forEach(project => {
    const svg = createSVG(1920, 1080, project.color, project.name, 'Hero Image');
    fs.writeFileSync(
      path.join(baseDir, 'hero', `${project.id}-hero.jpg.svg`),
      svg
    );
    count++;
  });
  console.log(`✓ Generated ${projects.length} hero images`);

  // Generate gallery images (1200×800px, 6 per project)
  projects.forEach(project => {
    for (let i = 1; i <= 6; i++) {
      const svg = createSVG(1200, 800, project.color, project.name, `Gallery ${i}`);
      fs.writeFileSync(
        path.join(baseDir, 'gallery', `${project.id}-${i}.jpg.svg`),
        svg
      );
      count++;
    }
  });
  console.log(`✓ Generated ${projects.length * 6} gallery images`);

  // Generate before/after images (1200×800px)
  const beforeAfterProjects = ['techflow', 'organics'];
  beforeAfterProjects.forEach(projectId => {
    const project = projects.find(p => p.id === projectId);

    // Before image
    const beforeSvg = createSVG(1200, 800, project.color, project.name, 'Before');
    fs.writeFileSync(
      path.join(baseDir, 'before-after', `${projectId}-before.jpg.svg`),
      beforeSvg
    );
    count++;

    // After image
    const afterColor = adjustColor(project.color, 40);
    const afterSvg = createSVG(1200, 800, afterColor, project.name, 'After');
    fs.writeFileSync(
      path.join(baseDir, 'before-after', `${projectId}-after.jpg.svg`),
      afterSvg
    );
    count++;
  });
  console.log(`✓ Generated ${beforeAfterProjects.length * 2} before/after images`);

  console.log(`\n✅ Total: ${count} placeholder images generated!`);
  console.log(`📁 Location: ${baseDir}`);
  console.log(`\n⚠️  Note: SVG files created with .jpg.svg extension`);
  console.log(`   Next.js will serve them as images automatically.`);
}

// Run generation
try {
  generatePlaceholders();
} catch (error) {
  console.error('❌ Error generating placeholders:', error);
  process.exit(1);
}
