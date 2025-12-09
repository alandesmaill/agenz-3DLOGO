import { test, expect } from '@playwright/test';

test.describe('Morph Animation Navigation', () => {
  test('should show all sections after morph animation', async ({ page }) => {
    // Navigate to works page
    await page.goto('http://localhost:3001/works');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take screenshot of works page
    await page.screenshot({ path: 'test-results/01-works-page.png', fullPage: true });

    // Find first project card (the gradient box with cursor-pointer)
    const firstCard = page.locator('.cursor-pointer').first();

    // Scroll to the card if needed
    await firstCard.scrollIntoViewIfNeeded();

    // Click the card
    await firstCard.click();
    console.log('✅ Clicked first project card');

    // Wait for morph animation (1.2s) + navigation
    await page.waitForTimeout(1500);

    // Wait for detail page to load
    await page.waitForURL(/\/works\/.+/);
    await page.waitForLoadState('networkidle');
    console.log('✅ Navigated to detail page');

    // Wait a bit more for any animations
    await page.waitForTimeout(500);

    // Take screenshot immediately after navigation
    await page.screenshot({ path: 'test-results/02-after-morph.png', fullPage: true });

    // Check visibility of hero section
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
    console.log('✅ Hero section is visible');

    // Check visibility of overview section
    const overview = page.getByText('The Challenge');
    const isOverviewVisible = await overview.isVisible({ timeout: 1000 }).catch(() => false);
    console.log(`Overview visible: ${isOverviewVisible}`);

    // Check visibility of other sections
    const sections = await page.locator('section').count();
    console.log(`Total sections found: ${sections}`);

    // Get visible sections
    const visibleSections = await page.locator('section:visible').count();
    console.log(`Visible sections immediately after morph: ${visibleSections}`);

    // Check for overlay elements
    const overlays = await page.locator('[style*="z-index: 9999"]').count();
    console.log(`Overlay elements found: ${overlays}`);

    // Scroll down 500px
    console.log('Scrolling down 500px...');
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);

    // Take screenshot after scrolling
    await page.screenshot({ path: 'test-results/03-after-scroll.png', fullPage: true });

    // Check if more sections are visible now
    const visibleAfterScroll = await page.locator('section:visible').count();
    console.log(`Visible sections after scroll: ${visibleAfterScroll}`);

    // Check if overview is visible after scroll
    const isOverviewVisibleAfterScroll = await overview.isVisible();
    console.log(`Overview visible after scroll: ${isOverviewVisibleAfterScroll}`);

    // Assert that all sections should be visible
    expect(visibleAfterScroll).toBeGreaterThan(3);
  });

  test('should show all sections after direct navigation', async ({ page }) => {
    // Navigate directly to detail page (no morph)
    await page.goto('http://localhost:3001/works/techflow-pro');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/04-direct-navigation.png', fullPage: true });

    // Count visible sections
    const visibleSections = await page.locator('section:visible').count();
    console.log(`Visible sections (direct nav): ${visibleSections}`);

    // Check if overview is visible
    const overview = page.getByText('The Challenge');
    const isOverviewVisible = await overview.isVisible();
    console.log(`Overview visible (direct nav): ${isOverviewVisible}`);

    // Should have multiple sections visible
    expect(visibleSections).toBeGreaterThan(3);
  });
});
