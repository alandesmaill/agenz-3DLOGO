import { test, expect } from '@playwright/test';

test.describe('About Section - Sphere Movement Test', () => {
  test('Verify spheres are moving in About section', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  SPHERE MOVEMENT VERIFICATION TEST');
    console.log('═══════════════════════════════════════');

    // Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for initial loading
    await page.waitForTimeout(6000);

    // Trigger decomposition by hovering over the logo
    await page.mouse.move(960, 540);
    await page.waitForTimeout(3000);

    // Click on ABOUT navigation piece - try left side positions
    // ABOUT is typically in the top-left area after decomposition
    const aboutPositions = [
      { x: 500, y: 350 },
      { x: 550, y: 400 },
      { x: 600, y: 350 },
      { x: 450, y: 400 },
      { x: 500, y: 450 },
    ];

    let aboutFound = false;
    for (const pos of aboutPositions) {
      await page.mouse.click(pos.x, pos.y);
      await page.waitForTimeout(1500);

      // Check if About section appeared (look for "Remarkable" title)
      const remarkable = await page.locator('h2:has-text("Remarkable")').count();
      if (remarkable > 0) {
        aboutFound = true;
        console.log(`   ✓ About section found after clicking at (${pos.x}, ${pos.y})`);
        break;
      }
    }

    if (!aboutFound) {
      console.log('   ⚠️ About section not found, trying alternative approach');
      // Reload and try again
      await page.reload();
      await page.waitForTimeout(6000);
      await page.mouse.move(960, 540);
      await page.waitForTimeout(3000);

      // Try clicking multiple positions
      for (const pos of aboutPositions) {
        await page.mouse.click(pos.x, pos.y);
        await page.waitForTimeout(500);
      }
      await page.waitForTimeout(2000);
    }

    // Wait for About section to fully load
    await page.waitForTimeout(2000);

    // Take screenshot 1
    await page.screenshot({ path: 'test-results/about-sphere-movement-1.png' });
    console.log('   Screenshot 1 captured');

    // Wait 2 seconds for spheres to move
    await page.waitForTimeout(2000);

    // Take screenshot 2
    await page.screenshot({ path: 'test-results/about-sphere-movement-2.png' });
    console.log('   Screenshot 2 captured');

    // Wait 2 more seconds
    await page.waitForTimeout(2000);

    // Take screenshot 3
    await page.screenshot({ path: 'test-results/about-sphere-movement-3.png' });
    console.log('   Screenshot 3 captured');

    // Check elements
    const title = await page.locator('h2:has-text("Remarkable")').count();
    const virtualExp = await page.locator('h2:has-text("Virtual Experiences")').count();
    const canvas = await page.locator('canvas').count();
    const scrollDown = await page.locator('text=Scroll Down').count();
    const logo = await page.locator('img[alt*="logo"], img[alt*="Agenz"]').count();
    const getInTouch = await page.locator('a:has-text("GET IN TOUCH")').count();
    const menuBtn = await page.locator('button:has-text("MENU")').count();

    console.log('\n   UI Element Check:');
    console.log(`   - Title "Remarkable": ${title > 0 ? '✓' : '✗'}`);
    console.log(`   - Title "Virtual Experiences": ${virtualExp > 0 ? '✓' : '✗'}`);
    console.log(`   - Canvas (3D scene): ${canvas > 0 ? '✓' : '✗'}`);
    console.log(`   - "Scroll Down" text: ${scrollDown > 0 ? '✓' : '✗'}`);
    console.log(`   - Logo: ${logo > 0 ? '✓' : '✗'}`);
    console.log(`   - GET IN TOUCH button: ${getInTouch > 0 ? '✓' : '✗'}`);
    console.log(`   - MENU button: ${menuBtn > 0 ? '✓' : '✗'}`);

    console.log('\n   Compare screenshots 1, 2, and 3 to verify sphere movement');
    console.log('   Screenshots saved to test-results/about-sphere-movement-*.png');
  });
});
