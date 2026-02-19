import { test, expect } from '@playwright/test';
import { measureFPS, measureFPSDuringAction, logFPSMetrics } from './helpers/fps-measurement';
import { PERFORMANCE_THRESHOLDS } from './helpers/constants';

/**
 * Services Section Performance Tests
 *
 * These tests verify that the services section maintains 60fps during:
 * 1. Initial page load and rendering
 * 2. Scroll interactions (smooth scroll with Lenis)
 * 3. Card hover effects (icon animations, tilt, magnetic cursor)
 * 4. Mobile performance (reduced animations)
 * 5. Memory leak detection
 */

test.describe('Services Section Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to main page
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Wait for 3D logo to load
    await page.waitForTimeout(2000);

    // Open MENU and click SERVICES
    await page.click('button:has-text("MENU")');
    await page.waitForTimeout(500);
    await page.click('text=Services');
    await page.waitForTimeout(1000);
  });

  test('Test 1: Page Load Performance (60fps target)', async ({ page }) => {
    console.log('\n========== TEST 1: Page Load Performance ==========');

    // Navigate fresh to services section
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Start FPS measurement
    const metricsPromise = measureFPS(page, 3000);

    // Trigger navigation to services
    await page.click('button:has-text("MENU")');
    await page.waitForTimeout(500);
    await page.click('text=Services');

    // Wait for measurement to complete
    const metrics = await metricsPromise;

    logFPSMetrics('Page Load', metrics);

    // Assertions
    expect(metrics.avgFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT);

    console.log('✓ Page load maintains acceptable FPS');
  });

  test('Test 2: Scroll Performance with Lenis (60fps target)', async ({ page }) => {
    console.log('\n========== TEST 2: Scroll Performance ==========');

    // Wait for services section to fully load
    await page.waitForSelector('text=OUR SERVICES');
    await page.waitForTimeout(1000);

    // Measure FPS during scrolling
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        // Scroll down smoothly
        await page.evaluate(() => {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        });
        await page.waitForTimeout(500);

        // Scroll down more
        await page.evaluate(() => {
          window.scrollTo({ top: 1000, behavior: 'smooth' });
        });
        await page.waitForTimeout(500);

        // Scroll back up
        await page.evaluate(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      },
      2000
    );

    logFPSMetrics('Scroll Performance', metrics);

    // Assertions
    expect(metrics.avgFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT);

    console.log('✓ Smooth scroll maintains acceptable FPS');
  });

  test('Test 3: Card Hover Effects (60fps target)', async ({ page }) => {
    console.log('\n========== TEST 3: Card Hover Effects ==========');

    // Wait for cards to be visible
    await page.waitForSelector('.grid > div');
    await page.waitForTimeout(1000);

    // Get first card
    const firstCard = page.locator('.grid > div').first();

    // Measure FPS during hover
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        // Hover over card (triggers icon float, scale, tilt, magnetic cursor)
        await firstCard.hover();
        await page.waitForTimeout(500);

        // Move mouse around the card to trigger 3D tilt
        const box = await firstCard.boundingBox();
        if (box) {
          // Top-left
          await page.mouse.move(box.x + 50, box.y + 50);
          await page.waitForTimeout(100);

          // Top-right
          await page.mouse.move(box.x + box.width - 50, box.y + 50);
          await page.waitForTimeout(100);

          // Bottom-right
          await page.mouse.move(box.x + box.width - 50, box.y + box.height - 50);
          await page.waitForTimeout(100);

          // Bottom-left
          await page.mouse.move(box.x + 50, box.y + box.height - 50);
          await page.waitForTimeout(100);
        }

        // Hover off
        await page.mouse.move(0, 0);
      },
      1500
    );

    logFPSMetrics('Card Hover Effects', metrics);

    // Assertions
    expect(metrics.avgFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT);

    console.log('✓ Card hover effects maintain acceptable FPS');
  });

  test('Test 4: 3D Tilt Performance (60fps target)', async ({ page }) => {
    console.log('\n========== TEST 4: 3D Tilt Performance ==========');

    // Wait for cards
    await page.waitForSelector('.grid > div');
    await page.waitForTimeout(1000);

    const firstCard = page.locator('.grid > div').first();

    // Measure FPS during rapid tilt changes
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        const box = await firstCard.boundingBox();
        if (box) {
          // Rapid mouse movements to trigger tilt updates
          const centerX = box.x + box.width / 2;
          const centerY = box.y + box.height / 2;

          for (let i = 0; i < 10; i++) {
            await page.mouse.move(
              centerX + Math.random() * 100 - 50,
              centerY + Math.random() * 100 - 50
            );
            await page.waitForTimeout(50);
          }
        }
      },
      1500
    );

    logFPSMetrics('3D Tilt Performance', metrics);

    // Assertions
    expect(metrics.avgFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT);

    console.log('✓ 3D tilt maintains acceptable FPS');
  });

  test('Test 5: Mobile Performance (55fps target)', async ({ page, viewport }) => {
    console.log('\n========== TEST 5: Mobile Performance ==========');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Reload to apply mobile optimizations
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigate to services
    await page.waitForTimeout(2000);
    await page.click('button:has-text("MENU")');
    await page.waitForTimeout(500);
    await page.click('text=Services');
    await page.waitForTimeout(1000);

    // Measure FPS during scrolling (mobile has reduced animations)
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        await page.evaluate(() => {
          window.scrollTo({ top: 500, behavior: 'smooth' });
        });
        await page.waitForTimeout(500);

        await page.evaluate(() => {
          window.scrollTo({ top: 1000, behavior: 'smooth' });
        });
      },
      2000
    );

    logFPSMetrics('Mobile Performance', metrics);

    // Mobile target is slightly lower (55fps) due to device constraints
    expect(metrics.avgFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.CRITICAL_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT * 2);

    console.log('✓ Mobile performance acceptable (animations disabled)');
  });

  test('Test 6: Memory Leak Detection', async ({ page }) => {
    console.log('\n========== TEST 6: Memory Leak Detection ==========');

    // Get initial memory usage
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize / 1024 / 1024, // MB
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize / 1024 / 1024,
        };
      }
      return null;
    });

    if (!initialMetrics) {
      console.log('⚠ Memory API not available (requires --enable-precise-memory-info)');
      test.skip();
      return;
    }

    console.log(`Initial memory: ${initialMetrics.usedJSHeapSize.toFixed(2)} MB`);

    // Simulate repeated interactions
    for (let i = 0; i < 10; i++) {
      const cards = page.locator('.grid > div');
      const card = cards.nth(i % 4); // Cycle through 4 cards

      // Hover and unhover
      await card.hover();
      await page.waitForTimeout(200);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);
    }

    // Force garbage collection if possible
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });

    await page.waitForTimeout(1000);

    // Get final memory usage
    const finalMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize / 1024 / 1024,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize / 1024 / 1024,
        };
      }
      return null;
    });

    if (finalMetrics) {
      console.log(`Final memory: ${finalMetrics.usedJSHeapSize.toFixed(2)} MB`);

      const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
      console.log(`Memory increase: ${memoryIncrease.toFixed(2)} MB`);

      // Memory shouldn't increase by more than 20MB after repeated interactions
      expect(memoryIncrease).toBeLessThan(20);

      console.log('✓ No significant memory leaks detected');
    }
  });
});
