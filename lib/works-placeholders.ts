// CSS gradient placeholders for Works section
// Brand colors: cyan (#00ffff), green (#00e92c)
// Additional accent colors from portfolio items

export const worksGradients = {
  'techflow-pro': {
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gallery: [
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    ],
  },
  'momentum-brands': {
    hero: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    gallery: [
      'linear-gradient(135deg, #FFD26F 0%, #3677FF 100%)',
      'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
      'linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)',
    ],
  },
  'aurora-lifestyle': {
    hero: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    gallery: [
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    ],
  },
  'revolution-campaign': {
    hero: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    gallery: [
      'linear-gradient(135deg, #a044ff 0%, #6a3093 100%)',
      'linear-gradient(135deg, #184e68 0%, #57ca85 100%)',
      'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
    ],
  },
  'pinnacle-stories': {
    hero: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    gallery: [
      'linear-gradient(135deg, #e3ffe7 0%, #d9e7ff 100%)',
      'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    ],
  },
  'velocity-films': {
    hero: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
    gallery: [
      'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
      'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
      'linear-gradient(135deg, #feada6 0%, #f5efef 100%)',
    ],
  },
};

// Category-based gradients for fallback
export const categoryGradients = {
  'brand-identity': 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
  'digital-campaigns': 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
  'video-production': 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
};

// Helper function to get gradient by project ID
export function getProjectGradient(projectId: string, type: 'hero' | 'gallery' = 'hero', index?: number): string {
  const project = worksGradients[projectId as keyof typeof worksGradients];

  if (!project) {
    // Fallback to default gradient
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  if (type === 'hero') {
    return project.hero;
  }

  if (type === 'gallery' && index !== undefined) {
    return project.gallery[index % project.gallery.length];
  }

  return project.hero;
}
