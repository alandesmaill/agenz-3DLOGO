import { test, expect } from '@playwright/test';

test.describe('About Section Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to About section by triggering navigation
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for initial loading
    await page.waitForTimeout(5000);

    // Trigger decomposition by hovering over the logo
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2500);

    // Click multiple positions to trigger about section
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(550 + i * 50, 400);
      await page.waitForTimeout(500);
    }

    // Wait for about section to load
    await page.waitForTimeout(3000);
  });

  test('Layout: Header has proper padding', async ({ page }) => {
    console.log('\n=== Layout Test: Header Padding ===');

    // Take screenshot
    await page.screenshot({ path: 'test-results/layout-header.png', fullPage: true });

    // Check header element
    const header = await page.locator('header').first();
    const headerBox = await header.boundingBox();

    if (headerBox) {
      console.log(`Header height: ${headerBox.height}px`);
      console.log(`Header Y position: ${headerBox.y}px`);

      // Header should have decent padding (py-6 = 24px top + 24px bottom)
      expect(headerBox.height).toBeGreaterThanOrEqual(60);
    }

    // Check logo is visible
    const logo = await page.locator('img[alt*="logo"]').first();
    const logoVisible = await logo.isVisible().catch(() => false);
    console.log(`Logo visible: ${logoVisible ? 'YES' : 'NO'}`);
  });

  test('Layout: Title section has proper spacing', async ({ page }) => {
    console.log('\n=== Layout Test: Title Spacing ===');

    // Check title element
    const title = await page.locator('h2').first();
    const titleBox = await title.boundingBox();

    if (titleBox) {
      console.log(`Title Y position: ${titleBox.y}px`);
      console.log(`Title height: ${titleBox.height}px`);

      // Title should not be at the very top
      expect(titleBox.y).toBeGreaterThan(50);
    }

    await page.screenshot({ path: 'test-results/layout-title.png' });
  });

  test('Layout: 3D sphere container extends properly', async ({ page }) => {
    console.log('\n=== Layout Test: Sphere Container ===');

    // Check the 3D scene container (has flex-1 class)
    const sceneContainer = await page.locator('.flex-1.min-h-0').first();
    const containerBox = await sceneContainer.boundingBox();

    if (containerBox) {
      console.log(`3D Container Y: ${containerBox.y}px`);
      console.log(`3D Container height: ${containerBox.height}px`);
      console.log(`3D Container bottom: ${containerBox.y + containerBox.height}px`);

      // Container should have significant height
      expect(containerBox.height).toBeGreaterThan(200);
    }

    // Check canvas is rendered
    const canvas = await page.locator('canvas').first();
    const canvasBox = await canvas.boundingBox();

    if (canvasBox) {
      console.log(`Canvas size: ${canvasBox.width}x${canvasBox.height}px`);
    }

    await page.screenshot({ path: 'test-results/layout-sphere-container.png' });
  });

  test('Layout: Scroll Down text is fully visible', async ({ page }) => {
    console.log('\n=== Layout Test: Scroll Down Text ===');

    // Find the scroll down container
    const scrollContainer = await page.locator('text=Scroll Down').first();
    const containerBox = await scrollContainer.boundingBox();

    if (containerBox) {
      console.log(`Scroll text Y: ${containerBox.y}px`);
      console.log(`Scroll text height: ${containerBox.height}px`);
      console.log(`Scroll text bottom: ${containerBox.y + containerBox.height}px`);

      // Get viewport height
      const viewportSize = page.viewportSize();
      if (viewportSize) {
        console.log(`Viewport height: ${viewportSize.height}px`);

        // Text should be fully within viewport
        expect(containerBox.y + containerBox.height).toBeLessThanOrEqual(viewportSize.height);
      }
    }

    // Check multiple scroll down instances (infinite text)
    const scrollDownCount = await page.locator('text=Scroll Down').count();
    console.log(`Scroll Down instances: ${scrollDownCount}`);
    expect(scrollDownCount).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/layout-scroll-down.png' });
  });

  test('Layout: Full page visual check', async ({ page }) => {
    console.log('\n=== Layout Test: Full Page Visual ===');

    // Take full page screenshot
    await page.screenshot({ path: 'test-results/layout-full-page.png', fullPage: true });

    // Get all main sections
    const header = await page.locator('header').first().boundingBox();
    const title = await page.locator('h2').first().boundingBox();

    // Log positions
    if (header && title) {
      console.log(`Gap between header and title: ${title.y - (header.y + header.height)}px`);
    }

    // Check section exists
    const aboutSection = await page.locator('section').first();
    expect(await aboutSection.isVisible()).toBe(true);

    console.log('Full page layout check completed');
  });

  test.afterAll(async () => {
    console.log('\n=== All Layout Tests Complete ===');
  });
});
