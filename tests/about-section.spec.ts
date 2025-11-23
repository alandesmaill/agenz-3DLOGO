import { test, expect } from '@playwright/test';

test.describe('About Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Test 1: Navigate to About Section', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 1: NAVIGATE TO ABOUT SECTION');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading
    await page.waitForTimeout(5000);

    // Trigger decomposition by hovering over the logo
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2000);

    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/about-before-click.png' });

    // Look for navigation label "ABOUT" and click it
    // The nav pieces appear after decomposition
    // Try clicking in the area where ABOUT nav piece should be
    const navPositions = [
      { x: 600, y: 400 },   // Try different positions
      { x: 650, y: 450 },
      { x: 700, y: 400 },
    ];

    let aboutSectionFound = false;
    for (const pos of navPositions) {
      await page.mouse.click(pos.x, pos.y);
      await page.waitForTimeout(1500);

      // Check if about section appeared
      const aboutSection = await page.locator('section').filter({ hasText: 'Remarkable' }).count();
      if (aboutSection > 0) {
        aboutSectionFound = true;
        console.log(`   ✓ About section found after clicking at (${pos.x}, ${pos.y})`);
        break;
      }
    }

    // Take screenshot after interaction
    await page.screenshot({ path: 'test-results/about-after-interaction.png' });

    console.log(`   About section found: ${aboutSectionFound}`);
  });

  test('Test 2: About Section UI Elements', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 2: ABOUT SECTION UI ELEMENTS');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading
    await page.waitForTimeout(5000);

    // Trigger decomposition
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2500);

    // Click to trigger about section (try multiple positions)
    const clickPositions = [
      { x: 600, y: 400 },
      { x: 650, y: 450 },
      { x: 550, y: 400 },
      { x: 700, y: 350 },
    ];

    for (const pos of clickPositions) {
      await page.mouse.click(pos.x, pos.y);
      await page.waitForTimeout(1000);
    }

    // Wait for any transition
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/about-section-ui.png' });

    // Check for key elements
    const titleRemarkable = await page.locator('h2:has-text("Remarkable")').count();
    const titleVirtual = await page.locator('h2:has-text("Virtual Experiences")').count();
    const backButton = await page.locator('button:has-text("BACK")').count();
    const scrollDownText = await page.locator('text=Scroll Down').count();

    console.log(`   Title "Remarkable": ${titleRemarkable > 0 ? '✓' : '✗'}`);
    console.log(`   Title "Virtual Experiences": ${titleVirtual > 0 ? '✓' : '✗'}`);
    console.log(`   Back button: ${backButton > 0 ? '✓' : '✗'}`);
    console.log(`   "Scroll Down" text: ${scrollDownText > 0 ? '✓' : '✗'}`);

    // Check for canvas element (3D scene)
    const canvasCount = await page.locator('canvas').count();
    console.log(`   Canvas elements found: ${canvasCount}`);

    // Check for SVG mask
    const svgMask = await page.locator('svg mask').count();
    console.log(`   SVG mask elements: ${svgMask}`);
  });

  test('Test 3: Check 3D Canvas Rendering', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 3: 3D CANVAS RENDERING CHECK');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading
    await page.waitForTimeout(5000);

    // Trigger decomposition
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2500);

    // Click multiple positions to trigger about
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(550 + i * 50, 400);
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/about-3d-canvas.png' });

    // Check canvas exists
    const canvases = await page.locator('canvas').all();
    console.log(`   Canvas elements found: ${canvases.length}`);

    // Check if WebGL context is working by evaluating canvas
    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      const isVisible = await canvas.isVisible();
      const boundingBox = await canvas.boundingBox();

      console.log(`   Canvas ${i + 1}:`);
      console.log(`      Visible: ${isVisible ? '✓' : '✗'}`);
      if (boundingBox) {
        console.log(`      Size: ${boundingBox.width}x${boundingBox.height}`);
      }
    }

    // Check if Physics/spheres would be visible
    // This checks if the 3D scene container exists
    const sceneContainer = await page.locator('.flex-1.relative').count();
    console.log(`   3D Scene container: ${sceneContainer > 0 ? '✓' : '✗'}`);
  });

  test('Test 4: SVG Mask Animation', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 4: SVG MASK ANIMATION');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading
    await page.waitForTimeout(5000);

    // Trigger decomposition
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2500);

    // Click to trigger about
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(550 + i * 50, 400);
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/about-mask-initial.png' });

    // Check SVG elements
    const svgElement = await page.locator('svg').count();
    const maskElement = await page.locator('mask').count();
    const rectElements = await page.locator('svg rect').count();

    console.log(`   SVG elements: ${svgElement}`);
    console.log(`   Mask elements: ${maskElement}`);
    console.log(`   Rect elements in SVG: ${rectElements}`);

    // Wait for animation and take another screenshot
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/about-mask-animated.png' });

    // Check if rects have different positions (animation working)
    const rects = await page.locator('svg mask rect').all();
    console.log(`   Animated rectangles count: ${rects.length}`);
  });

  test('Test 5: Header Elements Check', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 5: HEADER ELEMENTS CHECK');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading
    await page.waitForTimeout(5000);

    // Trigger decomposition
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2500);

    // Click to trigger about
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(550 + i * 50, 400);
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/about-header.png' });

    // Check for header elements
    const logoImage = await page.locator('img[alt*="logo"], img[alt*="Agenz"]').count();
    const getInTouchBtn = await page.locator('button:has-text("GET IN TOUCH"), a:has-text("GET IN TOUCH")').count();
    const menuBtn = await page.locator('button:has-text("MENU")').count();
    const backBtn = await page.locator('button:has-text("BACK")').count();

    console.log(`   Logo image: ${logoImage > 0 ? '✓' : '✗ (MISSING)'}`);
    console.log(`   GET IN TOUCH button: ${getInTouchBtn > 0 ? '✓' : '✗ (MISSING)'}`);
    console.log(`   MENU button: ${menuBtn > 0 ? '✓' : '✗ (MISSING)'}`);
    console.log(`   BACK button: ${backBtn > 0 ? '✓' : '✗'}`);

    // If elements are missing, this indicates we need to add them
    if (logoImage === 0 || getInTouchBtn === 0 || menuBtn === 0) {
      console.log('\n   ⚠️  Header elements are missing - need to be added');
    }
  });

  test('Test 6: Infinite Text Animation', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 6: INFINITE TEXT ANIMATION');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading
    await page.waitForTimeout(5000);

    // Trigger decomposition
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2500);

    // Click to trigger about
    for (let i = 0; i < 4; i++) {
      await page.mouse.click(550 + i * 50, 400);
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(2000);

    // Check for "Scroll Down" text
    const scrollDownElements = await page.locator('text=Scroll Down').count();
    console.log(`   "Scroll Down" text instances: ${scrollDownElements}`);

    // Take screenshots to verify animation
    await page.screenshot({ path: 'test-results/about-infinite-text-1.png' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/about-infinite-text-2.png' });

    // The infinite text should have multiple instances
    expect(scrollDownElements).toBeGreaterThan(0);
    console.log(`   Infinite text animation: ${scrollDownElements > 1 ? '✓ Multiple instances' : '⚠️ May not be animating'}`);
  });

  test.afterAll(async () => {
    console.log('\n═══════════════════════════════════════');
    console.log('  ALL ABOUT SECTION TESTS COMPLETE');
    console.log('═══════════════════════════════════════\n');
  });
});
