import { test } from '@playwright/test';

test('Direct About Section Test', async ({ page }) => {
  console.log('\n═══════════════════════════════════════');
  console.log('  DIRECT ABOUT SECTION TEST');
  console.log('═══════════════════════════════════════');

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(6000);

  // Trigger decomposition
  await page.mouse.move(960, 540);
  await page.waitForTimeout(3500);

  // Screenshot after decomposition
  await page.screenshot({ path: 'test-results/decomposed-state.png' });
  console.log('   Decomposed state screenshot captured');

  // Try to find and click ABOUT navigation label
  // ABOUT is at position (-0.6, 1.5, 1.0) which is top-left
  // In screen coordinates, this would be roughly upper-left quadrant
  // Try clicking higher and more to the left

  const aboutClicks = [
    { x: 750, y: 280 },  // Higher up, left
    { x: 700, y: 320 },
    { x: 800, y: 300 },
    { x: 680, y: 350 },
  ];

  for (const pos of aboutClicks) {
    console.log(`   Trying click at (${pos.x}, ${pos.y})`);
    await page.mouse.click(pos.x, pos.y);
    await page.waitForTimeout(2000);

    // Check if we got to About section
    const remarkable = await page.locator('h2:has-text("Remarkable")').count();
    if (remarkable > 0) {
      console.log('   ✓ About section found!');
      break;
    }
  }

  // Take final screenshot
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/about-final.png' });

  // Take screenshots over time to show sphere movement
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/about-final-2.png' });

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/about-final-3.png' });

  console.log('   Screenshots captured');
});
