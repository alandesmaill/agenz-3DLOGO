import { test, expect } from '@playwright/test';
import { FPSMonitor } from './helpers/fps-monitor';
import { PERFORMANCE_THRESHOLDS } from './helpers/constants';

test.describe('Contact Form Performance', () => {
  let fpsMonitor: FPSMonitor;

  test.beforeEach(async ({ page }) => {
    fpsMonitor = new FPSMonitor();
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  });

  test('Page load should maintain 60fps', async ({ page }) => {
    console.log('[Test] Starting page load FPS test');

    await fpsMonitor.startMonitoring(page);
    await page.waitForTimeout(2000);
    const report = await fpsMonitor.stopMonitoring(page);

    console.log(`[Test] Page load FPS: ${report.averageFPS.toFixed(2)}`);
    console.log(`[Test] Min FPS: ${report.minFPS.toFixed(2)}, Max FPS: ${report.maxFPS.toFixed(2)}`);
    console.log(`[Test] Dropped frames: ${report.droppedFrames}`);

    expect(report.averageFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.TARGET_FPS);
  });

  test('Form interactions should maintain 60fps', async ({ page }) => {
    console.log('[Test] Starting form interaction FPS test');

    await fpsMonitor.startMonitoring(page);

    // Type in all fields
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('textarea[name="message"]', 'This is a test message for the contact form to verify performance during typing.');

    const report = await fpsMonitor.stopMonitoring(page);

    console.log(`[Test] Form interaction FPS: ${report.averageFPS.toFixed(2)}`);
    console.log(`[Test] Dropped frames: ${report.droppedFrames}`);

    expect(report.averageFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.TARGET_FPS);
    expect(report.droppedFrames).toBeLessThan(5);
  });

  test('Validation errors should not impact performance', async ({ page }) => {
    console.log('[Test] Starting validation error FPS test');

    await fpsMonitor.startMonitoring(page);

    // Trigger validation errors by submitting empty form
    await page.click('button[type="submit"]');
    await page.waitForSelector('[role="alert"]', { timeout: 3000 });

    const report = await fpsMonitor.stopMonitoring(page);

    console.log(`[Test] Validation FPS: ${report.averageFPS.toFixed(2)}`);

    expect(report.averageFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);
  });

  test('Success animation should maintain 60fps', async ({ page }) => {
    console.log('[Test] Starting success animation FPS test');

    // Mock EmailJS response
    await page.route('**/api/send-email', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Fill form with valid data
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');

    await fpsMonitor.startMonitoring(page);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success screen
    await page.waitForSelector('text=Thank You!', { timeout: 5000 });

    // Let confetti animation play
    await page.waitForTimeout(2000);

    const report = await fpsMonitor.stopMonitoring(page);

    console.log(`[Test] Success animation FPS: ${report.averageFPS.toFixed(2)}`);

    expect(report.averageFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.TARGET_FPS);
  });

  test('No memory leaks after 10 form submissions', async ({ page }) => {
    console.log('[Test] Starting memory leak test');

    // Mock EmailJS response
    await page.route('**/api/send-email', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Measure initial memory
    const initialMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });

    console.log(`[Test] Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);

    // Submit form 10 times
    for (let i = 0; i < 10; i++) {
      await page.fill('input[name="name"]', `Test User ${i}`);
      await page.fill('input[name="email"]', `test${i}@example.com`);
      await page.fill('textarea[name="message"]', `Test message ${i}`);

      await page.click('button[type="submit"]');
      await page.waitForSelector('text=Thank You!', { timeout: 5000 });

      // Click "Send Another Message" button
      await page.click('button:has-text("Send Another")');
      await page.waitForTimeout(500);
    }

    // Measure final memory
    const finalMemory = await page.evaluate(() => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize;
      }
      return 0;
    });

    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // Convert to MB

    console.log(`[Test] Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`[Test] Memory increase: ${memoryIncrease.toFixed(2)} MB`);

    // Should not leak more than 50MB after 10 submissions
    expect(memoryIncrease).toBeLessThan(50);
  });
});
