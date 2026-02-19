# About Page Editorial Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate the About page from a flat white layout to a premium editorial feel using gradient text, stronger colour halos, and bolder use of the brand's green/cyan identity — without changing layout structure or animations.

**Architecture:** All changes are confined to `components/dom/AboutSection.tsx`. The background style object, Tailwind classes on text elements, and a few new wrapper `<div>`s (accent line, watermark) are the only edits needed. No new components or data changes required.

**Tech Stack:** Next.js 15, Tailwind CSS, GSAP (untouched), React Testing Library (Jest)

---

### Task 1: Write the test scaffold for AboutSection

Because no About page tests exist yet, this task creates the test file with mocks and initial assertions that will turn green as we implement changes.

**Files:**
- Create: `__tests__/components/AboutSection.test.tsx`

**Step 1: Create the test file**

```tsx
import { render, screen } from '@testing-library/react';
import AboutSection from '@/components/dom/AboutSection';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(() => ({ kill: jest.fn() })),
  fromTo: jest.fn(() => ({ kill: jest.fn() })),
}));
jest.mock('gsap/ScrollTrigger', () => ({ refresh: jest.fn(), update: jest.fn() }));

jest.mock('@/components/dom/SmoothScrolling', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/components/dom/AnimatedText', () => ({
  __esModule: true,
  default: ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div className={className} style={style}>{children}</div>
  ),
}));
jest.mock('@/components/dom/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header" />,
}));
jest.mock('@/components/dom/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer" />,
}));
jest.mock('@/components/dom/MenuOverlay', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ''} />,
}));

// ── Tests ──────────────────────────────────────────────────────────────────

describe('AboutSection — editorial redesign', () => {
  const renderComponent = () => render(<AboutSection />);

  it('renders AGENZ heading with gradient text classes', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { name: /agenz/i });
    expect(heading).toHaveClass('bg-clip-text');
    expect(heading).toHaveClass('text-transparent');
  });

  it('renders the green accent rule above WELCOME TO', () => {
    renderComponent();
    const rule = document.querySelector('.hero-accent-rule');
    expect(rule).toBeInTheDocument();
  });

  it('renders Our Mission label with gradient text classes', () => {
    renderComponent();
    const label = screen.getByText(/our mission/i);
    expect(label).toHaveClass('bg-clip-text');
    expect(label).toHaveClass('text-transparent');
  });

  it('renders mission card with green left border', () => {
    renderComponent();
    const card = document.querySelector('.mission-card');
    expect(card).toHaveClass('border-l-4');
  });

  it('renders CTA watermark element', () => {
    renderComponent();
    const watermark = document.querySelector('.cta-watermark');
    expect(watermark).toBeInTheDocument();
  });

  it('renders CTA button with glow shadow', () => {
    renderComponent();
    const btn = screen.getByRole('link', { name: /get in touch/i });
    expect(btn.className).toMatch(/shadow-\[/);
  });
});
```

**Step 2: Run tests — expect ALL to fail**

```bash
npm run test -- --testPathPattern=AboutSection --no-coverage
```

Expected: 6 failures (component doesn't have the new classes yet).

**Step 3: Commit the failing test**

```bash
git add __tests__/components/AboutSection.test.tsx
git commit -m "test: add failing tests for About page editorial redesign"
```

---

### Task 2: Upgrade the background

**Files:**
- Modify: `components/dom/AboutSection.tsx:22-32` (the `lightGradientStyle` object)

**Step 1: Replace the background style object**

Find this block in `AboutSection.tsx`:

```tsx
const lightGradientStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.07) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 184, 255, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 20% 50%, rgba(0, 233, 44, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(0, 184, 255, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 184, 255, 0.05) 0%, transparent 50%),
    #f7f7f7
  `,
};
```

Replace with:

```tsx
const lightGradientStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.13) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 184, 255, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 20% 50%, rgba(0, 233, 44, 0.07) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(0, 184, 255, 0.07) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.10) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 184, 255, 0.09) 0%, transparent 50%),
    #f5f4f0
  `,
};
```

**Step 2: No test covers this (it's a style object, not a class) — visually verify in browser**

```bash
npm run dev
```

Open http://localhost:3000/about — background should feel warmer and have visible green/cyan glow in the corners.

**Step 3: Commit**

```bash
git add components/dom/AboutSection.tsx
git commit -m "style: upgrade About page background to warm cream with stronger gradient halos"
```

---

### Task 3: Hero — accent rule + AGENZ gradient text + tagline hierarchy

**Files:**
- Modify: `components/dom/AboutSection.tsx` — Hero section (lines ~190–251)

**Step 1: Add the accent rule and update the AGENZ heading**

Find the left-aligned text block in the Hero section. Replace the entire inner `<div>` (the one with `relative z-10 w-full px-6...`) with this:

```tsx
<div className="relative z-10 w-full px-6 md:px-8 lg:px-12 mt-16 md:mt-0">
  {/* Accent rule */}
  <div
    className="hero-accent-rule h-0.5 w-16 mb-4 rounded-full bg-gradient-to-r from-[#00e92c] to-[#00ffff]"
  />

  {/* WELCOME TO */}
  <h2
    className="text-gray-900 font-bold uppercase tracking-[0.2em]"
    style={{ fontSize: 'clamp(1.4rem, 5vw, 7vw)', lineHeight: 1.1 }}
  >
    {aboutContent.hero.welcomeText}
  </h2>

  {/* AGENZ — gradient fill */}
  <h1
    className="font-extrabold uppercase leading-none tracking-[0.1em] bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
    style={{ fontSize: 'clamp(3.5rem, 14vw, 16vw)' }}
  >
    {aboutContent.hero.brandName}
  </h1>

  {/* Tagline — lighter weight, softer colour for hierarchy contrast */}
  <AnimatedText
    className="text-gray-500 font-semibold uppercase leading-tight mt-2 tracking-[0.05em]"
    style={{ fontSize: 'clamp(1.2rem, 3.5vw, 4.5vw)' }}
    splitBy="words"
    stagger={0.04}
    duration={0.6}
    y={40}
    triggerStart="top 90%"
  >
    WE MASTER EVERYTHING
  </AnimatedText>
  <AnimatedText
    className="text-gray-500 font-semibold uppercase leading-tight tracking-[0.05em]"
    style={{ fontSize: 'clamp(1.2rem, 3.5vw, 4.5vw)' }}
    splitBy="words"
    stagger={0.04}
    duration={0.6}
    y={40}
    triggerStart="top 90%"
  >
    FROM A TO Z!
  </AnimatedText>
</div>
```

**Step 2: Update the flower image classes for higher opacity and size**

Find the flower `<div>` (the one with `ref={flowerRef}`) and replace its className with:

```tsx
className="absolute pointer-events-none
  right-0 top-[35%] -translate-y-1/2 w-[75vw] opacity-60 translate-x-[10%]
  md:top-1/2 md:w-[52vw] md:opacity-80 md:translate-x-[5%]
  lg:w-[46vw] lg:opacity-100 lg:translate-x-[0%]"
```

**Step 3: Run the failing tests**

```bash
npm run test -- --testPathPattern=AboutSection --no-coverage
```

Expected: `renders AGENZ heading with gradient text classes` and `renders the green accent rule above WELCOME TO` should now PASS. Others still fail.

**Step 4: Commit**

```bash
git add components/dom/AboutSection.tsx
git commit -m "style: add gradient AGENZ headline, accent rule, and lighter tagline in About hero"
```

---

### Task 4: Mission section — borders, gradient labels, gradient stats

**Files:**
- Modify: `components/dom/AboutSection.tsx` — Mission section (lines ~253–305)

**Step 1: Update the mission card and label**

Find the `<div>` with `className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-100 shadow-lg"` (the mission text card).

Replace its className with:

```tsx
className="mission-card bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-l-4 border-l-[#00e92c] border border-gray-100 shadow-lg"
```

Then find the `<h2>` with text "Our Mission" and replace it with:

```tsx
<h2 className="text-xl font-bold mb-4 uppercase tracking-wider bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
  Our Mission
</h2>
```

**Step 2: Update stat cards and stat numbers**

Find the stats grid `<div>` (the one with `className="grid grid-cols-2 gap-6"`).

Replace the entire stats map block with:

```tsx
<div className="grid grid-cols-2 gap-6">
  {aboutContent.mission.stats.map((stat, index) => (
    <div
      key={stat.label}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200 shadow-md text-center"
    >
      <div
        ref={(el) => {
          statsRefs.current[index] = el;
        }}
        className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
      >
        0+
      </div>
      <div className="text-gray-500 text-xs md:text-sm uppercase tracking-wider">
        {stat.label}
      </div>
    </div>
  ))}
</div>
```

**Step 3: Run tests**

```bash
npm run test -- --testPathPattern=AboutSection --no-coverage
```

Expected: `renders Our Mission label with gradient text classes` and `renders mission card with green left border` now PASS.

**Step 4: Commit**

```bash
git add components/dom/AboutSection.tsx
git commit -m "style: add gradient labels, green borders, and gradient stats to About mission section"
```

---

### Task 5: CTA section — gradient headline, watermark, button glow

**Files:**
- Modify: `components/dom/AboutSection.tsx` — CTA section (lines ~307–353)

**Step 1: Update the graphics shape opacity/size**

Find the graphics shape `<div>` (the one with `ref={graphicsRef}`) and replace its className with:

```tsx
className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none
  w-[55vw] opacity-30 -translate-x-[15%]
  md:w-[45vw] md:opacity-55 md:-translate-x-[10%]
  lg:w-[40vw] lg:opacity-75 lg:-translate-x-[5%]"
```

**Step 2: Update the content block — add watermark, gradient headline, button glow**

Find the content `<div>` with `className="relative z-10 text-center px-6"` and replace it entirely with:

```tsx
<div className="relative z-10 text-center px-6">
  {/* Watermark AGENZ behind headline */}
  <div
    className="cta-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none"
    aria-hidden="true"
  >
    <span
      className="font-extrabold uppercase text-gray-900"
      style={{ fontSize: 'clamp(6rem, 22vw, 28vw)', opacity: 0.04, letterSpacing: '0.05em' }}
    >
      AGENZ
    </span>
  </div>

  <AnimatedText
    className="text-gray-900 text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
    splitBy="words"
    stagger={0.05}
    duration={0.8}
    y={50}
    triggerStart="top 80%"
  >
    {aboutContent.cta.headline}
  </AnimatedText>

  <Link
    href="/contact"
    className="inline-block px-12 py-5 text-xl font-bold text-black bg-gradient-to-r from-[#00e92c] to-[#00ffff] rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(0,233,44,0.3)] hover:shadow-[0_0_60px_rgba(0,233,44,0.5)]"
  >
    {aboutContent.cta.buttonText}
  </Link>
</div>
```

**Step 3: Run all tests**

```bash
npm run test -- --testPathPattern=AboutSection --no-coverage
```

Expected: All 6 tests PASS.

**Step 4: Run full test suite to confirm nothing broken**

```bash
npm run test --no-coverage
```

Expected: All tests pass.

**Step 5: Commit**

```bash
git add components/dom/AboutSection.tsx
git commit -m "style: add gradient headline, AGENZ watermark, and glow button to About CTA section"
```

---

### Task 6: Visual QA

**Step 1: Start the dev server**

```bash
npm run dev
```

**Step 2: Open http://localhost:3000/about and verify each section:**

- [ ] Background is warm cream with visible green/cyan corner halos
- [ ] "AGENZ" letters show green→cyan gradient fill
- [ ] Thin gradient accent line appears above "WELCOME TO"
- [ ] Tagline is visibly softer/lighter than the AGENZ headline
- [ ] Flower image is clearly visible and large on desktop
- [ ] Mission card has a green left border
- [ ] "Our Mission" label is gradient coloured
- [ ] Stat numbers are gradient coloured
- [ ] Stat cards have a green/cyan border tint
- [ ] CTA headline is gradient coloured
- [ ] Faint "AGENZ" watermark is visible behind the CTA headline
- [ ] "Get in Touch" button has a green glow

**Step 3: Check mobile (375px) and tablet (768px) in DevTools — no layout breaks**

**Step 4: Final commit if any tweaks made**

```bash
git add components/dom/AboutSection.tsx
git commit -m "style: visual QA tweaks for About page editorial redesign"
```
