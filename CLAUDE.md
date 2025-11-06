# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies (may need to fix npm cache permissions first)
- `npm run dev` - Start development server (opens at http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a **Three.js + Next.js + React** project using React Three Fiber for declarative 3D rendering and GSAP for animations.

### Component Architecture

The project follows a strict separation between **3D/WebGL components** and **regular React components**:

- **`/components/canvas/`** - All Three.js components (must be client-side rendered)
- **`/components/dom/`** - Regular React/DOM components
- **`/app/`** - Next.js 15 App Router pages

### Critical Three.js Pattern

All Three.js components MUST be marked with `'use client'` directive and follow this nesting hierarchy:

```tsx
<Canvas>           // React Three Fiber canvas wrapper
  <Scene>          // Contains camera, lights, controls, environment
    <Model />      // Or any 3D objects (meshes, groups, primitives)
    <Cube />
  </Scene>
</Canvas>
```

**Never** place 3D objects outside of `<Canvas>` - they require the R3F context.

### Component Responsibilities

- **Canvas** (`components/canvas/Canvas.tsx`) - Wraps ThreeCanvas with optimized WebGL settings (camera, antialiasing, pixel ratio)
- **Scene** (`components/canvas/Scene.tsx`) - Centralized lighting, camera controls (OrbitControls), and environment setup. Modify this file to adjust lighting or camera behavior globally
- **Model** (`components/canvas/Model.tsx`) - Loads GLTF/GLB files using `useGLTF` hook. Supports position, rotation, scale, and auto-rotation
- **Cube** (`components/canvas/Cube.tsx`) - Example showing GSAP integration with Three.js (hover/click animations)

### 3D Model Workflow

1. Place `.glb` or `.gltf` files in `/public/models/`
2. Import and use the Model component with the path: `/models/filename.glb`
3. Models are loaded via `useGLTF` hook from `@react-three/drei`
4. Optional: Call `useGLTF.preload('/models/filename.glb')` to preload models

### Animation Patterns

Two animation approaches are used:

1. **Three.js animations** - Use `useFrame` hook from `@react-three/fiber` for continuous animations (see Model.tsx rotation)
2. **GSAP animations** - Use for interactive/triggered animations (see Cube.tsx click/hover handlers)

GSAP targets Three.js object properties (position, scale, rotation) directly via refs.

### TypeScript Paths

The project uses `@/*` alias mapping to the root directory (configured in tsconfig.json). Use `@/components/canvas` instead of relative imports.

### Webpack Configuration

`next.config.js` includes custom webpack rules to handle GLTF/GLB files via file-loader. Do not remove this configuration.

### Styling

- Tailwind CSS for DOM elements/overlays
- CSS variables for theming (`--background`, `--foreground` in globals.css)
- Canvas is always fullscreen via CSS: `width: 100%; height: 100vh; overflow: hidden`

## Key Dependencies

- **three** - Core 3D engine
- **@react-three/fiber** - React reconciler for Three.js (provides Canvas, useFrame, etc.)
- **@react-three/drei** - Helper components (OrbitControls, Environment, PerspectiveCamera, useGLTF, etc.)
- **gsap** - Animation library
- **@studio-freight/lenis** - Smooth scrolling (installed but not currently used)

## Common Modifications

**To add a new 3D object:**
1. Create component in `/components/canvas/`
2. Mark with `'use client'`
3. Export from `/components/canvas/index.ts`
4. Use inside `<Scene>` in `app/page.tsx`

**To adjust global lighting:**
Edit `components/canvas/Scene.tsx` - modify existing lights or add new ones

**To change camera settings:**
Edit `components/canvas/Canvas.tsx` camera prop (position, fov, near, far)

**To modify background color:**
Edit `app/globals.css` CSS variables

## Performance Considerations

- Use `dpr={[1, 2]}` in Canvas to limit pixel ratio on high-DPI displays
- Optimize model complexity and texture sizes before importing
- Consider using `useGLTF.preload()` for critical models
- The Scene component includes a grid helper - remove in production if not needed
