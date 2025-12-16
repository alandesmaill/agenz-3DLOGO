import { test } from '@playwright/test';

test('Capture Works page screenshot', async ({ page }) => {
  // Navigate to works page
  await page.goto('http://localhost:3002/works');

  // Wait for page to load
  await page.waitForTimeout(2000);

  // Scroll down to see the bento grid
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.waitForTimeout(1000);

  // Take full page screenshot
  await page.screenshot({
    path: 'works-page-full.png',
    fullPage: true
  });

  console.log('✓ Screenshot saved to works-page-full.png');
});
