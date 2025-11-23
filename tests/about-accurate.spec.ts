import { test } from '@playwright/test';

test('Accurate About Section Test', async ({ page }) => {
  console.log('\n═══════════════════════════════════════');
  console.log('  ACCURATE ABOUT SECTION TEST');
  console.log('═══════════════════════════════════════');

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);  // Wait for 3D to load

  // Move to center of viewport and wait
  console.log('   Moving mouse to logo center...');
  await page.mouse.move(640, 360);  // Center area for 1280x720 viewport
  await page.waitForTimeout(500);
  await page.mouse.move(640, 380);
  await page.waitForTimeout(4000);  // Wait for decomposition

  // Screenshot after hover
  await page.screenshot({ path: 'test-results/after-hover.png' });
  console.log('   After hover screenshot captured');

  // Check if hover hint is gone (means decomposition happened)
  const hoverHint = await page.locator('text=hover the logo').count();
  console.log(`   Hover hint visible: ${hoverHint > 0 ? 'Yes (decomposition NOT triggered)' : 'No (decomposition triggered)'}`);

  // ABOUT is at top-left in 3D space (-0.6, 1.5)
  // After decomposition, try clicking upper-left area
  // Navigation pieces spread out after decomposition

  console.log('   Clicking ABOUT area (top-left)...');

  // Try clicking at different positions in upper-left quadrant
  await page.mouse.click(450, 280);
  await page.waitForTimeout(1500);

  let foundAbout = await page.locator('h2:has-text("Remarkable")').count();
  if (foundAbout === 0) {
    await page.mouse.click(400, 320);
    await page.waitForTimeout(1500);
    foundAbout = await page.locator('h2:has-text("Remarkable")').count();
  }

  if (foundAbout === 0) {
    await page.mouse.click(500, 250);
    await page.waitForTimeout(1500);
    foundAbout = await page.locator('h2:has-text("Remarkable")').count();
  }

  if (foundAbout > 0) {
    console.log('   ✓ About section found!');

    // Take multiple screenshots to show sphere movement
    await page.screenshot({ path: 'test-results/about-spheres-1.png' });
    console.log('   Screenshot 1 captured');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/about-spheres-2.png' });
    console.log('   Screenshot 2 captured');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/about-spheres-3.png' });
    console.log('   Screenshot 3 captured');

    // Check UI elements
    const logo = await page.locator('img[alt*="Agenz"], img[alt*="logo"]').count();
    const getInTouch = await page.locator('a:has-text("GET IN TOUCH")').count();
    const menuBtn = await page.locator('button:has-text("MENU")').count();
    const scrollDown = await page.locator('text=Scroll Down').count();

    console.log('\n   UI Elements:');
    console.log(`   - Logo: ${logo > 0 ? '✓' : '✗'}`);
    console.log(`   - GET IN TOUCH: ${getInTouch > 0 ? '✓' : '✗'}`);
    console.log(`   - MENU button: ${menuBtn > 0 ? '✓' : '✗'}`);
    console.log(`   - Scroll Down text: ${scrollDown > 0 ? '✓' : '✗'}`);
  } else {
    console.log('   ✗ About section NOT found');
    await page.screenshot({ path: 'test-results/about-not-found.png' });
  }
});
