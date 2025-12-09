import { test, expect } from '@playwright/test';

const ANIMATION_TIMINGS = {
  ANTICIPATION: 150,
  MORPH: 1200,
  DOUBLE_RAF: 40,
  SAFETY_DELAY: 50,  // New improvement
  FADE: 300,  // Updated from 200ms
  TOTAL: 1740,  // Updated total
} as const;

test.describe('Morph Animation Flash Analysis', () => {
  test('should capture complete morph transition with detailed timing', async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('http://localhost:3001/works');
    await page.waitForLoadState('networkidle');

    console.log('✅ Works page loaded');

    // Find first project card
    const firstCard = page.locator('.cursor-pointer').first();
    await firstCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Take pre-morph screenshot
    await page.screenshot({
      path: 'test-results/morph-analysis/01-pre-click.png',
    });
    console.log('📸 Screenshot: Pre-click state');

    // Track exact click time
    const clickTime = Date.now();
    await firstCard.click();
    console.log('🖱️ Card clicked at t=0ms');

    // Wait for anticipation phase
    await page.waitForTimeout(ANIMATION_TIMINGS.ANTICIPATION + 50);
    await page.screenshot({
      path: 'test-results/morph-analysis/02-anticipation-complete.png',
    });
    console.log(`📸 Anticipation complete (t=${ANIMATION_TIMINGS.ANTICIPATION}ms)`);

    // Capture during morph (halfway)
    await page.waitForTimeout(600);
    await page.screenshot({
      path: 'test-results/morph-analysis/03-morph-halfway.png',
    });
    console.log('📸 Morph halfway (t=750ms)');

    // Capture just before morph completes
    await page.waitForTimeout(550);
    const preRAFTime = Date.now() - clickTime;
    await page.screenshot({
      path: 'test-results/morph-analysis/04-pre-raf-complete.png',
    });
    console.log(`📸 Pre-RAF morph complete (t=${preRAFTime}ms)`);

    // During RAF + safety delay
    await page.waitForTimeout(ANIMATION_TIMINGS.DOUBLE_RAF + ANIMATION_TIMINGS.SAFETY_DELAY);
    const paintTime = Date.now() - clickTime;
    await page.screenshot({
      path: 'test-results/morph-analysis/05-after-paint-delay.png',
    });
    console.log(`📸 After paint + safety delay (t=${paintTime}ms)`);

    // Fade start
    await page.waitForTimeout(50);
    await page.screenshot({
      path: 'test-results/morph-analysis/06-fade-start.png',
    });
    console.log('📸 Fade animation starts');

    // Fade 50% complete
    await page.waitForTimeout(150);
    const fade50Time = Date.now() - clickTime;
    await page.screenshot({
      path: 'test-results/morph-analysis/07-fade-50-percent.png',
    });
    console.log(`📸 Fade 50% (t=${fade50Time}ms)`);

    // Fade complete
    await page.waitForTimeout(150);
    const fadeCompleteTime = Date.now() - clickTime;
    await page.screenshot({
      path: 'test-results/morph-analysis/08-fade-complete.png',
    });
    console.log(`📸 Fade complete (t=${fadeCompleteTime}ms)`);

    // Wait for navigation
    await page.waitForURL(/\/works\/.+/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    const totalTime = Date.now() - clickTime;
    console.log(`✅ Total animation time: ${totalTime}ms (expected: ~${ANIMATION_TIMINGS.TOTAL}ms)`);

    // Final screenshot
    await page.screenshot({
      path: 'test-results/morph-analysis/09-detail-page-stable.png',
      fullPage: true,
    });
    console.log('📸 Detail page fully stable');

    // Verify overlay cleanup
    const overlayCount = await page.locator('[style*="z-index: 9999"]').count();
    console.log(`\n🔍 Overlay elements remaining: ${overlayCount} (should be 0)`);
    expect(overlayCount).toBe(0);

    // Verify sections visible
    const sections = await page.locator('section').count();
    console.log(`📄 Sections found: ${sections}`);
    expect(sections).toBeGreaterThan(0);

    console.log('\n✅ All assertions passed');
  });

  test('should detect visual flashes during transition', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Inject pixel sampling script
    await page.addInitScript(() => {
      (window as any).__pixelSamples = [];

      const sampleColor = () => {
        const overlay = document.querySelector('[style*="z-index: 9999"]') as HTMLElement | null;
        if (overlay) {
          const computed = window.getComputedStyle(overlay);
          (window as any).__pixelSamples.push({
            time: performance.now(),
            opacity: computed.opacity,
            background: computed.background,
          });
        }
        setTimeout(sampleColor, 10); // Sample every 10ms
      };

      sampleColor();
    });

    await page.goto('http://localhost:3001/works');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('.cursor-pointer').first();
    await firstCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await firstCard.click();

    // Wait for complete transition
    await page.waitForTimeout(ANIMATION_TIMINGS.TOTAL + 500);
    await page.waitForURL(/\/works\/.+/);
    await page.waitForLoadState('networkidle');

    // Get opacity samples
    const samples = await page.evaluate(() => {
      return (window as any).__pixelSamples || [];
    });

    console.log('\n🔍 Overlay opacity samples:');
    if (samples.length > 0) {
      console.log(`  Total samples: ${samples.length}`);
      console.log(`  First opacity: ${samples[0].opacity}`);
      console.log(`  Last opacity: ${samples[samples.length - 1].opacity}`);

      // Check for discontinuities (sudden opacity jumps)
      let maxJump = 0;
      for (let i = 1; i < samples.length; i++) {
        const prev = parseFloat(samples[i - 1].opacity);
        const curr = parseFloat(samples[i].opacity);
        const jump = Math.abs(curr - prev);
        if (jump > maxJump) {
          maxJump = jump;
        }
      }
      console.log(`  Max opacity jump: ${maxJump.toFixed(3)}`);
      console.log(`  ${maxJump < 0.1 ? '✅ Smooth fade' : '⚠️  Discontinuous fade'}`);
    }

    expect(samples.length).toBeGreaterThan(0);
  });

  test('should measure exact timing consistency across multiple runs', async ({ page }) => {
    await page.goto('http://localhost:3001/works');
    await page.waitForLoadState('networkidle');

    const timings: number[] = [];

    // Test 3 different cards
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        await page.goto('http://localhost:3001/works');
        await page.waitForLoadState('networkidle');
      }

      const card = page.locator('.cursor-pointer').nth(i);
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const startTime = Date.now();
      await card.click();

      await page.waitForURL(/\/works\/.+/).catch(() => {});
      await page.waitForLoadState('networkidle');

      const totalTime = Date.now() - startTime;
      timings.push(totalTime);

      console.log(`  Run ${i + 1}: ${totalTime}ms`);
    }

    // Calculate statistics
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    const maxDeviation = Math.max(...timings.map((t) => Math.abs(t - avgTiming)));

    console.log(`\n📊 Timing Statistics:`);
    console.log(`  Average: ${avgTiming.toFixed(0)}ms`);
    console.log(`  Expected: ~${ANIMATION_TIMINGS.TOTAL}ms`);
    console.log(`  Min: ${Math.min(...timings)}ms, Max: ${Math.max(...timings)}ms`);
    console.log(`  Max deviation: ${maxDeviation.toFixed(0)}ms`);

    // Timings should be consistent (within 200ms variance)
    expect(maxDeviation).toBeLessThan(200);
  });
});
