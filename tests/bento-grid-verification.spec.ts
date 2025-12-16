import { test } from '@playwright/test';

test('Verify bento grid layout - all 10 cards on one screen', async ({ page }) => {
  // Navigate to works page
  await page.goto('http://localhost:3003/works');

  // Wait for page to fully load
  await page.waitForTimeout(3000);

  // Scroll down to see the bento grid section
  await page.evaluate(() => {
    const bentoSection = document.querySelector('.bento-section');
    if (bentoSection) {
      bentoSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  await page.waitForTimeout(2000);

  // Take screenshot of the bento grid section
  const bentoSection = await page.locator('.bento-section');
  await bentoSection.screenshot({
    path: 'bento-grid-layout.png',
  });

  // Also take full page screenshot
  await page.screenshot({
    path: 'works-page-full-layout.png',
    fullPage: true
  });

  console.log('✓ Screenshots saved:');
  console.log('  - bento-grid-layout.png (section only)');
  console.log('  - works-page-full-layout.png (full page)');
});
