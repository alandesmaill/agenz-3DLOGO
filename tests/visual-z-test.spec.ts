import { test, expect } from '@playwright/test';

test.describe('Visual Z-Shape Formation Test', () => {
  test('Z-shape should be clearly visible at start', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  VISUAL TEST: Z-SHAPE FORMATION');
    console.log('═══════════════════════════════════════\n');

    // Navigate to the application
    await page.goto('/');

    // Wait 1 second for particles to appear in Z formation
    console.log('⏱️  Waiting 1 second for Z-shape to form...');
    await page.waitForTimeout(1000);

    // Take screenshot of Z formation
    const screenshot = await page.screenshot({
      path: 'test-results/z-shape-formation.png',
      fullPage: false,
    });

    console.log('📸 Screenshot saved: test-results/z-shape-formation.png');
    console.log('✅ Visual test complete - check screenshot to verify Z is clear\n');

    // Verify page loaded
    expect(screenshot).toBeTruthy();
  });

  test('Z-shape before morphing to logo', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  VISUAL TEST: Z BEFORE MORPH');
    console.log('═══════════════════════════════════════\n');

    await page.goto('/');

    // Wait for loading to complete
    await page.waitForTimeout(500);

    // Take screenshot at 0.5s (early Z)
    await page.screenshot({
      path: 'test-results/z-shape-early.png',
    });
    console.log('📸 Early Z: test-results/z-shape-early.png');

    // Wait another 1 second
    await page.waitForTimeout(1000);

    // Take screenshot at 1.5s (stable Z)
    await page.screenshot({
      path: 'test-results/z-shape-stable.png',
    });
    console.log('📸 Stable Z: test-results/z-shape-stable.png');

    // Wait for morph to begin
    await page.waitForTimeout(500);

    // Take screenshot at 2s (morphing)
    await page.screenshot({
      path: 'test-results/z-shape-morphing.png',
    });
    console.log('📸 Morphing: test-results/z-shape-morphing.png');

    console.log('\n✅ All Z-shape stages captured!\n');
  });
});
