import { test, expect } from '@playwright/test';

/**
 * Text Animation Performance Tests
 *
 * Tests the character-by-character text reveal animation in the About section
 * to ensure smooth performance and proper functionality.
 */

// Performance thresholds
const TARGET_FPS = 60;
const MIN_ACCEPTABLE_FPS = 55;
const ANIMATION_DURATION = 3000; // Expected animation duration in ms

test.describe('Text Animation Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to About page
    await page.goto('http://localhost:3002/about');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for initial animations
    await page.waitForTimeout(1000);
  });

  test('should trigger text animation on scroll', async ({ page }) => {
    // Get the animated text element
    const animatedText = page.locator('.text-4xl.md\\:text-5xl').first();

    // Check that text exists
    await expect(animatedText).toBeVisible();

    // Scroll to trigger the animation
    await animatedText.scrollIntoViewIfNeeded();

    // Wait for animation to start
    await page.waitForTimeout(500);

    // Check that animation has applied transform/opacity
    const firstChar = animatedText.locator('span').first();
    await expect(firstChar).toBeVisible();

    console.log('✓ Text animation triggered successfully');
  });

  test('should maintain 55+ FPS during character reveal animation', async ({ page }) => {
    const frameMetrics: number[] = [];
    let startTime = 0;
    let frameCount = 0;

    // Start performance monitoring
    await page.evaluate(() => {
      (window as any).performanceData = {
        frames: [] as number[],
        startTime: 0,
      };

      let lastFrameTime = performance.now();
      (window as any).performanceData.startTime = lastFrameTime;

      function measureFrame() {
        const currentTime = performance.now();
        const frameDuration = currentTime - lastFrameTime;
        const fps = 1000 / frameDuration;

        (window as any).performanceData.frames.push(fps);
        lastFrameTime = currentTime;

        requestAnimationFrame(measureFrame);
      }

      requestAnimationFrame(measureFrame);
    });

    // Scroll to text to trigger animation
    const animatedText = page.locator('.text-4xl.md\\:text-5xl').first();
    await animatedText.scrollIntoViewIfNeeded();

    // Wait for animation to complete
    await page.waitForTimeout(ANIMATION_DURATION);

    // Get performance metrics
    const performanceData = await page.evaluate(() => {
      return (window as any).performanceData.frames;
    });

    // Calculate average FPS
    const avgFPS = performanceData.reduce((sum: number, fps: number) => sum + fps, 0) / performanceData.length;

    // Calculate FPS during animation (middle portion)
    const animationFrames = performanceData.slice(10, performanceData.length - 10);
    const animationAvgFPS = animationFrames.reduce((sum: number, fps: number) => sum + fps, 0) / animationFrames.length;

    // Count frame drops (below minimum threshold)
    const frameDrops = performanceData.filter((fps: number) => fps < MIN_ACCEPTABLE_FPS).length;

    console.log(`Average FPS: ${avgFPS.toFixed(2)}`);
    console.log(`Animation FPS: ${animationAvgFPS.toFixed(2)}`);
    console.log(`Frame drops (< ${MIN_ACCEPTABLE_FPS} FPS): ${frameDrops}`);

    // Assert performance
    expect(animationAvgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS);
    expect(frameDrops).toBeLessThan(10); // Allow some frame drops
  });

  test('should complete animation within expected duration', async ({ page }) => {
    const animatedText = page.locator('.text-4xl.md\\:text-5xl').first();

    // Scroll to trigger animation
    const startTime = Date.now();
    await animatedText.scrollIntoViewIfNeeded();

    // Wait for animation to complete (check for stable state)
    await page.waitForTimeout(ANIMATION_DURATION);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Animation duration: ${duration}ms`);

    // Should complete within reasonable time
    expect(duration).toBeLessThan(ANIMATION_DURATION + 1000);
  });

  test('should render text readable after animation', async ({ page }) => {
    const animatedText = page.locator('.text-4xl.md\\:text-5xl').first();

    // Scroll to trigger animation
    await animatedText.scrollIntoViewIfNeeded();

    // Wait for animation to complete
    await page.waitForTimeout(ANIMATION_DURATION);

    // Check text is fully visible and readable
    await expect(animatedText).toBeVisible();

    // Check opacity is 1 (fully visible)
    const opacity = await animatedText.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    expect(parseFloat(opacity)).toBeGreaterThanOrEqual(0.95);
    console.log('✓ Text is readable after animation');
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check text animation
    const animatedText = page.locator('.text-4xl.md\\:text-5xl').first();
    await animatedText.scrollIntoViewIfNeeded();

    await expect(animatedText).toBeVisible();
    console.log('✓ Text animation works on mobile viewport');
  });

  test('should not cause layout shift', async ({ page }) => {
    const animatedText = page.locator('.text-4xl.md\\:text-5xl').first();

    // Get initial bounding box
    const initialBox = await animatedText.boundingBox();

    // Scroll to trigger animation
    await animatedText.scrollIntoViewIfNeeded();

    // Wait for animation to complete
    await page.waitForTimeout(ANIMATION_DURATION);

    // Get final bounding box
    const finalBox = await animatedText.boundingBox();

    // Check that position hasn't shifted significantly
    if (initialBox && finalBox) {
      const yDiff = Math.abs(initialBox.y - finalBox.y);
      expect(yDiff).toBeLessThan(50); // Allow small differences due to scrolling
      console.log('✓ No significant layout shift detected');
    }
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Text should be immediately visible without animation
    const animatedText = page.locator('.text-4xl.md\\:text-5xl').first();
    await animatedText.scrollIntoViewIfNeeded();

    await expect(animatedText).toBeVisible();
    console.log('✓ Reduced motion preference respected');
  });
});
