import { test } from '@playwright/test';

test('Click All Large Pieces to Find About', async ({ page }) => {
  console.log('\n═══════════════════════════════════════');
  console.log('  CLICK ALL LARGE PIECES TO FIND ABOUT');
  console.log('═══════════════════════════════════════');

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  // Trigger decomposition
  console.log('   Triggering decomposition...');
  await page.mouse.move(640, 360);
  await page.waitForTimeout(4500);

  // Based on screenshot analysis, the large pieces are approximately at:
  // 1. Black piece top-center: ~(500, 200)
  // 2. Large teal bottom-center: ~(500, 420)
  // 3. Large cyan right: ~(750, 350)
  // 4. Teal piece left: ~(250, 280)

  const largePositions = [
    { x: 500, y: 200, name: 'top-center black' },
    { x: 500, y: 420, name: 'bottom-center teal' },
    { x: 750, y: 350, name: 'right cyan' },
    { x: 250, y: 280, name: 'left teal' },
    { x: 650, y: 250, name: 'upper-right' },
    { x: 350, y: 350, name: 'left-center' },
  ];

  for (const pos of largePositions) {
    console.log(`\n   Clicking ${pos.name} at (${pos.x}, ${pos.y})...`);
    await page.mouse.click(pos.x, pos.y);
    await page.waitForTimeout(2500);

    // Check what section we landed on
    const remarkable = await page.locator('h2:has-text("Remarkable")').count();
    const sectionTitle = await page.locator('h1').first().textContent().catch(() => null);

    if (remarkable > 0) {
      console.log('   ✓✓✓ FOUND ABOUT SECTION! ✓✓✓');

      // Take multiple screenshots to show sphere movement
      await page.screenshot({ path: 'test-results/ABOUT-found-1.png' });
      console.log('   Screenshot 1 captured');

      await page.waitForTimeout(2500);
      await page.screenshot({ path: 'test-results/ABOUT-found-2.png' });
      console.log('   Screenshot 2 captured');

      await page.waitForTimeout(2500);
      await page.screenshot({ path: 'test-results/ABOUT-found-3.png' });
      console.log('   Screenshot 3 captured');

      // Check UI
      const logo = await page.locator('img[alt*="Agenz"]').count();
      const menu = await page.locator('button:has-text("MENU")').count();

      console.log('\n   UI Elements:');
      console.log(`   - Logo: ${logo > 0 ? '✓' : '✗'}`);
      console.log(`   - MENU button: ${menu > 0 ? '✓' : '✗'}`);

      return;  // Found it!
    } else if (sectionTitle) {
      console.log(`   → Landed on: ${sectionTitle}`);
      // Go back
      const backBtn = page.locator('button:has-text("BACK")');
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForTimeout(3000);
      }
    }
  }

  console.log('\n   ✗ Could not find About section after trying all positions');
  await page.screenshot({ path: 'test-results/all-tried.png' });
});
