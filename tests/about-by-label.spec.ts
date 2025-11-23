import { test } from '@playwright/test';

test('Click About by Navigation Label', async ({ page }) => {
  console.log('\n═══════════════════════════════════════');
  console.log('  CLICK ABOUT BY NAVIGATION LABEL');
  console.log('═══════════════════════════════════════');

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  // Move to logo to trigger decomposition
  console.log('   Triggering decomposition...');
  await page.mouse.move(640, 360);
  await page.waitForTimeout(4500);  // Wait for full decomposition

  // Screenshot decomposed state
  await page.screenshot({ path: 'test-results/decomposed.png' });

  // Try to find and click the ABOUT navigation label text
  const aboutLabel = page.locator('text=ABOUT').first();
  const aboutVisible = await aboutLabel.isVisible().catch(() => false);

  if (aboutVisible) {
    console.log('   Found ABOUT label, clicking...');
    await aboutLabel.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('   ABOUT label not found as text, trying position clicks...');
    // The labels appear on hover over nav pieces
    // Let me hover over different large pieces to find ABOUT

    // Positions of large pieces from screenshot analysis:
    // Upper left corner area has pieces
    const positions = [
      { x: 280, y: 120 },  // Top-left piece
      { x: 350, y: 200 },  // Left-upper area
      { x: 150, y: 250 },  // Far left
      { x: 220, y: 180 },  // Upper left
    ];

    for (const pos of positions) {
      // Hover first to see label
      await page.mouse.move(pos.x, pos.y);
      await page.waitForTimeout(500);

      // Check if ABOUT label appears
      const labelNow = await page.locator('text=ABOUT').isVisible().catch(() => false);
      if (labelNow) {
        console.log(`   Found ABOUT at (${pos.x}, ${pos.y}), clicking...`);
        await page.mouse.click(pos.x, pos.y);
        await page.waitForTimeout(2000);
        break;
      }
    }
  }

  // Check if we're in About section
  const remarkable = await page.locator('h2:has-text("Remarkable")').count();

  if (remarkable > 0) {
    console.log('   ✓ Successfully entered About section!');

    // Take screenshots showing sphere movement
    console.log('   Taking screenshots to verify sphere movement...');
    await page.screenshot({ path: 'test-results/about-t1.png' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'test-results/about-t2.png' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'test-results/about-t3.png' });

    // Check elements
    const canvas = await page.locator('canvas').count();
    const scrollDown = await page.locator('text=Scroll Down').count();

    console.log(`\n   Elements found:`);
    console.log(`   - Canvas: ${canvas}`);
    console.log(`   - Scroll Down: ${scrollDown}`);
    console.log('\n   Compare about-t1.png, about-t2.png, about-t3.png');
    console.log('   to verify spheres are moving!');
  } else {
    console.log('   ✗ Did not reach About section');
    await page.screenshot({ path: 'test-results/final-state.png' });
  }
});
