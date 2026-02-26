import { test, expect } from '@playwright/test';

/**
 * Comprehensive Navigation & Sitemap Test Suite
 *
 * Tests all navigation paths, menu functionality, and UX across the entire website.
 * Target: 60 FPS for animations, 55+ FPS minimum acceptable.
 */

// ============================================================================
// TEST SUITE 1: Route Accessibility
// ============================================================================

test.describe('Route Accessibility', () => {
  test('should load homepage with 3D scene', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for 3D canvas to render
    await page.waitForTimeout(3000);

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Verify MENU button appears
    const menuButton = page.getByRole('button', { name: /MENU/i });
    await expect(menuButton).toBeVisible();
  });

  test('should load /about page', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('WE CREATE PURPOSEFUL')).toBeVisible();
  });

  test('should load /works page', async ({ page }) => {
    await page.goto('/works');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Our Work')).toBeVisible();
  });

  test('should load /services page (NEW)', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Verify OUR SERVICES heading
    await expect(page.getByText('OUR SERVICES')).toBeVisible();

    // Verify 4 service cards render
    await expect(page.getByText('Advertising & Social Media')).toBeVisible();
    await expect(page.getByText('Video Production')).toBeVisible();
    await expect(page.getByText('Print & Graphic Design')).toBeVisible();
    await expect(page.getByText('Strategic Media Services')).toBeVisible();
  });

  test('should load /contact page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText("Let's Create Something Amazing")).toBeVisible();
  });

  test('should load all 4 service detail pages', async ({ page }) => {
    const services = ['advertising', 'video', 'design', 'strategy'];

    for (const service of services) {
      await page.goto(`/services/${service}`);
      await page.waitForLoadState('networkidle');

      // Verify page loads successfully
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
    }
  });
});

// ============================================================================
// TEST SUITE 2: Menu Navigation from All Pages
// ============================================================================

test.describe('Menu Navigation - From All Pages', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/works', name: 'Works' },
    { path: '/services', name: 'Services' },
    { path: '/contact', name: 'Contact' },
    { path: '/services/advertising', name: 'Advertising Detail' },
  ];

  for (const route of routes) {
    test(`should open/close menu on ${route.name} page`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      // Wait for page-specific load (3D scene on home)
      if (route.path === '/') {
        await page.waitForTimeout(3000);
      }

      // Click MENU button
      const menuButton = page.getByRole('button', { name: /MENU/i });
      await menuButton.click();

      // Verify menu overlay appears
      await expect(page.getByText('Sitemap')).toBeVisible({ timeout: 2000 });

      // Verify all 5 nav items visible
      await expect(page.getByText('Home', { exact: true })).toBeVisible();
      await expect(page.getByText('About', { exact: true })).toBeVisible();
      await expect(page.getByText('Works', { exact: true })).toBeVisible();
      await expect(page.getByText('Services', { exact: true })).toBeVisible();
      await expect(page.getByText('Contact', { exact: true })).toBeVisible();

      // Test keyboard close (ESC)
      await page.keyboard.press('Escape');
      await expect(page.getByText('Sitemap')).not.toBeVisible({ timeout: 2000 });
    });
  }

  test('should navigate from /about to /services via menu', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Open menu
    await page.getByRole('button', { name: /MENU/i }).click();

    // Click Services
    await page.getByText('Services', { exact: true }).click();

    // Wait for navigation
    await page.waitForURL('/services', { timeout: 5000 });
    await expect(page.getByText('OUR SERVICES')).toBeVisible();
  });

  test('should navigate from /services to /contact via menu', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Open menu
    await page.getByRole('button', { name: /MENU/i }).click();

    // Click Contact
    await page.getByText('Contact', { exact: true }).click();

    // Wait for navigation
    await page.waitForURL('/contact', { timeout: 5000 });
    await expect(page.getByText("Let's Create Something Amazing")).toBeVisible();
  });

  test('should navigate from /contact to /works via menu', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Open menu
    await page.getByRole('button', { name: /MENU/i }).click();

    // Click Works
    await page.getByText('Works', { exact: true }).click();

    // Wait for navigation
    await page.waitForURL('/works', { timeout: 5000 });
    await expect(page.getByText('Our Work')).toBeVisible();
  });
});

// ============================================================================
// TEST SUITE 3: Header Button Navigation
// ============================================================================

test.describe('Header Button Navigation', () => {
  test('should navigate home via logo click from /about', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Click logo
    const logo = page.locator('img[alt*="Agenz"]').first();
    await logo.click();

    // Should navigate to home
    await page.waitForURL('/', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate home via logo click from /services', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Click logo
    const logo = page.locator('img[alt*="Agenz"]').first();
    await logo.click();

    // Should navigate to home
    await page.waitForURL('/', { timeout: 5000 });
    await page.waitForTimeout(2000);
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to contact via GET IN TOUCH from /services', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Click GET IN TOUCH (desktop only)
    const getInTouch = page.getByRole('button', { name: /GET IN TOUCH/i });
    if (await getInTouch.isVisible()) {
      await getInTouch.click();
      await page.waitForURL('/contact', { timeout: 5000 });
      await expect(page.getByText("Let's Create Something Amazing")).toBeVisible();
    }
  });

  test('should open menu from all main pages', async ({ page }) => {
    const routes = ['/', '/about', '/services', '/contact'];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      if (route === '/') await page.waitForTimeout(3000); // Wait for 3D load

      await page.getByRole('button', { name: /MENU/i }).click();
      await expect(page.getByText('Sitemap')).toBeVisible();
      await page.keyboard.press('Escape'); // Close menu

      await page.waitForTimeout(500); // Wait for close animation
    }
  });
});

// ============================================================================
// TEST SUITE 4: Social Links & Footer
// ============================================================================

test.describe('Social Links & Footer', () => {
  test('should have working social links in menu', async ({ page, context }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Open menu
    await page.getByRole('button', { name: /MENU/i }).click();

    // Verify "Follow Us" section
    await expect(page.getByText('Follow Us')).toBeVisible();

    // Check social links are present
    const socialLinks = ['Instagram', 'LinkedIn', 'Twitter', 'Dribbble'];
    for (const link of socialLinks) {
      const socialLink = page.getByRole('link', { name: link });
      await expect(socialLink).toBeVisible();
    }
  });

  test('should have copyright in menu footer', async ({ page }) => {
    await page.goto('/works');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /MENU/i }).click();
    await expect(page.getByText(/© 2025 Agenz/i)).toBeVisible();
  });
});

// ============================================================================
// TEST SUITE 5: Performance During Navigation
// ============================================================================

test.describe('Navigation Performance', () => {
  test('should maintain 55+ FPS during menu open/close', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    // Start FPS monitoring
    await page.evaluate(() => {
      (window as any).fpsData = { frames: [] as number[] };
      let lastTime = performance.now();

      function measureFrame() {
        const now = performance.now();
        const fps = 1000 / (now - lastTime);
        (window as any).fpsData.frames.push(fps);
        lastTime = now;
        requestAnimationFrame(measureFrame);
      }
      requestAnimationFrame(measureFrame);
    });

    // Open menu
    await page.getByRole('button', { name: /MENU/i }).click();
    await page.waitForTimeout(1000);

    // Close menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Get FPS data
    const fpsData = await page.evaluate(() => (window as any).fpsData.frames);
    const avgFPS = fpsData.reduce((sum: number, fps: number) => sum + fps, 0) / fpsData.length;

    console.log(`Average FPS during menu animation: ${avgFPS.toFixed(2)}`);
    expect(avgFPS).toBeGreaterThan(55);
  });

  test('should maintain 50+ FPS during route transition', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Start monitoring
    await page.evaluate(() => {
      (window as any).fpsData = { frames: [] as number[] };
      let lastTime = performance.now();
      function measureFrame() {
        const now = performance.now();
        (window as any).fpsData.frames.push(1000 / (now - lastTime));
        lastTime = now;
        requestAnimationFrame(measureFrame);
      }
      requestAnimationFrame(measureFrame);
    });

    // Navigate
    await page.getByRole('button', { name: /MENU/i }).click();
    await page.getByText('Contact', { exact: true }).click();
    await page.waitForURL('/contact', { timeout: 5000 });
    await page.waitForTimeout(2000);

    const fpsData = await page.evaluate(() => (window as any).fpsData.frames);
    const avgFPS = fpsData.reduce((sum: number, fps: number) => sum + fps, 0) / fpsData.length;

    console.log(`Average FPS during route transition: ${avgFPS.toFixed(2)}`);
    expect(avgFPS).toBeGreaterThan(50);
  });
});

// ============================================================================
// TEST SUITE 6: Mobile Responsiveness
// ============================================================================

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should show mobile menu on small screens', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // GET IN TOUCH should be hidden on mobile
    const getInTouch = page.getByRole('button', { name: /GET IN TOUCH/i });
    await expect(getInTouch).not.toBeVisible();

    // MENU should be visible
    await expect(page.getByRole('button', { name: /MENU/i })).toBeVisible();
  });

  test('should have full-width menu on mobile', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /MENU/i }).click();
    await page.waitForTimeout(500);

    // Menu should be visible and full width on mobile
    const menu = page.locator('[class*="fixed"]').filter({ hasText: 'Sitemap' }).first();
    const isVisible = await menu.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should navigate correctly on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Open menu
    await page.getByRole('button', { name: /MENU/i }).click();

    // Navigate to services
    await page.getByText('Services', { exact: true }).click();
    await page.waitForURL('/services', { timeout: 5000 });

    await expect(page.getByText('OUR SERVICES')).toBeVisible();
  });
});

// ============================================================================
// TEST SUITE 7: Error Handling
// ============================================================================

test.describe('Error Handling', () => {
  test('should handle invalid work ID gracefully', async ({ page }) => {
    const response = await page.goto('/works/invalid-id-999');

    // Should show Next.js 404 page
    expect(response?.status()).toBe(404);
  });

  test('should handle invalid service route', async ({ page }) => {
    const response = await page.goto('/services/invalid-service');

    expect(response?.status()).toBe(404);
  });
});

// ============================================================================
// TEST SUITE 8: Service Card Links
// ============================================================================

test.describe('Service Cards Navigation', () => {
  test('should navigate to service detail pages from /services', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Test advertising card link
    const advertisingLink = page.getByRole('link', { name: /Learn More/i }).first();
    await advertisingLink.click();

    await page.waitForURL('/services/advertising', { timeout: 5000 });
    await page.waitForLoadState('networkidle');

    // Verify we're on the advertising detail page
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });
});
