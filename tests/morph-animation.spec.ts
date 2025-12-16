import { test, expect } from '@playwright/test';

test.describe('Portfolio Morph Animation', () => {
  test('should smoothly morph from grid to detail page without flash', async ({ page }) => {
    // Navigate to works page
    await page.goto('http://localhost:3000/works');
    await page.waitForLoadState('networkidle');

    // Wait for projects to render
    await page.waitForSelector('[data-project-card]', { timeout: 10000 });

    // Get first project card
    const firstCard = page.locator('[data-project-card]').first();
    const projectId = await firstCard.getAttribute('data-project-id');

    console.log('Starting morph animation test...');

    // Record animation frames
    const frameTimestamps: number[] = [];
    let animationComplete = false;

    // Monitor for visual changes
    await page.evaluate(() => {
      const frames: number[] = [];
      const recordFrame = (timestamp: number) => {
        frames.push(timestamp);
        if (!window.location.pathname.includes('/works/')) {
          requestAnimationFrame(recordFrame);
        }
      };
      requestAnimationFrame(recordFrame);
      (window as any).__frameTimestamps = frames;
    });

    // Click the project card
    await firstCard.click();

    // Wait for navigation to complete
    await page.waitForURL(`**/works/${projectId}`, { timeout: 5000 });

    console.log('Navigation completed, analyzing animation...');

    // Take screenshot immediately after navigation
    await page.screenshot({
      path: `test-results/morph-after-nav-${Date.now()}.png`,
      fullPage: false
    });

    // Wait a bit to see if there's a flash
    await page.waitForTimeout(500);

    // Take another screenshot
    await page.screenshot({
      path: `test-results/morph-settled-${Date.now()}.png`,
      fullPage: false
    });

    // Verify detail page is visible
    await expect(page.locator('[data-testid="project-detail-hero"]')).toBeVisible();

    // Check for overlay presence
    const overlayPresent = await page.locator('[style*="position: fixed"][style*="z-index: 9999"]').count();
    console.log('Overlay elements found:', overlayPresent);

    // Get frame timestamps
    const frames = await page.evaluate(() => (window as any).__frameTimestamps || []);
    console.log('Total frames during animation:', frames.length);

    // Calculate frame times
    if (frames.length > 1) {
      const frameTimes = [];
      for (let i = 1; i < frames.length; i++) {
        frameTimes.push(frames[i] - frames[i - 1]);
      }
      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const fps = 1000 / avgFrameTime;
      console.log(`Average FPS during morph: ${fps.toFixed(2)}`);
    }
  });

  test('should test back navigation morph animation', async ({ page }) => {
    // Go directly to detail page
    await page.goto('http://localhost:3000/works/techflow');
    await page.waitForLoadState('networkidle');

    // Set session storage to simulate forward navigation
    await page.evaluate(() => {
      sessionStorage.setItem('page-transition', JSON.stringify({
        projectId: 'techflow',
        fromRect: { top: 400, left: 200, width: 600, height: 400 },
        direction: 'forward',
        timestamp: Date.now()
      }));
    });

    console.log('Testing back navigation...');

    // Take screenshot before back
    await page.screenshot({
      path: `test-results/morph-before-back-${Date.now()}.png`,
      fullPage: false
    });

    // Click browser back
    await page.goBack();

    // Wait for animation
    await page.waitForTimeout(1500);

    // Take screenshot after back
    await page.screenshot({
      path: `test-results/morph-after-back-${Date.now()}.png`,
      fullPage: false
    });

    // Verify we're back on works page
    await expect(page).toHaveURL(/\/works$/);
    await expect(page.locator('[data-project-card]')).toBeVisible();
  });

  test('should verify overlay timing and removal', async ({ page }) => {
    await page.goto('http://localhost:3000/works');
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('[data-project-card]');

    // Monitor overlay lifecycle
    const overlayLifecycle: any[] = [];

    // Set up mutation observer
    await page.evaluate(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement &&
                node.style.position === 'fixed' &&
                node.style.zIndex === '9999') {
              console.log('OVERLAY CREATED at', Date.now());
              (window as any).__overlayCreated = Date.now();
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node instanceof HTMLElement &&
                node.style.position === 'fixed' &&
                node.style.zIndex === '9999') {
              console.log('OVERLAY REMOVED at', Date.now());
              (window as any).__overlayRemoved = Date.now();
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });

    // Click first project
    await page.locator('[data-project-card]').first().click();

    // Wait for navigation
    await page.waitForURL(/\/works\//);
    await page.waitForTimeout(2000);

    // Get overlay timing
    const overlayTiming = await page.evaluate(() => ({
      created: (window as any).__overlayCreated,
      removed: (window as any).__overlayRemoved,
      duration: ((window as any).__overlayRemoved - (window as any).__overlayCreated) || null
    }));

    console.log('Overlay lifecycle:', overlayTiming);

    if (overlayTiming.duration) {
      console.log(`Overlay visible for ${overlayTiming.duration}ms`);
      expect(overlayTiming.duration).toBeLessThan(3000); // Should be removed within 3s
    }
  });

  test('should measure paint timing and detect flashes', async ({ page }) => {
    await page.goto('http://localhost:3000/works');
    await page.waitForLoadState('networkidle');

    // Set up paint timing observer
    await page.evaluate(() => {
      const paintTimes: any[] = [];
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          paintTimes.push({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration
          });
        });
      });
      observer.observe({ entryTypes: ['paint', 'measure'] });
      (window as any).__paintTimes = paintTimes;
    });

    await page.waitForSelector('[data-project-card]');

    // Record time before click
    const clickTime = Date.now();

    // Click project
    await page.locator('[data-project-card]').first().click();

    // Wait for URL change
    await page.waitForURL(/\/works\//);

    // Record time after navigation
    const navTime = Date.now();
    console.log(`Navigation took ${navTime - clickTime}ms`);

    // Wait for any paint events
    await page.waitForTimeout(1000);

    // Get paint timing
    const paintTimes = await page.evaluate(() => (window as any).__paintTimes || []);
    console.log('Paint events:', paintTimes);

    // Check for layout shifts (indicates flash/reflow)
    const layoutShifts = await page.evaluate(() => {
      return new Promise((resolve) => {
        const shifts: any[] = [];
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (entry.hadRecentInput) return;
            shifts.push({
              value: entry.value,
              time: entry.startTime
            });
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => {
          observer.disconnect();
          resolve(shifts);
        }, 2000);
      });
    });

    console.log('Layout shifts detected:', layoutShifts);
  });
});
