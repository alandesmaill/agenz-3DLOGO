import { test, expect, type Page } from '@playwright/test';
import { measureFPS, measureFPSDuringAction, logFPSMetrics } from './helpers/fps-measurement';
import { TARGET_FPS, MIN_ACCEPTABLE_FPS } from './helpers/constants';

const SERVICE_PAGES = [
  { path: '/services/advertising', name: 'Advertising & Social Media', color: '#00ffff' },
  { path: '/services/video', name: 'Video Production & Music', color: '#00e92c' },
  { path: '/services/design', name: 'Print & Graphic Design', color: '#00d4aa' },
  { path: '/services/strategy', name: 'Strategic Media Services', color: '#00b8ff' },
];

test.describe('Service Detail Pages - Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Disable animations for consistent measurements (optional)
    // await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  // Test 1: Page Load Performance (All Services)
  for (const service of SERVICE_PAGES) {
    test(`Test 1: Page Load Performance - ${service.name}`, async ({ page }) => {
      console.log(`\n========== TEST 1: Page Load - ${service.name} ==========`);

      await page.goto(`http://localhost:3001${service.path}`, {
        waitUntil: 'networkidle',
      });

      // Wait for hero section to render
      await page.waitForSelector('section');
      await page.waitForTimeout(1000);

      // Measure FPS during initial render
      const metrics = await measureFPS(page, 2000);

      logFPSMetrics(`Page Load - ${service.name}`, metrics);

      expect(metrics.avgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS);
      expect(metrics.frameDropCount).toBeLessThanOrEqual(5);
    });
  }

  // Test 2: Scroll Performance (All Services)
  for (const service of SERVICE_PAGES) {
    test(`Test 2: Smooth Scroll Performance - ${service.name}`, async ({ page }) => {
      console.log(`\n========== TEST 2: Scroll Performance - ${service.name} ==========`);

      await page.goto(`http://localhost:3001${service.path}`, {
        waitUntil: 'networkidle',
      });

      await page.waitForSelector('section');
      await page.waitForTimeout(1000);

      // Measure FPS during scroll
      const metrics = await measureFPSDuringAction(
        page,
        async () => {
          // Smooth scroll down to bottom
          await page.evaluate(() => {
            window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
          });
          await page.waitForTimeout(800);

          await page.evaluate(() => {
            window.scrollTo({ top: (document.body.scrollHeight * 2) / 3, behavior: 'smooth' });
          });
          await page.waitForTimeout(800);

          await page.evaluate(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          });
          await page.waitForTimeout(800);
        },
        2500
      );

      logFPSMetrics(`Scroll Performance - ${service.name}`, metrics);

      expect(metrics.avgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS);
      expect(metrics.frameDropCount).toBeLessThanOrEqual(8);
    });
  }

  // Test 3: AnimatedText Performance (One Service)
  test('Test 3: AnimatedText Character Animation Performance', async ({ page }) => {
    console.log('\n========== TEST 3: AnimatedText Performance ==========');

    await page.goto('http://localhost:3001/services/advertising', {
      waitUntil: 'networkidle',
    });

    await page.waitForSelector('section');
    await page.waitForTimeout(1500);

    // Measure FPS during scroll-triggered text animations
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        // Scroll to trigger AnimatedText in overview section
        await page.evaluate(() => {
          const overviewSection = document.querySelectorAll('section')[1];
          if (overviewSection) {
            overviewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        await page.waitForTimeout(1000);
      },
      2000
    );

    logFPSMetrics('AnimatedText Performance', metrics);

    // AnimatedText should maintain high FPS
    expect(metrics.avgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(5);
  });

  // Test 4: FAQ Accordion Interactions (One Service)
  test('Test 4: FAQ Accordion Performance', async ({ page }) => {
    console.log('\n========== TEST 4: FAQ Accordion Performance ==========');

    await page.goto('http://localhost:3001/services/advertising', {
      waitUntil: 'networkidle',
    });

    await page.waitForSelector('section');
    await page.waitForTimeout(1000);

    // Scroll to FAQ section
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const faqSection = sections[sections.length - 2]; // Second-to-last section
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);

    // Measure FPS during rapid FAQ toggling
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        const faqButtons = await page.locator('button[aria-expanded]').all();

        // Toggle first 3 FAQs
        for (let i = 0; i < Math.min(3, faqButtons.length); i++) {
          await faqButtons[i].click();
          await page.waitForTimeout(200);
        }

        // Toggle them closed
        for (let i = 0; i < Math.min(3, faqButtons.length); i++) {
          await faqButtons[i].click();
          await page.waitForTimeout(200);
        }
      },
      2000
    );

    logFPSMetrics('FAQ Accordion Performance', metrics);

    expect(metrics.avgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(5);
  });

  // Test 5: Case Study Carousel Performance (One Service)
  test('Test 5: Case Study Carousel Performance', async ({ page }) => {
    console.log('\n========== TEST 5: Carousel Performance ==========');

    await page.goto('http://localhost:3001/services/advertising', {
      waitUntil: 'networkidle',
    });

    await page.waitForSelector('section');
    await page.waitForTimeout(1000);

    // Scroll to case study section
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const caseStudySection = sections[sections.length - 3]; // Third-to-last section
      if (caseStudySection) {
        caseStudySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);

    // Measure FPS during carousel navigation
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        const nextButton = page.locator('button[aria-label="Next case study"]');
        const prevButton = page.locator('button[aria-label="Previous case study"]');

        // Click next 3 times
        for (let i = 0; i < 3; i++) {
          await nextButton.click();
          await page.waitForTimeout(300);
        }

        // Click prev 3 times
        for (let i = 0; i < 3; i++) {
          await prevButton.click();
          await page.waitForTimeout(300);
        }
      },
      2500
    );

    logFPSMetrics('Carousel Navigation Performance', metrics);

    expect(metrics.avgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(5);
  });

  // Test 6: Mobile Performance (One Service)
  test('Test 6: Mobile Performance', async ({ page }) => {
    console.log('\n========== TEST 6: Mobile Performance ==========');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('http://localhost:3001/services/advertising', {
      waitUntil: 'networkidle',
    });

    await page.waitForSelector('section');
    await page.waitForTimeout(1000);

    // Measure FPS during scroll on mobile
    const metrics = await measureFPSDuringAction(
      page,
      async () => {
        // Scroll down
        await page.evaluate(() => {
          window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
        });
        await page.waitForTimeout(1000);

        // Scroll to bottom
        await page.evaluate(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
        await page.waitForTimeout(1000);
      },
      2500
    );

    logFPSMetrics('Mobile Performance', metrics);

    // Slightly lower threshold for mobile
    expect(metrics.avgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS - 5);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(10);
  });

  // Test 7: Memory Leak Detection (All Services)
  test('Test 7: Memory Leak Detection - Sequential Page Loads', async ({ page }) => {
    console.log('\n========== TEST 7: Memory Leak Detection ==========');

    const memorySnapshots: number[] = [];

    for (const service of SERVICE_PAGES) {
      await page.goto(`http://localhost:3001${service.path}`, {
        waitUntil: 'networkidle',
      });

      await page.waitForSelector('section');
      await page.waitForTimeout(2000);

      // Scroll to trigger all animations
      await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      });
      await page.waitForTimeout(2000);

      // Take memory snapshot
      const metrics = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      memorySnapshots.push(metrics);
      console.log(`${service.name} - Memory: ${(metrics / 1024 / 1024).toFixed(2)} MB`);
    }

    // Check for memory leaks
    const firstMemory = memorySnapshots[0];
    const lastMemory = memorySnapshots[memorySnapshots.length - 1];
    const memoryIncrease = lastMemory - firstMemory;
    const memoryIncreaseMB = memoryIncrease / 1024 / 1024;

    console.log(`\nMemory Increase: ${memoryIncreaseMB.toFixed(2)} MB`);

    // Allow up to 50 MB increase (reasonable for 4 page loads)
    expect(memoryIncreaseMB).toBeLessThan(50);
  });

  // Test 8: Feature Grid Icon Animations (One Service)
  test('Test 8: Feature Grid Icon Animation Performance', async ({ page }) => {
    console.log('\n========== TEST 8: Feature Grid Performance ==========');

    await page.goto('http://localhost:3001/services/advertising', {
      waitUntil: 'networkidle',
    });

    await page.waitForSelector('section');
    await page.waitForTimeout(1000);

    // Scroll to features section
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const featuresSection = sections[2]; // Third section
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1500);

    // Measure FPS with icon float animations active
    const metrics = await measureFPS(page, 2000);

    logFPSMetrics('Feature Grid Icon Animations', metrics);

    expect(metrics.avgFPS).toBeGreaterThanOrEqual(MIN_ACCEPTABLE_FPS);
    expect(metrics.frameDropCount).toBeLessThanOrEqual(5);
  });
});
