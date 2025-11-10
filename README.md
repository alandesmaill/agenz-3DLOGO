# 3D Fractured Logo Navigation

An interactive 3D navigation system featuring a fractured logo that decomposes into floating navigation pieces with particle effects and smooth animations.

![Three.js](https://img.shields.io/badge/Three.js-v0.169.0-black?style=flat-square&logo=three.js)
![Next.js](https://img.shields.io/badge/Next.js-v14.2.21-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)

## ✨ Features

### 🎯 Interactive 3D Navigation
- **Fractured Logo System**: 99+ mesh pieces automatically categorized into 4 navigation sections
- **Smart Piece Detection**: Automatically identifies the 4 largest pieces by volume as navigation elements
- **Smooth Decomposition**: Logo explodes into floating navigation pieces on hover
- **Navigation Sections**: ABOUT, WORKS, SERVICES, CONTACT
- **Glow Effects**: Navigation pieces emit cyan glow on hover with bloom post-processing

### 🌌 Particle Assembly Animation
- **Z-Shape Formation**: 800 particles form the letter "Z" before morphing into the logo
- **Brand Colors**: Cyan (#00ffff) to green (#00e92c) gradient
- **Smooth Morphing**: 2.5-second transition from Z → logo shape
- **Optimized Performance**: BufferGeometry-based system for 60fps

### 📹 Cinematic Camera
- **Intro Animation**: Camera starts distant (z: 15) and zooms in over 3.5 seconds
- **Interactive Controls**: Orbit, zoom, and pan with smooth damping
- **Zoom Navigation**: Camera dives into navigation pieces on click
- **GSAP Animations**: Professional easing and timeline management

### 🎨 Visual Effects
- **Post-Processing**: Bloom and vignette effects for depth
- **Liquid Glass Labels**: Semi-transparent navigation overlays with improved readability
- **Loading Screen**: Circular progress ring with real-time percentage
- **Animated Background**: Gradient orbs, grid pattern, and floating particles

### ⚡ Performance Optimized
- **60fps Target**: Optimized for smooth performance on modern hardware
- **Reduced Motion Support**: Respects user accessibility preferences
- **Mobile Friendly**: Larger collision areas for touch interactions
- **Frame-Independent**: Uses delta time for consistent animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the interactive 3D scene.

## 📁 Project Structure

```
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── canvas/           # 3D/WebGL components
│   │   ├── Canvas.tsx    # ThreeJS canvas wrapper
│   │   ├── Scene.tsx     # Lights, camera, environment
│   │   ├── View.tsx      # Main 3D view orchestrator
│   │   ├── FracturedLogo.tsx      # Main interactive logo
│   │   └── ParticleAssembly.tsx   # Particle system
│   └── dom/              # React/DOM components
│       ├── AnimatedBackground.tsx # Background effects
│       ├── LoadingScreen.tsx      # Loading UI
│       ├── NavigationLabel.tsx    # 3D floating labels
│       └── TestSection.tsx        # Navigation destination
├── public/
│   └── models/
│       └── 3d-logo.glb   # Fractured logo 3D model
├── tests/                # Playwright performance tests
├── docs/                 # Documentation
│   ├── CLAUDE.md        # AI assistant guidelines
│   └── CHANGELOG.md     # Development history
└── [config files]
```

## 🎮 User Interaction Flow

1. **Initial Load**
   - Loading screen with animated progress
   - Camera zooms from distance
   - Particles form "Z" shape → morph into logo
   - Logo fades in with bounce effect

2. **Assembled State**
   - Logo rotates slowly (idle state)
   - Hover anywhere → triggers decomposition

3. **Decomposed State**
   - 4 navigation pieces float at target positions
   - 95+ debris pieces scatter in background
   - Hover navigation piece → scale + glow effect
   - Click navigation piece → camera zoom + section display

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** - React renderer for Three.js
- **[React Three Drei](https://github.com/pmndrs/drei)** - Helper components & utilities
- **[GSAP](https://greensock.com/gsap/)** - Professional animation library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Playwright](https://playwright.dev/)** - E2E testing & performance monitoring

## 📦 Key Dependencies

```json
{
  "three": "^0.169.0",
  "@react-three/fiber": "^8.18.0",
  "@react-three/drei": "^9.122.0",
  "@react-three/postprocessing": "^2.19.1",
  "gsap": "^3.12.5",
  "next": "14.2.21",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

## 🎨 Customization

### Change Brand Colors

In `components/canvas/ParticleAssembly.tsx`:
```typescript
const color = new THREE.Color();
color.lerpColors(
  new THREE.Color(0x00ffff), // Cyan
  new THREE.Color(0x00e92c), // Green
  progress
);
```

### Adjust Camera Position

In `components/canvas/Scene.tsx`:
```typescript
<PerspectiveCamera
  makeDefault
  position={[0, 0, 5]}  // Change camera position
  fov={75}              // Field of view
/>
```

### Modify Navigation Sections

In `components/canvas/FracturedLogo.tsx`:
```typescript
const NAV_SECTIONS = [
  { section: 'about', label: 'ABOUT', position: new THREE.Vector3(-1.1, 1.8, 2) },
  { section: 'works', label: 'WORKS', position: new THREE.Vector3(1.9, 1.8, 2) },
  { section: 'services', label: 'SERVICES', position: new THREE.Vector3(-1.1, 0.2, 2) },
  { section: 'contact', label: 'CONTACT', position: new THREE.Vector3(1.9, 0.2, 2) },
];
```

### Replace 3D Model

1. Place your `.glb` file in `/public/models/`
2. Update the path in `app/page.tsx`:
```typescript
<FracturedLogo
  path="/models/your-model.glb"
  // ... other props
/>
```

**Model Requirements:**
- Format: `.glb` or `.gltf`
- Must have at least 4 distinct mesh pieces
- Recommended: 50-150 mesh pieces for best effect

## 🧪 Testing

### Run Performance Tests
```bash
# Run in headed mode (recommended for accurate FPS)
npm run test:perf

# Run headless
npx playwright test
```

Performance tests verify:
- Loading & particle animation (target: 60fps avg)
- Idle logo rotation (target: 60fps avg)
- Decomposition animation (target: 55fps avg)
- Navigation hover with bloom (target: 55fps avg)
- Stress test with rapid interactions (target: 50fps avg)

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎯 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Requires WebGL 2.0 support

## 📚 Documentation

- **[docs/CLAUDE.md](docs/CLAUDE.md)** - Guidelines for AI-assisted development
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Detailed development history & optimizations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for the incredible 3D engine
- [Poimandres](https://pmnd.rs/) for React Three Fiber and Drei
- [GreenSock](https://greensock.com/) for GSAP animation library
- [Vercel](https://vercel.com/) for Next.js framework

---

**Built with Three.js, Next.js, React, GSAP, and WebGL**
