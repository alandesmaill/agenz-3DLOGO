import { test, expect } from '@playwright/test';

test.describe('Header Functionality Tests', () => {
  test('GET IN TOUCH opens Contact Modal', async ({ page }) => {
    console.log('\n=== Testing GET IN TOUCH Button ===');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Screenshot before
    await page.screenshot({ path: 'test-results/header-before-contact.png' });

    // Click GET IN TOUCH
    const getInTouchBtn = await page.locator('button:has-text("GET IN TOUCH")').first();
    await getInTouchBtn.click();
    await page.waitForTimeout(500);

    // Screenshot after
    await page.screenshot({ path: 'test-results/header-contact-modal.png' });

    // Check modal content
    const modalTitle = await page.locator('text=Get In Touch').count();
    console.log(`Contact modal title: ${modalTitle > 0 ? 'YES' : 'NO'}`);

    const email = await page.locator('text=hello@agenz.com').count();
    console.log(`Email displayed: ${email > 0 ? 'YES' : 'NO'}`);

    const phone = await page.locator('text=+1 (234) 567-890').count();
    console.log(`Phone displayed: ${phone > 0 ? 'YES' : 'NO'}`);

    // Close modal by clicking outside
    await page.mouse.click(50, 50);
    await page.waitForTimeout(500);

    // Verify modal closed
    const modalAfterClose = await page.locator('text=Get In Touch').isVisible().catch(() => false);
    console.log(`Modal closed: ${!modalAfterClose ? 'YES' : 'NO'}`);

    expect(modalTitle).toBeGreaterThan(0);
  });

  test('MENU opens Full-Screen Navigation', async ({ page }) => {
    console.log('\n=== Testing MENU Button ===');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Click MENU
    const menuBtn = await page.locator('button:has-text("MENU")').first();
    await menuBtn.click();
    await page.waitForTimeout(600);

    // Screenshot menu open
    await page.screenshot({ path: 'test-results/header-menu-overlay.png' });

    // Check all nav items (now in sidebar with proper case)
    const navItems = ['About', 'Works', 'Services', 'Contact'];
    for (const item of navItems) {
      const found = await page.locator(`button:has-text("${item}")`).count();
      console.log(`${item} link: ${found > 0 ? 'YES' : 'NO'}`);
    }

    // Check close button (X icon with aria-label)
    const closeBtn = await page.locator('button[aria-label="Close menu"]').count();
    console.log(`Close button (X icon): ${closeBtn > 0 ? 'YES' : 'NO'}`);

    // Click close button
    await page.locator('button[aria-label="Close menu"]').click();
    await page.waitForTimeout(600);

    // Verify menu closed
    await page.screenshot({ path: 'test-results/header-menu-closed.png' });

    expect(closeBtn).toBeGreaterThan(0);
  });

  test('Menu navigation goes to sections', async ({ page }) => {
    console.log('\n=== Testing Menu Navigation ===');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Open menu
    await page.locator('button:has-text("MENU")').click();
    await page.waitForTimeout(600);

    // Click About from sidebar menu
    await page.locator('button:has-text("About")').first().click();
    await page.waitForTimeout(1000);

    // Screenshot
    await page.screenshot({ path: 'test-results/header-menu-to-about.png' });

    // Check if About section opened
    const aboutSection = await page.locator('text=WE CREATE PURPOSEFUL').count();
    console.log(`About section opened from menu: ${aboutSection > 0 ? 'YES' : 'NO'}`);

    expect(aboutSection).toBeGreaterThan(0);
  });

  test('Smooth back navigation (no page reload)', async ({ page }) => {
    console.log('\n=== Testing Smooth Back Navigation ===');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Navigate to Works via menu
    await page.locator('button:has-text("MENU")').click();
    await page.waitForTimeout(600);
    await page.locator('button:has-text("Works")').first().click();
    await page.waitForTimeout(1000);

    // Screenshot in section
    await page.screenshot({ path: 'test-results/header-in-works.png' });

    // Click BACK
    const startTime = Date.now();
    await page.locator('text=BACK').click();
    await page.waitForTimeout(800);
    const endTime = Date.now();

    // Screenshot after back
    await page.screenshot({ path: 'test-results/header-after-back.png' });

    // Check that it was fast (no page reload)
    const transitionTime = endTime - startTime;
    console.log(`Back transition time: ${transitionTime}ms`);
    console.log(`Smooth back (< 2000ms): ${transitionTime < 2000 ? 'YES' : 'NO'}`);

    // Check canvas is visible
    const canvas = await page.locator('canvas').first();
    const canvasVisible = await canvas.isVisible();
    console.log(`Canvas visible after back: ${canvasVisible ? 'YES' : 'NO'}`);

    expect(transitionTime).toBeLessThan(2000);
  });
});
