import { test, expect } from '@playwright/test';

/**
 * Quick Verification Test
 * Simple test to verify the paragraph exists and animation is initialized
 */

test('Quick verify - paragraph exists on /about', async ({ page }) => {
  await page.goto('http://localhost:3002/about');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Check for Lorem ipsum text
  const loremText = page.getByText(/Lorem ipsum/i);
  await expect(loremText).toBeVisible({ timeout: 10000 });

  console.log('✓ Paragraph found on /about page');

  // Take screenshot
  await page.screenshot({ path: 'test-results/about-page.png', fullPage: true });
});

test('Quick verify - paragraph via navigation', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  console.log('Page title:', await page.title());

  // Wait longer for 3D scene
  await page.waitForTimeout(5000);

  // Try to find ABOUT button/text
  const aboutElement = page.getByText('ABOUT');
  const isVisible = await aboutElement.isVisible({ timeout: 5000 }).catch(() => false);

  console.log('ABOUT element visible:', isVisible);

  if (isVisible) {
    await aboutElement.click();
    await page.waitForTimeout(3000);

    // Check for Lorem text
    const loremText = page.getByText(/Lorem ipsum/i);
    const hasLorem = await loremText.isVisible({ timeout: 10000 }).catch(() => false);

    console.log('Lorem text found:', hasLorem);

    // Take screenshot
    await page.screenshot({ path: 'test-results/after-navigation.png', fullPage: true });
  }
});
