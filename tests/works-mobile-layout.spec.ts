import { test, expect } from '@playwright/test';

test.describe('Works Page - Mobile Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/works');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  });

  test('should not have overlapping content', async ({ page }) => {
    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Get positions of last card and CTA section
    const lastCard = page.locator('.bento-card').last();
    const ctaSection = page.locator('text=Ready to Create Something Unforgettable?');

    const lastCardBox = await lastCard.boundingBox();
    const ctaBox = await ctaSection.boundingBox();

    expect(lastCardBox).toBeTruthy();
    expect(ctaBox).toBeTruthy();

    // Verify CTA is below last card with spacing
    expect(ctaBox!.y).toBeGreaterThan(lastCardBox!.y + lastCardBox!.height + 16);
  });

  test('should have proper card spacing', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const cards = page.locator('.bento-card');
    const count = await cards.count();

    // Check spacing between first two cards
    const card1 = await cards.nth(0).boundingBox();
    const card2 = await cards.nth(1).boundingBox();

    expect(card1).toBeTruthy();
    expect(card2).toBeTruthy();

    // Cards should have adequate spacing (minimum 16px)
    const spacing = card2!.y - (card1!.y + card1!.height);
    expect(spacing).toBeGreaterThanOrEqual(16);
  });

  test('cards should not touch screen edges', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('.bento-card').first();
    const cardBox = await firstCard.boundingBox();

    expect(cardBox).toBeTruthy();

    // Cards should have adequate margin from edges (minimum 16px)
    expect(cardBox!.x).toBeGreaterThanOrEqual(16);
    expect(cardBox!.x + cardBox!.width).toBeLessThan(375 - 8); // Allow some tolerance
  });

  test('should maintain 60fps during scroll', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Measure FPS during scroll
    const avgFps = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const frames: number[] = [];
        let lastTime = performance.now();

        function measureFrame() {
          const currentTime = performance.now();
          const fps = 1000 / (currentTime - lastTime);
          frames.push(fps);
          lastTime = currentTime;

          if (frames.length < 60) {
            requestAnimationFrame(measureFrame);
          } else {
            const avgFps = frames.reduce((a, b) => a + b) / frames.length;
            resolve(avgFps);
          }
        }

        // Scroll slowly
        window.scrollTo({ top: 1000, behavior: 'smooth' });
        requestAnimationFrame(measureFrame);
      });
    });

    expect(avgFps).toBeGreaterThan(55); // Allow 55+ FPS
  });
});
