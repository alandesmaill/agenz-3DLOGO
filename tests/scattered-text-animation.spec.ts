import { test, expect } from '@playwright/test';

/**
 * Comprehensive ScatteredText Animation Tests
 * Tests the scattered text paragraph animation across all browsers
 *
 * Tests:
 * 1. Initial scattered state (low opacity, displaced positions)
 * 2. Animation on scroll (words move to original positions)
 * 3. Final state (full opacity, proper positions)
 * 4. Cross-browser compatibility (Chromium, Firefox, WebKit)
 */

test.describe('ScatteredText Animation Tests', () => {
  test.setTimeout(120000); // 2 minute timeout

  test('Test 1: Navigate to About Section', async ({ page, browserName }) => {
    console.log('\n========================================');
    console.log(`  TEST 1: NAVIGATE TO ABOUT (${browserName.toUpperCase()})`);
    console.log('========================================');

    // Listen for console messages
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      // Log ScatteredText related messages
      if (text.includes('ScatteredText') || text.includes('Browser:') || text.includes('Split')) {
        console.log(`  [BROWSER LOG] ${text}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Screenshot landing page
    await page.screenshot({ path: `test-results/scattered-${browserName}-1-landing.png` });
    console.log(`  [1.1] Landing page captured for ${browserName}`);

    // Trigger decomposition
    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 960;
    const centerY = viewport ? viewport.height / 2 : 540;

    console.log(`  [1.2] Hovering at center (${centerX}, ${centerY}) to decompose`);
    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);

    await page.screenshot({ path: `test-results/scattered-${browserName}-2-decomposed.png` });
    console.log(`  [1.3] Decomposed state captured`);

    // Click ABOUT (try multiple positions)
    const aboutPositions = [
      { x: centerX - 200, y: centerY - 150 },
      { x: centerX - 150, y: centerY - 120 },
      { x: 400, y: 280 },
      { x: 700, y: 300 },
    ];

    let aboutFound = false;
    for (const pos of aboutPositions) {
      await page.mouse.move(pos.x, pos.y);
      await page.waitForTimeout(300);

      const aboutLabel = await page.locator('text=ABOUT').first().isVisible().catch(() => false);
      if (aboutLabel) {
        console.log(`  [1.4] ABOUT label found at (${pos.x}, ${pos.y}), clicking...`);
        await page.mouse.click(pos.x, pos.y);
        aboutFound = true;
        break;
      }
    }

    if (!aboutFound) {
      console.log(`  [1.4] ABOUT not found, trying blind click at (400, 280)`);
      await page.mouse.click(400, 280);
    }

    // Wait for transition to About section
    await page.waitForTimeout(4000);
    await page.screenshot({ path: `test-results/scattered-${browserName}-3-about-loaded.png` });

    // Verify we're in About section
    const purposefulTitle = await page.locator('text=WE CREATE PURPOSEFUL').count();
    console.log(`  [1.5] About section title visible: ${purposefulTitle > 0 ? 'YES' : 'NO'}`);

    expect(purposefulTitle).toBeGreaterThan(0);
    console.log(`  ✅ TEST 1 COMPLETE - About section loaded\n`);
  });

  test('Test 2: Check Initial Scattered State', async ({ page, browserName }) => {
    console.log('\n========================================');
    console.log(`  TEST 2: INITIAL SCATTERED STATE (${browserName.toUpperCase()})`);
    console.log('========================================');

    // Navigate to About section (same as Test 1)
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 960;
    const centerY = viewport ? viewport.height / 2 : 540;

    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);
    await page.mouse.click(400, 280);
    await page.waitForTimeout(4000);

    // Now check the scattered text initial state
    console.log(`  [2.1] Checking scattered text paragraph...`);

    // The paragraph is in the second section, need to scroll a bit to see it
    await page.screenshot({ path: `test-results/scattered-${browserName}-4-before-scroll.png` });

    // Find the ScatteredText paragraph - look for Lorem ipsum text
    const paragraph = await page.locator('p:has-text("Lorem ipsum")').first();
    const paragraphExists = await paragraph.count();
    console.log(`  [2.2] ScatteredText paragraph found: ${paragraphExists > 0 ? 'YES' : 'NO'}`);

    if (paragraphExists > 0) {
      // Check if text has been split into words
      const words = await page.locator('.word').count();
      console.log(`  [2.3] Words found after split: ${words}`);

      if (words > 0) {
        // Check first word's initial state (should be scattered)
        const firstWord = await page.locator('.word').first();
        const opacity = await firstWord.evaluate((el) => {
          return window.getComputedStyle(el).opacity;
        });

        const transform = await firstWord.evaluate((el) => {
          return window.getComputedStyle(el).transform;
        });

        console.log(`  [2.4] First word opacity: ${opacity} (should be ~0.2)`);
        console.log(`  [2.5] First word transform: ${transform}`);

        const opacityFloat = parseFloat(opacity);
        const isScattered = transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)';

        console.log(`  [2.6] Initial scattered state: ${isScattered ? 'YES ✅' : 'NO ❌'}`);
        console.log(`  [2.7] Low opacity state: ${opacityFloat < 0.5 ? 'YES ✅' : 'NO ❌'}`);
      } else {
        console.log(`  ❌ ERROR: SplitType did not split text into words!`);
      }
    }

    await page.screenshot({ path: `test-results/scattered-${browserName}-5-initial-state.png` });
    console.log(`  ✅ TEST 2 COMPLETE\n`);
  });

  test('Test 3: Scroll Animation Progression', async ({ page, browserName }) => {
    console.log('\n========================================');
    console.log(`  TEST 3: SCROLL ANIMATION (${browserName.toUpperCase()})`);
    console.log('========================================');

    // Navigate to About section
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 960;
    const centerY = viewport ? viewport.height / 2 : 540;

    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);
    await page.mouse.click(400, 280);
    await page.waitForTimeout(4000);

    console.log(`  [3.1] Starting scroll animation test...`);

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);
    console.log(`  [3.2] Initial scroll position: ${initialScroll}px`);

    // Scroll down slowly to trigger animation
    const scrollSteps = [
      { percent: 0, name: 'Start' },
      { percent: 25, name: '25%' },
      { percent: 50, name: '50%' },
      { percent: 75, name: '75%' },
      { percent: 100, name: '100%' },
    ];

    for (const step of scrollSteps) {
      // Calculate scroll position (scroll about 1 viewport height)
      const scrollY = step.percent * 10; // Incremental scroll

      await page.evaluate((y) => {
        window.scrollBy({ top: y, behavior: 'smooth' });
      }, scrollY);

      await page.waitForTimeout(800);

      // Capture screenshot
      await page.screenshot({
        path: `test-results/scattered-${browserName}-6-scroll-${step.percent}.png`
      });

      // Check first word state
      const firstWord = await page.locator('.word').first();
      const wordCount = await page.locator('.word').count();

      if (wordCount > 0) {
        const opacity = await firstWord.evaluate((el) => {
          return window.getComputedStyle(el).opacity;
        });

        const transform = await firstWord.evaluate((el) => {
          return window.getComputedStyle(el).transform;
        });

        console.log(`  [3.${step.percent}] Scroll ${step.name}: opacity=${opacity}, transform=${transform.substring(0, 30)}...`);
      }
    }

    console.log(`  ✅ TEST 3 COMPLETE - Scroll animation tested\n`);
  });

  test('Test 4: Final Animation State', async ({ page, browserName }) => {
    console.log('\n========================================');
    console.log(`  TEST 4: FINAL ANIMATION STATE (${browserName.toUpperCase()})`);
    console.log('========================================');

    // Navigate to About section
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 960;
    const centerY = viewport ? viewport.height / 2 : 540;

    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);
    await page.mouse.click(400, 280);
    await page.waitForTimeout(4000);

    console.log(`  [4.1] Scrolling to paragraph section...`);

    // Scroll to ensure paragraph section is fully visible and animation complete
    await page.evaluate(() => {
      window.scrollTo({ top: 1200, behavior: 'smooth' });
    });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: `test-results/scattered-${browserName}-7-final-state.png` });

    // Check final state - words should be connected, full opacity
    const wordCount = await page.locator('.word').count();
    console.log(`  [4.2] Total words: ${wordCount}`);

    if (wordCount > 0) {
      const firstWord = await page.locator('.word').first();

      const opacity = await firstWord.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });

      const transform = await firstWord.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      console.log(`  [4.3] Final opacity: ${opacity} (should be 1.0)`);
      console.log(`  [4.4] Final transform: ${transform}`);

      const opacityFloat = parseFloat(opacity);
      const isConnected = transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)';

      if (opacityFloat >= 0.9 && isConnected) {
        console.log(`  ✅ Animation completed successfully!`);
        console.log(`     - Words reconnected: YES`);
        console.log(`     - Full opacity: YES`);
      } else {
        console.log(`  ❌ Animation may not have completed:`);
        console.log(`     - Words reconnected: ${isConnected ? 'YES' : 'NO'}`);
        console.log(`     - Full opacity: ${opacityFloat >= 0.9 ? 'YES' : 'NO'}`);
      }
    }

    console.log(`  ✅ TEST 4 COMPLETE - Final state checked\n`);
  });

  test('Test 5: Cross-Browser Summary', async ({ page, browserName }) => {
    console.log('\n========================================');
    console.log(`  TEST 5: BROWSER SUMMARY (${browserName.toUpperCase()})`);
    console.log('========================================');

    // Track console logs
    const consoleLogs: string[] = [];
    const errors: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      if (msg.type() === 'error') {
        errors.push(text);
      }
    });

    page.on('pageerror', err => {
      errors.push(err.message);
    });

    // Navigate to About section
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 960;
    const centerY = viewport ? viewport.height / 2 : 540;

    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);
    await page.mouse.click(400, 280);
    await page.waitForTimeout(4000);

    // Scroll through animation
    await page.evaluate(() => {
      window.scrollTo({ top: 1200, behavior: 'smooth' });
    });
    await page.waitForTimeout(3000);

    // Summary
    console.log(`\n  === ${browserName.toUpperCase()} SUMMARY ===`);
    console.log(`  Browser: ${browserName}`);
    console.log(`  Viewport: ${viewport?.width}x${viewport?.height}`);

    const scatteredTextLogs = consoleLogs.filter(log =>
      log.includes('ScatteredText') || log.includes('Browser:') || log.includes('Split')
    );

    console.log(`  ScatteredText logs found: ${scatteredTextLogs.length}`);
    scatteredTextLogs.forEach(log => {
      console.log(`    - ${log}`);
    });

    console.log(`  JavaScript errors: ${errors.length}`);
    if (errors.length > 0) {
      console.log(`  ❌ ERRORS DETECTED:`);
      errors.forEach(err => {
        console.log(`    - ${err}`);
      });
    } else {
      console.log(`  ✅ No JavaScript errors`);
    }

    const wordCount = await page.locator('.word').count();
    console.log(`  Words rendered: ${wordCount}`);

    if (wordCount > 0) {
      const firstWord = await page.locator('.word').first();
      const opacity = await firstWord.evaluate((el) => window.getComputedStyle(el).opacity);
      console.log(`  Final opacity: ${opacity}`);

      if (parseFloat(opacity) >= 0.9) {
        console.log(`  ✅ ANIMATION WORKING IN ${browserName.toUpperCase()}`);
      } else {
        console.log(`  ❌ ANIMATION NOT WORKING IN ${browserName.toUpperCase()}`);
      }
    } else {
      console.log(`  ❌ SPLITTYPE NOT WORKING IN ${browserName.toUpperCase()}`);
    }

    console.log(`========================================\n`);
  });
});
