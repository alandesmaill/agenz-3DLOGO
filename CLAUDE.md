# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies (may need to fix npm cache permissions first)
- `npm run dev` - Start development server (opens at http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a **Three.js + Next.js + React** project using React Three Fiber for declarative 3D rendering and GSAP for animations. The primary feature is an **interactive 3D fractured logo navigation system**.

### Component Architecture

The project follows a strict separation between **3D/WebGL components** and **regular React components**:

- **`/components/canvas/`** - All Three.js components (must be client-side rendered)
- **`/components/dom/`** - Regular React/DOM components (HTML overlays, UI)
- **`/app/`** - Next.js 15 App Router pages

### Critical Three.js Pattern

All Three.js components MUST be marked with `'use client'` directive and follow this nesting hierarchy:

```tsx
<Canvas>           // React Three Fiber canvas wrapper
  <Scene>          // Contains camera, lights, controls, environment
    <Model />      // Or any 3D objects (meshes, groups, primitives)
    <FracturedLogo />
  </Scene>
</Canvas>
```

**Never** place 3D objects outside of `<Canvas>` - they require the R3F context.

### Core Component Responsibilities

- **Canvas** (`components/canvas/Canvas.tsx`) - Wraps ThreeCanvas with optimized WebGL settings (camera, antialiasing, pixel ratio). Camera defaults: position `[0, 0, 5]`, fov `75`, near `0.1`, far `1000`
- **Scene** (`components/canvas/Scene.tsx`) - Centralized lighting, camera controls (OrbitControls), and environment setup. Includes ambient, directional, point, and spot lights optimized for the fractured logo
- **View** (`components/canvas/View.tsx`) - High-level wrapper that connects 3D canvas with DOM overlays. Handles navigation hover labels and test section display
- **FracturedLogo** (`components/canvas/FracturedLogo.tsx`) - Main interactive component with automatic navigation piece detection
- **Model** (`components/canvas/Model.tsx`) - Generic GLTF/GLB loader with position, rotation, scale, and auto-rotation support
- **Cube** (`components/canvas/Cube.tsx`) - Example showing GSAP integration

### FracturedLogo Navigation System

The FracturedLogo component is the heart of the application. It implements a sophisticated 3D navigation system:

**Architecture:**
1. Loads a GLB model with 99+ fragmented pieces
2. Automatically identifies the 4 **largest pieces** by bounding box volume
3. Assigns these pieces to navigation sections: `about`, `works`, `services`, `contact`
4. Other pieces become decorative "debris"

**Interaction Flow:**
```
Assembled Logo (idle rotation)
  ↓ hover anywhere on logo
Decomposition Animation (pieces explode outward)
  ↓ 4 nav pieces move to z:2, debris scatters
Floating State (nav pieces float gently, debris faded)
  ↓ hover on nav piece
Highlight + Label (scale 1.3x, glow effect, show label)
  ↓ click nav piece
Camera Zoom Animation (dive into piece)
  ↓ piece scales 8x, canvas fades
Test Section Display (overlay with BACK button)
  ↓ click BACK
Page Reload (reset to assembled state)
```

**Key Props:**
- `path` - Path to GLB model (e.g., `/models/3d-logo.glb`)
- `onNavigationHover` - Callback for hover events (returns piece name, label, world position)
- `onNavigationClick` - Callback for click events (returns section name)

**State Management:**
- Uses `useState` for decomposition state and animation locks
- Navigation pieces stored with target positions, labels, and section assignments
- Debris pieces stored separately with original transforms

**Animation Patterns:**
- **GSAP** for triggered animations (decompose, hover, click-zoom)
- **useFrame** for continuous animations (idle rotation, floating motion)
- All animations respect `isAnimating` lock to prevent conflicts

### 3D Model Workflow

1. Place `.glb` or `.gltf` files in `/public/models/`
2. Import using the component: `<FracturedLogo path="/models/filename.glb" />`
3. Models are loaded via `useGLTF` hook from `@react-three/drei`
4. Optional: Call `useGLTF.preload('/models/filename.glb')` at component bottom

**Important:** The FracturedLogo expects a model with multiple mesh children. Each mesh will be treated as a separate piece. The component automatically calculates bounding box volumes to identify navigation pieces.

### Animation Patterns

Three animation approaches are used:

1. **useFrame animations** - Continuous animations that run every frame
   - Idle rotation when assembled
   - Floating motion when decomposed (sine wave + Y-rotation)
   - Access via `useFrame((state) => { ... })`

2. **GSAP timeline animations** - Complex multi-step sequences
   - Decomposition (nav pieces → target positions, debris → scatter)
   - Recomposition (all pieces → original positions)
   - Camera zoom (camera position, piece scale, fade out)

3. **GSAP interactive animations** - Single-step triggered animations
   - Hover scale/glow effects
   - Material property animations (emissiveIntensity, opacity)

**Animation Best Practices:**
- Use `setIsAnimating(true)` before GSAP timelines to prevent conflicts
- Always include `onComplete: () => setIsAnimating(false)` in timelines
- Target Three.js properties directly: `mesh.position`, `mesh.scale`, `mesh.rotation`
- Use negative delays (`'-=1.5'`) to overlap timeline steps

### DOM Overlay Components

- **NavigationLabel** (`components/dom/NavigationLabel.tsx`) - Floating labels that appear on navigation piece hover. Positioned using 3D-to-2D screen projection
- **TestSection** (`components/dom/TestSection.tsx`) - Full-screen overlay that displays section content after camera zoom. Includes BACK button for reset

Both components use fixed positioning and are rendered outside the Canvas but inside the View container.

### TypeScript Paths

The project uses `@/*` alias mapping to the root directory (configured in tsconfig.json). Always use `@/components/canvas` instead of relative imports.

### Webpack Configuration

`next.config.js` includes:
- Custom rule for GLTF/GLB files (`asset/resource` type)
- Three.js externalization on server side to prevent SSR issues
- Do not remove these configurations

### Styling

- **Tailwind CSS** for DOM elements/overlays
- **CSS variables** for theming (`--background`, `--foreground` in `app/globals.css`)
- Canvas styling: `width: 100%; height: 100vh;` for fullscreen
- DOM overlays use `fixed` positioning with high `z-index` (50+)

## Key Dependencies

- **three** (v0.169.0) - Core 3D engine
- **@react-three/fiber** (v8.18.0) - React reconciler for Three.js (provides Canvas, useFrame, useThree)
- **@react-three/drei** (v9.122.0) - Helper components (OrbitControls, Environment, PerspectiveCamera, useGLTF, etc.)
- **gsap** (v3.12.5) - Animation library for complex timelines
- **next** (v14.2.21) - React framework with App Router
- **@studio-freight/lenis** - Smooth scrolling (installed but not currently used)

## Common Modifications

**To add a new 3D object:**
1. Create component in `/components/canvas/`
2. Mark with `'use client'`
3. Export from `/components/canvas/index.ts`
4. Import in View.tsx and place inside `<Scene>`

**To adjust the 4 navigation pieces:**
Edit `NAV_SECTIONS` array in `FracturedLogo.tsx`:
```tsx
const NAV_SECTIONS = [
  { section: 'about', label: 'ABOUT', position: new THREE.Vector3(-1.5, 0.8, 2) },
  // ... modify positions, labels, or section names
];
```

**To adjust decomposition behavior:**
Modify the explosion calculation in `handleDecompose()` in `FracturedLogo.tsx`:
```tsx
const distance = 2 + Math.random() * 3; // Change min/max scatter distance
```

**To change floating animation:**
Edit the `useFrame` hook in `FracturedLogo.tsx`:
```tsx
const floatY = Math.sin(time * 0.8 + floatOffset) * 0.1; // Adjust speed/amplitude
```

**To adjust global lighting:**
Edit `components/canvas/Scene.tsx` - modify light intensities or add new lights

**To change camera settings:**
Edit `components/canvas/Canvas.tsx` camera prop (position, fov, near, far) or Scene.tsx PerspectiveCamera

**To modify background color:**
Edit `app/globals.css` CSS variables

## Performance Considerations

- Use `dpr={[1, 2]}` in Canvas to limit pixel ratio on high-DPI displays
- The FracturedLogo component handles 99+ meshes - optimize the source model before importing
- Consider using `useGLTF.preload()` for critical models to prevent loading flicker
- Debris pieces are faded (opacity 0.3-0.6) to focus attention on navigation pieces
- Remove Scene grid helper in production if not needed

## Debugging

**Console logs to expect:**
- `Found X meshes in the model` - Total mesh count
- `4 Largest pieces by volume: ...` - Auto-detected navigation pieces with volumes
- `Navigation pieces: 4, Debris pieces: X` - Confirmation of piece categorization
- `Navigating to: SECTION` - When clicking navigation pieces

**Common issues:**
- If navigation pieces aren't identified correctly, check that your GLB has at least 4 distinct meshes
- If decomposition doesn't trigger, verify the collision box size in the return JSX matches your model bounds
- If floating animation is jittery, ensure `isAnimating` is properly managed in all GSAP callbacks
