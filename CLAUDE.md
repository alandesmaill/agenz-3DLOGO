# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Production build
npm start               # Start production server
npm run lint            # Run ESLint
npm run test:perf       # Run Playwright performance tests (headless)
npm run test:perf:headed  # Run performance tests with visible browser (more accurate)
npm run test:perf:report  # View HTML report from last test run
```

## Architecture Overview

This is a **Three.js + Next.js + React Three Fiber + GSAP** project featuring an interactive 3D fractured logo navigation system. The core pattern separates WebGL/3D components from regular React/DOM components for optimal rendering.

### Component Architecture

**Strict Separation Pattern:**
- **`/components/canvas/`** - All Three.js/WebGL components (client-side only, marked with `'use client'`)
- **`/components/dom/`** - Regular React/DOM components (HTML overlays, UI elements)
- **`/app/`** - Next.js 14 App Router pages

### Critical Three.js Rendering Pattern

All 3D components MUST follow this nesting hierarchy:

```tsx
<Canvas>           // React Three Fiber canvas wrapper (components/canvas/Canvas.tsx)
  <Scene>          // Contains camera, lights, controls, environment, post-processing
    <FracturedLogo />  // 3D objects/meshes/groups
    <Other3DObjects />
  </Scene>
</Canvas>
```

**Never** place 3D meshes outside `<Canvas>` - they require the R3F rendering context.

### Core Component Responsibilities

#### Canvas Components (3D/WebGL)

- **Canvas** (`components/canvas/Canvas.tsx`)
  - Wraps `@react-three/fiber`'s ThreeCanvas with optimized WebGL settings
  - Responsive camera settings (mobile/tablet/desktop)
  - Default camera: `position: [0, 0, 5]`, `fov: 75`
  - Power preference: `high-performance`, antialiasing enabled, `dpr: [1, 2]`

- **Scene** (`components/canvas/Scene.tsx`)
  - Centralized lighting setup (ambient + 2 directional lights + environment)
  - OrbitControls with target `[0.4, 1, 0]` and damping enabled
  - PerspectiveCamera configuration
  - Post-processing effects via EffectComposer (Bloom + Vignette)
  - **Bloom settings**: intensity `0.15`, threshold `0.95`, height `100` (optimized for performance and comfort)

- **View** (`components/canvas/View.tsx`)
  - High-level orchestrator connecting 3D canvas with DOM overlays
  - Manages loading progress via `useProgress` hook from `@react-three/drei`
  - Handles navigation hover callbacks (3D → DOM label positioning)
  - Handles navigation click callbacks (camera zoom → section display)
  - Responsive logo scaling based on viewport size

- **FracturedLogo** (`components/canvas/FracturedLogo.tsx`)
  - Main interactive component - loads fractured GLB model with 99+ pieces
  - **Automatic Navigation Detection**: Identifies 4 largest pieces by bounding box volume
  - **State Machine**: Assembled → Decomposed → Floating → Hover/Click interactions
  - **Animation System**: GSAP for triggered animations, useFrame for continuous motion
  - **Navigation Sections**: Maps to `about`, `works`, `services`, `contact`
  - Debris pieces (non-navigation) scatter randomly and fade during decomposition

#### DOM Components (HTML/CSS)

- **LoadingScreen** (`components/dom/LoadingScreen.tsx`)
  - Circular progress ring with percentage counter (0-100%)
  - Animated gradient from brand colors (cyan → green)
  - Fades out when loading completes

- **NavigationLabel** (`components/dom/NavigationLabel.tsx`)
  - Floating labels that appear on navigation piece hover
  - Positioned using 3D-to-2D screen projection from world coordinates
  - "Liquid glass" effect with semi-transparent background

- **TestSection** (`components/dom/TestSection.tsx`)
  - Full-screen overlay for section content after camera zoom
  - Includes BACK button that reloads page to reset 3D scene

- **AnimatedBackground** (`components/dom/AnimatedBackground.tsx`)
  - Multi-layer background with gradient orbs, grid pattern, floating particles

### FracturedLogo Navigation System - Deep Dive

**The heart of this application** - implements automatic piece detection and 3D navigation:

#### Architecture Flow

1. **Load & Analyze**: GLB model loaded via `useGLTF`, meshes extracted via `scene.traverse()`
2. **Volume Calculation**: Each mesh's bounding box volume computed (width × height × depth × scale)
3. **Auto-Categorization**: Top 4 pieces by volume → navigation, rest → debris
4. **Assignment**: Navigation pieces mapped to sections in order of size (largest = about, etc.)

#### State Management

```typescript
navigationPieces[]  // 4 pieces with targetPosition, label, section
debrisPieces[]      // 95+ pieces with original transforms
isDecomposed        // false (assembled) | true (exploded)
isAnimating         // Animation lock to prevent conflicts
```

#### Interaction Flow

```
Assembled State (idle rotation via useFrame)
  ↓ onPointerEnter on global collision box
Decompose Animation (GSAP timelines)
  - Nav pieces → target positions (z: 2, front of camera)
  - Group scale 1.5 → 1.0 (keeps nav pieces same visual size)
  - Debris scatter randomly with fade (opacity 0.3-0.6)
  ↓ animation completes (1.5s)
Floating State (useFrame sine wave motion)
  ↓ onPointerEnter on nav piece collision box
Hover Effect (scale 1.8 → 2.0, emissive glow 0 → 0.5)
  ↓ onClick on nav piece
Camera Zoom Animation (GSAP timeline)
  - Camera → piece position
  - Piece scale → 8x
  - Canvas fade out
  ↓ onComplete callback
Section Display (TestSection component renders)
  ↓ click BACK button
Page Reload (window.location.reload)
```

#### Key Props & Callbacks

```typescript
<FracturedLogo
  path="/models/3d-logo.glb"  // GLB model path
  position={[0, 0, 0]}         // Group position
  scale={1.2}                  // Base scale (responsive)
  onNavigationHover={(piece, label, screenPos) => {}}  // 3D → 2D positioning
  onNavigationClick={(section) => {}}  // Navigate to section
/>
```

#### Navigation Section Configuration

Located in `FracturedLogo.tsx`:

```typescript
const NAV_SECTIONS = [
  { section: 'about', label: 'ABOUT', position: new THREE.Vector3(-1.1, 1.8, 2) },
  { section: 'works', label: 'WORKS', position: new THREE.Vector3(1.9, 1.8, 2) },
  { section: 'services', label: 'SERVICES', position: new THREE.Vector3(-1.1, 0.2, 2) },
  { section: 'contact', label: 'CONTACT', position: new THREE.Vector3(1.9, 0.2, 2) },
];
```

### Animation Patterns

Three distinct animation approaches are used:

#### 1. GSAP Timeline Animations (Triggered Sequences)

Used for multi-step choreographed animations:

```typescript
const timeline = gsap.timeline({
  onStart: () => setIsAnimating(true),
  onComplete: () => setIsAnimating(false)
});

timeline
  .to(camera.position, { x: 0, y: 0, z: 5, duration: 3.5 })
  .to(mesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1.0 }, '-=1.5'); // Overlap
```

**Tracked for cleanup**: All timelines/tweens pushed to `timelinesRef.current[]` and killed on unmount.

#### 2. GSAP Single Tweens (Interactive)

Used for hover effects, material changes:

```typescript
gsap.to(mesh.material, {
  emissiveIntensity: 0.5,
  duration: 0.3,
  ease: 'power2.out'
});
```

#### 3. useFrame Continuous Animation (Every Frame)

Used for idle rotation, floating motion:

```typescript
useFrame((state, delta) => {
  if (!isAnimating) {
    mesh.rotation.y += delta * 0.02; // Frame-rate independent
    const floatY = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
    mesh.position.y = targetY + floatY;
  }
});
```

### Performance Optimizations

- **Frame-rate independence**: All animations use `delta` time
- **Animation cleanup**: GSAP timelines/tweens tracked and killed on unmount
- **Reduced motion support**: Checks `prefers-reduced-motion` media query
- **Mobile optimizations**: Larger collision areas (`collisionScale`), responsive camera/scale
- **Efficient lighting**: Simplified to 3 lights + environment map
- **Post-processing optimization**: Bloom quality reduced to `height: 100`, mipmapBlur enabled
- **Geometry reuse**: BufferGeometry for particles, single bounding box calculation

### 3D Model Requirements

**Current Model**: `/public/models/3d-logo.glb`

Requirements for replacement models:
- Format: `.glb` or `.gltf`
- **Minimum 4 distinct meshes** (for navigation detection)
- Recommended: 50-150 mesh pieces for visual impact
- Size: Keep under 5MB for fast loading
- Origin: Centered at (0, 0, 0)

**Loading Pattern**:
```typescript
const { scene } = useGLTF(path);
// ... work with scene.clone() to avoid mutations
useGLTF.preload('/models/filename.glb'); // Optional: preload at end of file
```

### TypeScript Path Aliases

`tsconfig.json` configures `@/*` to map to root directory:

```typescript
import { Canvas, Scene } from '@/components/canvas';  // ✅ Preferred
import { Canvas } from '../components/canvas';        // ❌ Avoid
```

### Next.js Configuration

`next.config.js` includes critical webpack config:

```javascript
// GLTF/GLB asset handling
config.module.rules.push({
  test: /\.(glb|gltf)$/,
  type: 'asset/resource',
});

// Prevent Three.js SSR issues
if (isServer) {
  config.externals.push('three');
}
```

**Do not remove these configurations** - they prevent build errors.

### Dynamic Imports & SSR

All 3D components are client-side only. Main page uses dynamic import:

```typescript
const View = dynamic(() => import('@/components/canvas/View'), {
  ssr: false,  // Disable server-side rendering
});
```

### Loading & Progress Management

Loading progress tracked via `@react-three/drei`'s `useProgress` hook:

```typescript
import { useProgress } from '@react-three/drei';

function LoadingManager({ onProgress }) {
  const { progress } = useProgress(); // 0-100
  useEffect(() => onProgress(progress), [progress]);
  return null;
}

// Inside Canvas/Suspense:
<Suspense fallback={null}>
  <LoadingManager onProgress={setLoadingProgress} />
  <Scene>...</Scene>
</Suspense>
```

LoadingScreen component displays until `progress >= 100`, then fades out.

## Common Modifications

### Add New 3D Object

1. Create component in `/components/canvas/NewObject.tsx`
2. Mark with `'use client'` directive
3. Export from `/components/canvas/index.ts`
4. Import in View.tsx and place inside `<Scene>`

```typescript
// components/canvas/NewObject.tsx
'use client';
export default function NewObject() {
  return <mesh>...</mesh>;
}

// components/canvas/index.ts
export { default as NewObject } from './NewObject';

// components/canvas/View.tsx
<Scene>
  <FracturedLogo {...props} />
  <NewObject />
</Scene>
```

### Adjust Navigation Piece Positions

Edit `NAV_SECTIONS` in `FracturedLogo.tsx`:

```typescript
const NAV_SECTIONS = [
  { section: 'about', label: 'ABOUT', position: new THREE.Vector3(-2, 2, 2) },
  // ... modify x, y, z coordinates
];
```

### Change Debris Scatter Behavior

Modify explosion calculation in `handleDecompose()`:

```typescript
const angle = Math.random() * Math.PI * 2;
const distance = 2 + Math.random() * 3;  // Change min/max distance
const height = (Math.random() - 0.5) * 2; // Change vertical spread
```

### Adjust Floating Animation Speed/Amplitude

Edit `useFrame` hook in `FracturedLogo.tsx`:

```typescript
const floatY = Math.sin(time * 0.8 + floatOffset) * 0.1;
//                         ↑ speed     ↑ amplitude
```

### Modify Camera Intro Animation

Edit camera animation in `FracturedLogo.tsx` `useEffect`:

```typescript
camera.position.set(0, 2, 15); // Start position
gsap.to(camera.position, {
  x: originalCameraPos.x,
  y: originalCameraPos.y,
  z: originalCameraPos.z,
  duration: 3.5,  // Change duration
  ease: 'power2.inOut',  // Change easing
});
```

### Change Post-Processing Effects

Edit `Scene.tsx` EffectComposer:

```typescript
<Bloom
  intensity={0.15}      // Glow strength
  luminanceThreshold={0.95}  // What glows (0-1)
  height={100}          // Quality (lower = faster)
/>
```

### Update Brand Colors

Colors defined in multiple places:

1. **Particle gradients**: `ParticleAssembly.tsx` (if re-added)
2. **Loading screen**: `LoadingScreen.tsx` gradient stops
3. **Navigation labels**: `NavigationLabel.tsx` gradient
4. **Background**: `AnimatedBackground.tsx` gradient orbs

Brand colors: Cyan `#00ffff`, Green `#00e92c`

## Debugging

### Expected Console Logs

From `FracturedLogo.tsx`:
```
Found X meshes in the model
4 Largest pieces by volume:
  1. mesh_name - Volume: 0.XXXX
  ...
Navigation pieces: 4, Debris pieces: X
Navigating to: SECTION  // On click
```

From GSAP cleanup:
```
GSAP animations cleaned up
```

### Common Issues

**Navigation pieces aren't detected correctly:**
- Verify GLB has at least 4 distinct meshes
- Check bounding box calculation isn't failing (zero-volume meshes)
- Verify model scale isn't extremely small/large

**Decomposition doesn't trigger:**
- Check collision box size in `FracturedLogo.tsx` return JSX (`<boxGeometry args={[3, 3, 2]} />`)
- Verify `isAnimating` lock isn't stuck true
- Confirm hover events are firing (add console.log in `handlePointerEnter`)

**Animations are jittery:**
- Ensure `isAnimating` is properly managed in GSAP callbacks
- Check that multiple animation systems aren't fighting (useFrame vs GSAP)
- Verify delta time is being used for frame-independence

**Performance issues:**
- Reduce bloom quality: `height: 100 → 50`
- Reduce particle count (if re-added)
- Simplify lighting setup
- Check browser DevTools Performance tab for bottlenecks

**Model not loading:**
- Verify path is correct (`/public/models/` → `/models/` in code)
- Check browser console for 404 errors
- Ensure webpack config handles `.glb` files (see next.config.js)
- Try `useGLTF.preload()` for better error messages

## Performance Testing

Playwright tests verify 60fps target across key scenarios:

```bash
npm run test:perf:headed  # Run with visible browser (accurate GPU)
npm run test:perf        # Run headless (faster but less accurate)
```

**Test scenarios:**
1. Loading & camera intro (target: 60fps avg)
2. Idle logo rotation (target: 60fps avg)
3. Decomposition animation (target: 55fps avg)
4. Navigation hover with bloom (target: 55fps avg)
5. Rapid interactions stress test (target: 50fps avg)

**Note**: Headless mode may show lower FPS due to software rendering. Use `--headed` for accurate WebGL measurements.

## Key Dependencies & Versions

- **three** `^0.169.0` - Core 3D engine
- **@react-three/fiber** `^8.18.0` - React renderer for Three.js
- **@react-three/drei** `^9.122.0` - Helper components (useGLTF, OrbitControls, Environment, etc.)
- **@react-three/postprocessing** `^2.19.1` - Post-processing effects
- **gsap** `^3.12.5` - Animation library
- **next** `14.2.21` - React framework with App Router
- **react** `^18.3.1` / **react-dom** `^18.3.1` - With overrides in package.json

## Styling Patterns

- **Tailwind CSS** for DOM components/overlays
- **CSS variables** in `app/globals.css` for theming (`--background`, `--foreground`)
- **Canvas styling**: `width: 100%; height: 100vh;` for fullscreen 3D
- **DOM overlays**: Use `fixed` positioning with high `z-index` (50+)
- **Gradients**: Consistent brand gradient `from-[#00e92c] to-[#00ffff]`

## Browser Requirements

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- **WebGL 2.0 support required**
