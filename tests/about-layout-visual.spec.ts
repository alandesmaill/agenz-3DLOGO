import { test, expect } from '@playwright/test';

test.describe('About Section Layout Visual Tests', () => {
  test('Capture About section layout', async ({ page }) => {
    console.log('\n=== About Section Layout Visual Test ===');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for scene to fully load
    await page.waitForTimeout(7000);

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/layout-1-initial.png' });

    // Hover to trigger decomposition - use center of screen
    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 640;
    const centerY = viewport ? viewport.height / 2 : 360;

    console.log(`Hovering at center (${centerX}, ${centerY})`);
    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4000);

    // Take screenshot after decomposition
    await page.screenshot({ path: 'test-results/layout-2-decomposed.png' });

    // Look for ABOUT label and click it
    // The ABOUT label should appear on hover of top-left navigation piece
    // Try clicking the ABOUT text directly if visible
    const aboutLabel = page.locator('text=ABOUT').first();
    const aboutLabelVisible = await aboutLabel.isVisible().catch(() => false);

    if (aboutLabelVisible) {
      console.log('Found ABOUT label, clicking...');
      await aboutLabel.click();
    } else {
      // Try multiple positions in the top-left quadrant for ABOUT
      // NAV_SECTIONS shows ABOUT at (-0.6, 1.5, 1.0) - top-left
      console.log('ABOUT label not visible, trying position clicks...');

      // ABOUT should be top-left after decomposition
      // Try positions in upper-left quadrant
      const positions = [
        { x: centerX - 200, y: centerY - 150 }, // Top-left
        { x: centerX - 150, y: centerY - 100 },
        { x: centerX - 100, y: centerY - 50 },
        { x: 400, y: 300 },
        { x: 450, y: 350 },
      ];

      for (const pos of positions) {
        // First hover to show label
        await page.mouse.move(pos.x, pos.y);
        await page.waitForTimeout(500);

        // Check if ABOUT label appeared
        const labelNow = await page.locator('text=ABOUT').first().isVisible().catch(() => false);
        if (labelNow) {
          console.log(`ABOUT label appeared at (${pos.x}, ${pos.y}), clicking...`);
          await page.mouse.click(pos.x, pos.y);
          await page.waitForTimeout(3000);
          break;
        }
      }
    }

    // Wait for transition
    await page.waitForTimeout(4000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/layout-3-after-click.png' });

    // Check if we're in About section by looking for the specific title
    const purposefulTitle = await page.locator('text=WE CREATE PURPOSEFUL').count();
    const scrollDownText = await page.locator('text=Scroll Down').count();

    console.log(`"WE CREATE PURPOSEFUL" found: ${purposefulTitle > 0}`);
    console.log(`"Scroll Down" found: ${scrollDownText > 0}`);

    if (purposefulTitle > 0) {
      console.log('SUCCESS: About section is displayed!');

      // Take detailed layout screenshots
      await page.screenshot({ path: 'test-results/layout-about-full.png', fullPage: true });

      // Check header
      const header = await page.locator('header').first();
      const headerBox = await header.boundingBox();
      if (headerBox) {
        console.log(`Header: height=${headerBox.height}px, y=${headerBox.y}px`);
      }

      // Check scroll down visibility
      const scrollDownEl = await page.locator('text=Scroll Down').first();
      const scrollBox = await scrollDownEl.boundingBox();
      if (scrollBox) {
        console.log(`Scroll Down: y=${scrollBox.y}px, height=${scrollBox.height}px`);
        const viewportHeight = viewport?.height || 720;
        console.log(`Viewport height: ${viewportHeight}px`);
        console.log(`Scroll Down bottom: ${scrollBox.y + scrollBox.height}px`);

        // Check if scroll down is within viewport
        if (scrollBox.y + scrollBox.height <= viewportHeight) {
          console.log('PASS: Scroll Down text is fully visible');
        } else {
          console.log('FAIL: Scroll Down text is cut off');
        }
      }

      // Check sphere container
      const sphereContainer = await page.locator('.rounded-2xl canvas').first();
      const canvasBox = await sphereContainer.boundingBox();
      if (canvasBox) {
        console.log(`3D Canvas: y=${canvasBox.y}px, height=${canvasBox.height}px`);
      }
    } else {
      console.log('Did not reach About section - may have clicked wrong piece');
    }

    // Final screenshot
    await page.screenshot({ path: 'test-results/layout-final.png' });
    console.log('Test completed');
  });
});
