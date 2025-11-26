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

### Available Routes

- **`/`** (app/page.tsx) - Main page with 3D fractured logo navigation
- **`/about`** (app/about/page.tsx) - Direct route to About section
  - Used for testing and direct access
  - Same content as clicking ABOUT in main navigation
  - Includes smooth scroll and text animations
- **`/contact`** (app/contact/page.tsx) - Direct route to Contact form
  - Award-winning contact form with liquid glass design
  - EmailJS integration for sending emails
  - Google reCAPTCHA v3 for spam prevention
  - Zod validation with real-time error handling
  - A/B testing framework integrated
  - Confetti animation on successful submission

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

- **FloatingSpheres** (`components/canvas/FloatingSpheres.tsx`)
  - Physics-based sphere system using `@react-three/rapier` for realistic motion
  - **Two Sphere Types**:
    - Normal spheres: 7 dark (#1A1A1A) + remaining with cycling accent colors
    - Transparent glass spheres: MeshTransmissionMaterial with refraction/chromatic aberration
  - **Color Cycling**: Automatically cycles through brand accents every 5 seconds
    - Colors: Cyan (#00ffff) → Green (#00e92c) → Teal (#00d4aa) → Blue (#00b8ff)
  - **Responsive Configuration**:
    - Mobile: 12 total (3 transparent), tighter spread (8x8x8 position, 12x8x6 motion)
    - Desktop: 18 total (5 transparent), wider spread (20x10x20 position, 40x10x10 motion)
  - **Motion Algorithm**: Complex sine/cosine paths with individual timing factors per sphere
  - **Physics Properties**: High damping (50), low friction (0.1) for smooth floating effect

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

- **AboutSection** (`components/dom/AboutSection.tsx`)
  - Full-page section displayed when clicking "ABOUT" navigation piece
  - **Responsive 3D Sphere Scene**: Physics-based FloatingSpheres with adaptive counts
  - **Animated SVG Mask Overlay**: 7 rectangles that move procedurally across the canvas
    - Grid-based movement system (6 columns × 2 rows)
    - Random group animations with collision detection
    - Continuous GSAP timeline loop with 2-second delays
    - Fades on hover to reveal full sphere scene
  - **InfiniteText Component**: Horizontal scrolling "Scroll Down" text banner
  - **Fixed Header**: Logo button (back navigation) + GET IN TOUCH link + MENU button
  - **MenuOverlay Integration**: Opens full-screen menu for site navigation
  - **Responsive Sphere Config**:
    - Mobile: 12 spheres, narrower camera (FOV 35, Z 18)
    - Desktop: 18 spheres, wider camera (FOV 20, Z 20)

- **InfiniteText** (`components/dom/InfiniteText.tsx`)
  - Horizontally scrolling text created by repeating text content
  - Uses CSS `whitespace-nowrap` and configurable repeat length
  - Applied in About section for "Scroll Down" indicator

- **MenuOverlay** (`components/dom/MenuOverlay.tsx`)
  - Full-screen overlay menu with navigation options
  - GSAP slide-in animation from right side
  - Includes HOME, ABOUT, WORKS, SERVICES, CONTACT options
  - Backdrop blur and dark overlay effect

- **SmoothScrolling** (`components/dom/SmoothScrolling.tsx`)
  - **Lenis smooth scroll wrapper** - Industry-standard smooth scrolling library
  - **GSAP ScrollTrigger integration**: Syncs scroll-based animations with smooth scroll
  - **Critical initialization pattern**: Multiple `ScrollTrigger.refresh()` calls at 500ms and 1000ms
  - **Fixes dynamic mounting**: Ensures animations work when sections load after navigation
  - **Settings**: `lerp: 0.1` (smoothness), `duration: 1.2` (scroll duration)
  - **Performance**: `autoRaf: true` for automatic frame updates, lag smoothing disabled
  - **Usage**: Wrap scrollable content with `<SmoothScrolling>` component

- **AnimatedText** (`components/dom/AnimatedText.tsx`)
  - **Award-winning text animation** - Character-by-character reveal with scroll trigger
  - **SplitType integration**: Breaks text into chars/words/lines for independent animation
  - **Scroll-triggered**: Animates when element enters viewport (configurable threshold)
  - **Performance**: Achieves 75+ FPS with optimized stagger timing (0.008s per char)
  - **Accessibility**: Respects `prefers-reduced-motion` media query
  - **Key props**:
    - `splitBy`: 'chars' | 'words' | 'lines' (default: 'chars')
    - `stagger`: Time between each element (default: 0.008s)
    - `duration`: Animation duration per element (default: 0.5s)
    - `y`: Slide distance in pixels (default: 50)
    - `triggerStart`: When to trigger (default: 'top 80%')
  - **Animation**: Fade + slide up with `power2.out` easing
  - **Initialization delay**: 200ms to ensure DOM and Lenis are ready
  - **ScrollTrigger options**: `invalidateOnRefresh: true` for dynamic content

- **ContactSection** (`components/dom/ContactSection.tsx`)
  - **Award-winning 2025 contact form** with liquid glass morphism design
  - **Simplified architecture** (107 lines, 53% smaller than initial version)
  - **Key lesson**: User feedback led to removing overcomplicated features (3D sphere interactions, custom cursor, blur animations)
  - **What was removed** in simplification:
    - Canvas + Physics + FloatingSpheres 3D scene
    - SmoothScrolling wrapper (not needed for contact form)
    - AnimatedText components (plain text used instead)
    - CustomCursor component (deleted entirely)
    - GSAP blur animations during form submission
    - Form state callbacks for sphere interactions
  - **What was kept**:
    - Liquid glass aesthetic with backdrop-blur
    - EmailJS integration structure (ready for configuration)
    - Google reCAPTCHA v3 structure (ready for configuration)
    - Zod validation with real-time error handling
    - Success confetti animation
    - A/B testing framework integration
  - **Fixed Header**: Logo (back nav) + GET IN TOUCH link + MENU button
  - **Hero Section**: Plain text heading (no animations for simplicity)
  - **Result**: Bundle reduced from 1.16 MB → 130 KB (89% reduction), clean and professional

- **ContactForm** (`components/dom/ContactForm.tsx`)
  - **Core form logic** with validation and email sending
  - **Fields**: name, email, phone, company, message (all required)
  - **Validation**: Zod schema with custom error messages
  - **EmailJS Integration**:
    - Server-side API route (`/app/api/send-email/route.ts`)
    - Dual email system: notification to owner + confirmation to user
    - Environment variables: `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_USER_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`
  - **reCAPTCHA v3**:
    - Invisible captcha (no user interaction required)
    - Score-based verification on server
    - Environment variable: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
  - **A/B Testing**: Uses `useABTest()` hook for variant selection
  - **Liquid Glass Styling**:
    - `backdrop-blur-xl` for glassmorphism effect
    - Gradient borders with `bg-gradient-to-r from-cyan-500 to-green-500`
    - Hover effects with scale and glow transitions
  - **Success Flow**: Calls `onSuccess()` → triggers confetti → shows success screen

- **FormField** & **FormTextarea** (`components/dom/FormField.tsx`, `FormTextarea.tsx`)
  - **Reusable form input components** with liquid glass styling
  - **Floating Labels**: Label animates up when input is focused or filled
  - **Validation States**: Red border + error message on validation failure
  - **Animations**: Smooth transitions for all state changes
  - **Accessibility**: Proper label associations, error announcements

- **SubmissionSuccess** (`components/dom/SubmissionSuccess.tsx`)
  - **Success animation** displayed after form submission
  - **Confetti Animation**: Canvas-based confetti particles
  - **Thank You Message**: Confirms submission with brand colors
  - **Call to Action**: "Back to Home" button to return to main page

### A/B Testing Framework

**Critical feature** requested by user - allows testing different form layouts/CTAs for optimization.

**Architecture** (`/lib/ab-testing/`):
- **5-file modular system**: constants, context, provider, hook, public API
- **Random variant selection**: Each user gets random combination on mount
- **Three variant dimensions**:
  - **Layout**: `'single-column' | 'two-column'`
  - **CTA Text**: `'send-message' | 'submit' | 'get-started' | 'contact-us'`
  - **Form Style**: `'liquid-glass' | 'dark-glass' | 'gradient'`

**Files**:
- `constants.ts`: Type definitions, variant arrays, CTA text mapping
- `context.ts`: React context for sharing variant across components
- `provider.tsx`: Context provider with random selection logic
- `useABTest.ts`: Custom hook to access variant + conversion tracking
- `index.ts`: Public API exports

**Usage Pattern**:
```typescript
// 1. Wrap app with provider in layout.tsx
<ABTestProvider>
  <YourApp />
</ABTestProvider>

// 2. Access variant in components
const { layout, cta, style } = useABTest();

// 3. Render based on variant
{layout === 'two-column' ? <TwoColumnForm /> : <SingleColumnForm />}
<button>{CTA_TEXT_MAP[cta]}</button>

// 4. Track conversion on success
const trackConversion = useTrackConversion();
const handleSubmit = async () => {
  // ... send form
  trackConversion(); // Log conversion for analytics
};
```

**Production Integration** (TODO for user):
```typescript
// Replace Math.random() with analytics service
// Example: Google Optimize, Optimizely, PostHog
const variant = analytics.getABTestVariant('contact-form-test');

// Track variant assignment
analytics.track('ab_test_variant_assigned', variant);

// Track conversion
analytics.track('form_submission', { variant });
```

**Force Variant** (for testing):
```typescript
<ABTestProvider forceVariant={{ layout: 'two-column', cta: 'get-started', style: 'gradient' }}>
```

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
Assembled State (group scale 1.5, idle rotation via useFrame)
  ↓ onPointerEnter on global collision box
Decompose Animation (GSAP - 4s duration, all at once)
  - Nav pieces → target positions (z: 1.0, front of camera)
  - Nav pieces maintain 1.0x scale
  - Debris scatter to back (negative z: -0.5 to -1), fade opacity 0.3-0.6
  ↓ animation completes
Floating State (permanent - useFrame sine wave motion)
  - Logo stays decomposed (no auto-reassembly)
  ↓ onPointerEnter on nav piece collision box
Hover Effect (scale 1.0 → 1.2, cyan emissive glow)
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
  { section: 'about', label: 'ABOUT', position: new THREE.Vector3(-0.6, 1.5, 1.0) },      // Top-left
  { section: 'works', label: 'WORKS', position: new THREE.Vector3(0.6, 1.5, 1.0) },       // Top-right
  { section: 'services', label: 'SERVICES', position: new THREE.Vector3(-0.6, 0.5, 1.0) }, // Bottom-left
  { section: 'contact', label: 'CONTACT', position: new THREE.Vector3(0.6, 0.5, 1.0) },   // Bottom-right
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

### Smooth Scroll + ScrollTrigger Integration Pattern

**Critical for dynamic content**: When using Lenis with GSAP ScrollTrigger in sections that load dynamically (not on initial page load), you MUST follow this initialization sequence:

#### The Problem
- Lenis initializes smooth scrolling
- ScrollTrigger scans for animation triggers on mount
- **Race condition**: ScrollTrigger may scan before Lenis is ready or content has settled
- **Result**: Animations don't trigger when navigating from main page to section pages

#### The Solution (3-Layer Refresh)

1. **SmoothScrolling Component** (500ms + 1000ms refreshes):
```typescript
useEffect(() => {
  const lenis = new Lenis({ /* config */ });

  // First refresh: After Lenis initializes
  setTimeout(() => ScrollTrigger.refresh(), 500);

  // Second refresh: After content settles
  setTimeout(() => ScrollTrigger.refresh(), 1000);
}, []);
```

2. **Parent Section Component** (600ms + 800ms):
```typescript
useEffect(() => {
  window.scrollTo(0, 0); // Reset scroll position

  // Refresh after component & children render
  setTimeout(() => ScrollTrigger.refresh(), 600);

  // Force update all triggers
  setTimeout(() => ScrollTrigger.update(), 800);
}, []);
```

3. **AnimatedText Component** (200ms delay + 100ms refresh):
```typescript
useEffect(() => {
  // Wait for DOM and Lenis to be ready
  setTimeout(() => {
    const splitText = new SplitType(/* ... */);

    // Create animation with ScrollTrigger
    gsap.timeline({ scrollTrigger: { /* ... */ } });

    // Final refresh after animation setup
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, 200);
}, []);
```

#### Console Log Sequence (Expected)
When properly initialized, you'll see this order in the browser console:
```
[SmoothScrolling] Lenis initialized
[AboutSection] Component mounted
[AnimatedText] Initializing animation
[AnimatedText] Split 150 chars
[SmoothScrolling] ScrollTrigger refreshed after Lenis init (500ms)
[AboutSection] ScrollTrigger refreshed on mount (600ms)
[AboutSection] ScrollTrigger updated (800ms)
[SmoothScrolling] Late ScrollTrigger refresh complete (1000ms)
[AnimatedText] ScrollTrigger refreshed after setup
[AnimatedText] ScrollTrigger entered (on scroll)
```

#### Why Multiple Refreshes?
- **500ms**: Lenis is ready, first scan for triggers
- **600ms**: Section component rendered, children mounted
- **800ms**: All animations set up, force recalculation
- **1000ms**: Final safety refresh, ensure everything synced

**⚠️ Do NOT remove or reduce these timers** - they fix animations not triggering when navigating from the main 3D page to section pages.

### Performance Optimizations

- **Frame-rate independence**: All animations use `delta` time
- **Animation cleanup**: GSAP timelines/tweens tracked and killed on unmount
- **Reduced motion support**: Checks `prefers-reduced-motion` media query
- **Mobile optimizations**: Larger collision areas (`collisionScale`), responsive camera/scale
- **Efficient lighting**: Simplified to 3 lights + environment map
- **Post-processing optimization**: Bloom quality reduced to `height: 100`, mipmapBlur enabled
- **Geometry reuse**: BufferGeometry for particles, single bounding box calculation
- **Smooth scroll performance**: Lenis uses `lerp: 0.1` for smooth interpolation without jank

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

1. **Loading screen**: `LoadingScreen.tsx` gradient stops
2. **Navigation labels**: `NavigationLabel.tsx` gradient
3. **Background**: `AnimatedBackground.tsx` gradient orbs
4. **Hover glow**: `FracturedLogo.tsx` emissive color (`0x00ffff`)

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

From smooth scroll initialization (AboutSection):
```
[SmoothScrolling] Lenis initialized
[AboutSection] Component mounted
[AnimatedText] Initializing animation
[AnimatedText] Split 150 chars
[SmoothScrolling] ScrollTrigger refreshed after Lenis init
[AboutSection] ScrollTrigger refreshed on mount
[AboutSection] ScrollTrigger updated
[SmoothScrolling] Late ScrollTrigger refresh complete
[AnimatedText] ScrollTrigger refreshed after setup
[AnimatedText] ScrollTrigger entered  // When scrolling to text
```

From GSAP cleanup:
```
[SmoothScrolling] Cleanup complete
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

**Text animation not triggering (smooth scroll sections):**
- Check browser console for initialization logs in correct sequence
- Verify all `ScrollTrigger.refresh()` calls are present (500ms, 600ms, 800ms, 1000ms)
- Ensure `<SmoothScrolling>` wrapper is wrapping the entire scrollable content
- Confirm `AnimatedText` has 200ms initialization delay
- Check that `invalidateOnRefresh: true` is set in ScrollTrigger config
- Try uncommenting `markers: true` in AnimatedText to visualize trigger points
- If animation works on direct route (`/about`) but not navigation, timers may be too short

**Smooth scrolling feels janky:**
- Check Lenis `lerp` value (lower = smoother, but slower response)
- Verify `autoRaf: true` is set and no manual RAF loops conflict
- Disable bloom effects temporarily to test if GPU-bound
- Check for console errors that might block frame updates

## Performance Testing

Playwright tests verify 60fps target across key scenarios:

```bash
npm run test:perf:headed  # Run with visible browser (accurate GPU)
npm run test:perf        # Run headless (faster but less accurate)
npm run test:perf:report # View HTML report from last test run

# Run specific test suites
npx playwright test tests/performance.spec.ts         # 3D scene performance
npx playwright test tests/text-animation.spec.ts     # Text animation (direct /about route)
npx playwright test tests/navigation-flow.spec.ts    # Full navigation flow tests
npx playwright test tests/quick-verify.spec.ts       # Quick verification
```

### Test Suites

**1. `tests/performance.spec.ts`** - 3D Scene Performance
- Loading & camera intro (target: 60fps avg)
- Idle logo rotation (target: 60fps avg)
- Decomposition animation (target: 55fps avg)
- Navigation hover with bloom (target: 55fps avg)
- Rapid interactions stress test (target: 50fps avg)

**2. `tests/text-animation.spec.ts`** - Text Animation (Direct Route)
- Tests text animation on `/about` direct route
- Verifies 75+ FPS during character reveal
- Checks ScrollTrigger activation
- Tests mobile viewport compatibility
- Validates reduced-motion support
- **Note**: Tests direct route only, not main navigation flow

**3. `tests/navigation-flow.spec.ts`** - Integration Tests
- Tests both navigation paths: direct `/about` AND main page → ABOUT navigation
- Verifies text animation works in both scenarios
- Validates ScrollTrigger initialization sequence
- Compares FPS between navigation methods
- **Important**: Tests may fail if looking for continuous "Lorem ipsum" text (SplitType breaks it into individual characters)

**4. `tests/quick-verify.spec.ts`** - Quick Checks
- Fast verification that sections render
- Takes screenshots for visual debugging
- Useful for rapid iteration

**5. `tests/contact-form.spec.ts`** - Contact Form Performance
- **User explicitly requested**: "Performance Testing - Run Playwright tests for 60fps verification"
- **5 comprehensive tests** targeting 60fps during all interactions:
  1. **Page load**: Measures FPS during initial render (target: 60fps avg)
  2. **Form interactions**: Types in all fields while monitoring FPS (target: 60fps avg)
  3. **Validation errors**: Triggers validation, ensures no performance degradation (target: 60fps avg)
  4. **Success animation**: Mocks EmailJS, tests confetti animation (target: 60fps avg)
  5. **Memory leak detection**: Submits form 10 times, checks for memory leaks
- **Mocking**: EmailJS API calls mocked to prevent actual email sending during tests
- **Run command**: `npx playwright test tests/contact-form.spec.ts`

**Performance thresholds** (defined in `tests/helpers/constants.ts`):
- `TARGET_FPS: 60` - Ideal frame rate
- `MIN_ACCEPTABLE_FPS: 55` - Minimum for passing tests
- `CRITICAL_FPS: 50` - Below this indicates problems
- `MAX_FRAME_DROP_COUNT: 5` - Max allowed frame drops per test

**Note**: Headless mode may show lower FPS due to software rendering. Use `--headed` for accurate WebGL measurements.

### Test Debugging

If text animation tests fail with "element not found" for Lorem ipsum:
- Text is likely split into individual `<span>` characters by SplitType
- Use browser DevTools to inspect actual DOM structure
- Check for console logs showing initialization sequence
- Take screenshots (tests automatically save to `test-results/`)

## Key Dependencies & Versions

- **three** `^0.169.0` - Core 3D engine
- **@react-three/fiber** `^8.18.0` - React renderer for Three.js
- **@react-three/drei** `^9.122.0` - Helper components (useGLTF, OrbitControls, Environment, etc.)
- **@react-three/postprocessing** `^2.19.1` - Post-processing effects
- **@react-three/rapier** `^1.4.0` - Physics engine for FloatingSpheres
- **gsap** `^3.12.5` - Animation library (includes ScrollTrigger)
- **lenis** `^1.3.15` - Smooth scroll library (industry-standard, lightweight)
- **split-type** `^0.3.4` - Text splitting library for character animations
- **@emailjs/browser** `^4.4.1` - Email sending service for contact form
- **zod** `^4.1.13` - TypeScript-first schema validation for forms
- **react-google-recaptcha** `^3.1.0` - Google reCAPTCHA v3 integration
- **zustand** `^5.0.8` - State management (available for future use)
- **next** `14.2.21` - React framework with App Router
- **react** `^18.3.1` / **react-dom** `^18.3.1` - With overrides in package.json
- **@playwright/test** `^1.56.1` - E2E and performance testing (dev)

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

## Environment Variables Setup

The contact form requires EmailJS and Google reCAPTCHA configuration. Create a `.env.local` file in the root directory:

```bash
# EmailJS Configuration (required for contact form)
# Sign up at https://www.emailjs.com/
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id        # For notification to owner
EMAILJS_USER_TEMPLATE_ID=your_user_template # For confirmation to user
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key

# Google reCAPTCHA v3 Configuration (required for spam prevention)
# Get keys at https://www.google.com/recaptcha/admin
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### EmailJS Setup Steps

1. **Create Account**: Sign up at [emailjs.com](https://www.emailjs.com/)
2. **Add Email Service**: Connect your email provider (Gmail, Outlook, etc.)
3. **Create Templates**: You need 2 templates:
   - **Template 1** (notification to you):
     ```
     Subject: New Contact Form Submission from {{from_name}}

     Name: {{from_name}}
     Email: {{from_email}}
     Phone: {{phone}}
     Company: {{company}}
     Message: {{message}}
     ```
   - **Template 2** (confirmation to user):
     ```
     Subject: Thank you for contacting us!

     Hi {{from_name}},

     Thank you for reaching out. We received your message and will get back to you soon.

     Your message:
     {{message}}
     ```
4. **Get API Keys**: Copy Service ID, Template IDs, Public Key, and Private Key
5. **Add to `.env.local`**: Paste the keys into your environment file

### reCAPTCHA Setup Steps

1. **Register Site**: Go to [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. **Select reCAPTCHA v3**: Choose "reCAPTCHA v3" (invisible, no user interaction)
3. **Add Domain**: Add `localhost` for development and your production domain
4. **Get Keys**: Copy Site Key (public) and Secret Key (private)
5. **Add to `.env.local`**: Paste the keys into your environment file

### Testing Without Configuration

The contact form is **already built and functional**. If environment variables are not set:
- Form validation still works (client-side Zod validation)
- API call will fail gracefully with error message
- No emails will be sent until keys are configured
- This allows you to test the UI/UX without backend setup

### Security Notes

- **Never commit `.env.local`** to version control (already in `.gitignore`)
- `NEXT_PUBLIC_*` variables are exposed to the browser (public keys only)
- Private keys are only accessible server-side (API routes)
- reCAPTCHA verification happens server-side for security
