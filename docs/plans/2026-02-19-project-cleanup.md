# Project Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all unused code, files, packages, and fix file/folder naming conventions across the project.

**Architecture:** Work from lowest-risk to highest-risk. Each task is atomic and verifiable. Font and favicon renames update the physical files AND all references in one task so nothing is ever in a broken state.

**Tech Stack:** Next.js 15, TypeScript, npm

---

## Risk Order (safest → riskiest)

1. Remove dev-only scripts and stale docs (zero app impact)
2. Remove unused font files (no references to break)
3. Remove FloatingSpheres component + its packages
4. Remove remaining unused packages
5. Rename font files (update globals.css in same step)
6. Rename favicon folders (update layout.tsx, manifest.json, browserconfig.xml in same step)

---

### Task 1: Remove dev-only scripts and stale docs

**Files to delete:**
- `scripts/create-simple-placeholders.sh`
- `scripts/fix-works-paths.js`
- `scripts/generate-placeholders.js`
- `scripts/recreate-works-data-paths.sh`
- `codebase/ARCHITECTURE.md`
- `codebase/CONCERNS.md`
- `codebase/CONVENTIONS.md`
- `codebase/INTEGRATIONS.md`
- `codebase/STACK.md`
- `codebase/STRUCTURE.md`
- `codebase/TESTING.md`
- `docs/CHANGELOG.md`
- `public/images/about/IMAGE-SPECS.md`

**Step 1: Verify none are imported anywhere**

```bash
grep -r "scripts/" app/ components/ lib/ --include="*.ts" --include="*.tsx"
grep -r "codebase/" app/ components/ lib/ --include="*.ts" --include="*.tsx"
```
Expected: no output

**Step 2: Delete the files**

```bash
rm -rf scripts/ codebase/ docs/CHANGELOG.md public/images/about/IMAGE-SPECS.md
```

**Step 3: Verify build still works**

```bash
npm run build
```
Expected: Build succeeds with no errors.

---

### Task 2: Remove unused font files

These 5 font files exist in `public/font/` but are never referenced in `globals.css`:
- `fonnts.com-Gibson_Bold_Italic.otf`
- `fonnts.com-Gibson_Heavy_Italic.otf`
- `fonnts.com-Gibson_Italic.otf`
- `fonnts.com-Gibson_Medium_Italic.otf`
- `fonnts.com-Gibson_Thin_Italic.otf`

**Step 1: Confirm they are not referenced anywhere**

```bash
grep -r "Bold_Italic\|Heavy_Italic\|Gibson_Italic\|Medium_Italic\|Thin_Italic" . --include="*.css" --include="*.tsx" --include="*.ts" --include="*.json" | grep -v node_modules
```
Expected: no output

**Step 2: Delete the files**

```bash
rm "public/font/fonnts.com-Gibson_Bold_Italic.otf" \
   "public/font/fonnts.com-Gibson_Heavy_Italic.otf" \
   "public/font/fonnts.com-Gibson_Italic.otf" \
   "public/font/fonnts.com-Gibson_Medium_Italic.otf" \
   "public/font/fonnts.com-Gibson_Thin_Italic.otf"
```

**Step 3: Verify build still works**

```bash
npm run build
```

---

### Task 3: Remove FloatingSpheres component

`FloatingSpheres.tsx` uses `@react-three/rapier` and `maath` but is never imported in any page or component (only in `canvas/index.ts`).

**Files to modify:**
- Delete: `components/canvas/FloatingSpheres.tsx`
- Modify: `components/canvas/index.ts` — remove the FloatingSpheres export line

**Step 1: Confirm FloatingSpheres is not used in any page**

```bash
grep -r "FloatingSpheres" app/ components/dom/ components/canvas/View.tsx --include="*.tsx" --include="*.ts"
```
Expected: no output

**Step 2: Remove the export from `components/canvas/index.ts`**

Remove this line:
```ts
export { default as FloatingSpheres } from './FloatingSpheres';
```

**Step 3: Delete the component file**

```bash
rm components/canvas/FloatingSpheres.tsx
```

**Step 4: Verify build still works**

```bash
npm run build
```
Expected: no TypeScript errors, build succeeds.

---

### Task 4: Remove unused packages from package.json

**Packages to remove from `dependencies`:**
- `@clerk/nextjs`
- `@sanity/client`
- `@sanity/image-url`
- `next-sanity`
- `drizzle-orm`
- `@vercel/kv`
- `@vercel/postgres`
- `@upstash/ratelimit`
- `nosecone`
- `@react-three/rapier` (was only used by FloatingSpheres, now deleted)
- `maath` (was only used by FloatingSpheres, now deleted)

**Packages to remove from `devDependencies`:**
- `drizzle-kit`
- `sanity-codegen`

**Step 1: Confirm none are imported anywhere in the codebase**

```bash
grep -rn "from.*@clerk\|from.*@sanity\|from.*next-sanity\|from.*drizzle\|from.*@vercel/kv\|from.*@vercel/postgres\|from.*@upstash\|from.*nosecone\|from.*rapier\|from.*maath" \
  app/ components/ lib/ hooks/ \
  --include="*.ts" --include="*.tsx"
```
Expected: no output

**Step 2: Remove each package**

```bash
npm uninstall @clerk/nextjs @sanity/client @sanity/image-url next-sanity drizzle-orm @vercel/kv @vercel/postgres @upstash/ratelimit nosecone @react-three/rapier maath
npm uninstall --save-dev drizzle-kit sanity-codegen
```

**Step 3: Verify build still works**

```bash
npm run build
```
Expected: Build succeeds. If any error mentions a removed package, it was actually used — stop and investigate before proceeding.

---

### Task 5: Rename font files to clean convention

This task renames 5 font files AND updates their references in `globals.css` in one atomic operation.

**Rename map:**
| Old name | New name |
|---|---|
| `fonnts.com-Gibson_Regular.otf` | `gibson-regular.otf` |
| `fonnts.com-Gibson_Medium.otf` | `gibson-medium.otf` |
| `fonnts.com-Gibson_Bold.otf` | `gibson-bold.otf` |
| `fonnts.com-Gibson_Heavy.otf` | `gibson-heavy.otf` |
| `fonnts.com-Gibson_Light_Italic.otf` | `gibson-light-italic.otf` |

**Step 1: Rename the files**

```bash
cd public/font
mv "fonnts.com-Gibson_Regular.otf"    "gibson-regular.otf"
mv "fonnts.com-Gibson_Medium.otf"     "gibson-medium.otf"
mv "fonnts.com-Gibson_Bold.otf"       "gibson-bold.otf"
mv "fonnts.com-Gibson_Heavy.otf"      "gibson-heavy.otf"
mv "fonnts.com-Gibson_Light_Italic.otf" "gibson-light-italic.otf"
cd ../..
```

**Step 2: Update `app/globals.css`**

Replace all 5 font `src:` lines. The new `@font-face` block section should read:

```css
/* Gibson Font Family */
@font-face {
  font-family: 'Gibson';
  src: url('/font/gibson-regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gibson';
  src: url('/font/gibson-medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gibson';
  src: url('/font/gibson-bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gibson';
  src: url('/font/gibson-heavy.otf') format('opentype');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gibson';
  src: url('/font/gibson-light-italic.otf') format('opentype');
  font-weight: 300;
  font-style: italic;
  font-display: swap;
}
```

**Step 3: Confirm no old names remain**

```bash
grep -r "fonnts.com" . --include="*.css" --include="*.tsx" --include="*.ts" --include="*.json" | grep -v node_modules
```
Expected: no output

**Step 4: Verify build**

```bash
npm run build
```

**Step 5: Smoke test fonts in browser**

```bash
npm run dev
```
Open http://localhost:3000 and verify text renders in Gibson font (not fallback sans-serif).

---

### Task 6: Rename favicon folders (highest risk — 4 files updated atomically)

**Rename map:**
| Old path | New path |
|---|---|
| `public/Favicon/Android Devices/` | `public/favicon/android/` |
| `public/Favicon/Apple Devices (iOS, iPadOS)/` | `public/favicon/apple/` |
| `public/Favicon/Web/` | `public/favicon/web/` |
| `public/Favicon/Windows Devices/` | `public/favicon/windows/` |

Files that reference these paths (all must be updated in this same task):
1. `app/layout.tsx` — icons metadata
2. `public/manifest.json` — Android chrome icons
3. `public/browserconfig.xml` — Windows tiles

**Step 1: Create new folder structure and move files**

```bash
mkdir -p public/favicon/android public/favicon/apple public/favicon/web public/favicon/windows

# Android
mv "public/Favicon/Android Devices/android-chrome-192x192.svg" public/favicon/android/
mv "public/Favicon/Android Devices/android-chrome-512x512.svg" public/favicon/android/

# Apple
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-114x114.png" public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-120x120.png" public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-144x144.png" public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-152x152.png" public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-167x167.png" public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-180x180.png" public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-57x57.png"   public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-60x60.png"   public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-72x72.png"   public/favicon/apple/
mv "public/Favicon/Apple Devices (iOS, iPadOS)/apple-touch-icon-76x76.png"   public/favicon/apple/

# Web
mv "public/Favicon/Web/favicon-128x128.svg" public/favicon/web/
mv "public/Favicon/Web/favicon-16x16.svg"   public/favicon/web/
mv "public/Favicon/Web/favicon-196x196.svg" public/favicon/web/
mv "public/Favicon/Web/favicon-32x32.svg"   public/favicon/web/
mv "public/Favicon/Web/favicon-96x96.svg"   public/favicon/web/

# Windows
mv "public/Favicon/Windows Devices/mstile-144x144.svg" public/favicon/windows/
mv "public/Favicon/Windows Devices/mstile-150x150.svg" public/favicon/windows/
mv "public/Favicon/Windows Devices/mstile-310x150.svg" public/favicon/windows/
mv "public/Favicon/Windows Devices/mstile-310x310.svg" public/favicon/windows/
mv "public/Favicon/Windows Devices/mstile-70x70.svg"   public/favicon/windows/

# Remove old folder
rm -rf "public/Favicon"
```

**Step 2: Update `app/layout.tsx` icons metadata**

Replace the `icons` block with updated paths:

```ts
icons: {
  icon: [
    { url: "/favicon/web/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
    { url: "/favicon/web/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
    { url: "/favicon/web/favicon-96x96.svg", sizes: "96x96", type: "image/svg+xml" },
    { url: "/favicon/web/favicon-196x196.svg", sizes: "196x196", type: "image/svg+xml" },
  ],
  apple: [
    { url: "/favicon/apple/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-167x167.png", sizes: "167x167", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-114x114.png", sizes: "114x114", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-76x76.png", sizes: "76x76", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-72x72.png", sizes: "72x72", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-60x60.png", sizes: "60x60", type: "image/png" },
    { url: "/favicon/apple/apple-touch-icon-57x57.png", sizes: "57x57", type: "image/png" },
  ],
},
```

**Step 3: Update `public/manifest.json`**

Replace icons src values:
```json
"icons": [
  {
    "src": "/favicon/android/android-chrome-192x192.svg",
    "sizes": "192x192",
    "type": "image/svg+xml",
    "purpose": "any"
  },
  {
    "src": "/favicon/android/android-chrome-512x512.svg",
    "sizes": "512x512",
    "type": "image/svg+xml",
    "purpose": "any"
  }
]
```

**Step 4: Update `public/browserconfig.xml`**

```xml
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/favicon/windows/mstile-70x70.svg"/>
      <square150x150logo src="/favicon/windows/mstile-150x150.svg"/>
      <wide310x150logo src="/favicon/windows/mstile-310x150.svg"/>
      <square310x310logo src="/favicon/windows/mstile-310x310.svg"/>
      <TileColor>#050505</TileColor>
    </tile>
  </msapplication>
</browserconfig>
```

**Step 5: Confirm no old paths remain**

```bash
grep -r "Favicon\|Android%20Devices\|Apple%20Devices\|Windows%20Devices" . \
  --include="*.tsx" --include="*.ts" --include="*.json" --include="*.xml" --include="*.css" \
  | grep -v node_modules | grep -v .next | grep -v docs/
```
Expected: no output

**Step 6: Verify build**

```bash
npm run build
```

**Step 7: Smoke test favicons in browser**

```bash
npm run dev
```
Open http://localhost:3000 and check browser tab shows the favicon correctly.

---

## Final Verification

```bash
# 1. Confirm no references to removed packages
grep -rn "clerk\|@sanity\|next-sanity\|drizzle\|@vercel/kv\|@vercel/postgres\|@upstash\|nosecone\|rapier\|maath" \
  app/ components/ lib/ hooks/ --include="*.ts" --include="*.tsx"

# 2. Confirm no references to old font names
grep -r "fonnts.com" . --include="*.css" --include="*.json" | grep -v node_modules

# 3. Confirm no references to old favicon paths
grep -r "Favicon" . --include="*.tsx" --include="*.json" --include="*.xml" | grep -v node_modules | grep -v docs/

# 4. Final build
npm run build
```
