# Three.js + Next.js + React + GSAP + WebGL

A production-ready setup for creating interactive 3D experiences using Three.js with Next.js, React Three Fiber, and GSAP animations.

## Features

- **Next.js 15** with App Router
- **Three.js** for 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers and abstractions
- **GSAP** - Professional-grade animations
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **WebGL** optimized setup

## Getting Started

### 1. Fix NPM Permissions (If Needed)

If you encounter npm permission errors, run:

```bash
sudo chown -R 501:20 "/Users/mac1/.npm"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your 3D scene.

## Project Structure

```
├── app/
│   ├── page.tsx          # Main page with 3D scene
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── canvas/           # Three.js components
│   │   ├── Canvas.tsx    # Canvas wrapper
│   │   ├── Scene.tsx     # Scene with lights & controls
│   │   ├── Model.tsx     # 3D model loader
│   │   ├── Cube.tsx      # Example animated cube
│   │   └── index.ts      # Exports
│   └── dom/              # Regular React components
├── public/
│   └── models/           # Place your 3D models here (.glb, .gltf)
└── ...config files
```

## Adding 3D Models

### 1. Place Your Model

Add your `.glb` or `.gltf` files to the `/public/models/` folder.

Example:
```
/public/models/robot.glb
/public/models/car.gltf
```

### 2. Use the Model Component

In `app/page.tsx`:

```tsx
import { Canvas, Scene, Model } from '@/components/canvas';

export default function Home() {
  return (
    <Canvas>
      <Scene>
        <Model
          path="/models/robot.glb"
          position={[0, 0, 0]}
          scale={1}
          autoRotate={true}
        />
      </Scene>
    </Canvas>
  );
}
```

### Model Component Props

- `path` - Path to your model file (string)
- `position` - [x, y, z] coordinates (optional, default: [0, 0, 0])
- `rotation` - [x, y, z] rotation in radians (optional, default: [0, 0, 0])
- `scale` - Uniform scale number or [x, y, z] (optional, default: 1)
- `autoRotate` - Enable auto-rotation (optional, default: false)

## Components Overview

### Canvas
Wrapper for the Three.js canvas with optimized settings.

### Scene
Pre-configured scene with:
- Camera with orbit controls
- Multiple light sources (ambient, directional, point, spot)
- Environment lighting
- Grid helper

### Model
GLTF/GLB model loader with animation support.

### Cube
Example component showing GSAP animations and interactions.

## GSAP Integration

The `Cube.tsx` component demonstrates GSAP animations:

```tsx
import { gsap } from 'gsap';

// Animate on interaction
gsap.to(meshRef.current.scale, {
  x: 1.5,
  y: 1.5,
  z: 1.5,
  duration: 0.3,
  ease: 'back.out(1.7)',
});
```

## Camera Controls

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag (or two-finger drag)

## Customization

### Change Background Color

In `app/globals.css`:
```css
:root {
  --background: #0a0a0a; /* Change this */
}
```

### Adjust Camera

In `components/canvas/Canvas.tsx`:
```tsx
camera={{
  position: [0, 0, 5],  // Camera position
  fov: 75,              // Field of view
  near: 0.1,            // Near clipping plane
  far: 1000,            // Far clipping plane
}}
```

### Modify Lighting

Edit `components/canvas/Scene.tsx` to adjust lights.

## Where to Get 3D Models

- [Sketchfab](https://sketchfab.com/) - Free and paid models
- [Poly Pizza](https://poly.pizza/) - Free low-poly models
- [CGTrader](https://www.cgtrader.com/) - Professional models
- [TurboSquid](https://www.turbosquid.com/) - Premium models
- [Ready Player Me](https://readyplayer.me/) - Custom avatars

Make sure to use `.glb` or `.gltf` formats!

## Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Canvas not rendering
- Check browser console for errors
- Ensure all dependencies are installed
- Try clearing `.next` folder: `rm -rf .next`

### Model not loading
- Verify the file path is correct
- Check the model is in `/public/models/`
- Ensure the file format is `.glb` or `.gltf`

### Performance issues
- Reduce model complexity
- Optimize textures
- Use `dpr={[1, 2]}` in Canvas to limit pixel ratio
- Enable shadows selectively

## Learn More

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [React Three Drei](https://github.com/pmndrs/drei)
- [GSAP Documentation](https://greensock.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

Built with Three.js, Next.js, React, GSAP, and WebGL
