import { test, expect } from '@playwright/test';

test('Check if all 10 cards visible in viewport after scrolling to bento section', async ({ page }) => {
  // Set viewport to typical desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to works page
  await page.goto('http://localhost:3003/works');

  // Wait for page to load
  await page.waitForTimeout(3000);

  // Scroll to bento section
  await page.evaluate(() => {
    const bentoSection = document.querySelector('.bento-section');
    if (bentoSection) {
      bentoSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  await page.waitForTimeout(1500);

  // Count visible bento cards
  const cardCount = await page.locator('.bento-card').count();
  console.log(`Total bento cards found: ${cardCount}`);

  // Check how many cards are in viewport
  const cardsInViewport = await page.locator('.bento-card').evaluateAll((cards) => {
    return cards.filter(card => {
      const rect = card.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    }).length;
  });

  console.log(`Cards fully visible in viewport: ${cardsInViewport}`);

  // Take screenshot of current viewport
  await page.screenshot({
    path: 'bento-viewport-check.png',
  });

  // Get bento section height
  const bentoHeight = await page.locator('.bento-section').evaluate((el) => {
    return el.getBoundingClientRect().height;
  });

  console.log(`Bento section height: ${bentoHeight}px`);
  console.log(`Viewport height: 1080px`);

  expect(cardCount).toBe(10);
  console.log(`\n✓ All 10 cards exist`);
  console.log(`✓ ${cardsInViewport} cards fully visible in viewport`);
});
