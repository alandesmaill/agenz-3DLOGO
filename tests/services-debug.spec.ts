import { test, expect } from '@playwright/test';

test('Debug services section rendering - find why cards are not showing', async ({ page }) => {
  // Listen to console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`Browser console [${msg.type()}]:`, msg.text());
  });

  // Listen to page errors
  const pageErrors: string[] = [];
  page.on('pageerror', err => {
    pageErrors.push(err.message);
    console.log('Page error:', err.message);
  });

  console.log('\n========== STEP 1: Navigate to main page ==========');
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');

  console.log('\n========== STEP 2: Wait for 3D logo to load ==========');
  await page.waitForTimeout(3000);

  // Take screenshot of main page
  await page.screenshot({ path: 'test-results/debug-main-page.png', fullPage: true });

  console.log('\n========== STEP 3: Open MENU and click SERVICES ==========');
  // Click the MENU button
  await page.click('button:has-text("MENU")');
  await page.waitForTimeout(1000);

  // Click SERVICES in the menu
  await page.click('text=Services');
  await page.waitForTimeout(2000);

  console.log('\n========== STEP 4: Take screenshot of services page ==========');
  await page.screenshot({ path: 'test-results/debug-services-initial.png', fullPage: true });

  console.log('\n========== STEP 5: Check if ServicesSection container exists ==========');
  const sectionExists = await page.locator('.scroll-container').count();
  console.log('Scroll container found:', sectionExists);

  console.log('\n========== STEP 6: Check if hero section is visible ==========');
  const heroText = await page.locator('text=OUR SERVICES').count();
  console.log('Hero "OUR SERVICES" found:', heroText);

  console.log('\n========== STEP 7: Check if grid container exists ==========');
  const gridCount = await page.locator('.grid').count();
  console.log('Grid containers found:', gridCount);

  console.log('\n========== STEP 8: Check how many divs are in the grid ==========');
  const gridChildren = await page.locator('.grid > div').count();
  console.log('Grid children (should be 4 cards):', gridChildren);

  console.log('\n========== STEP 9: Check computed styles of grid and cards ==========');

  if (gridCount > 0) {
    const gridStyles = await page.locator('.grid').first().evaluate(el => ({
      display: window.getComputedStyle(el).display,
      gridTemplateColumns: window.getComputedStyle(el).gridTemplateColumns,
      gap: window.getComputedStyle(el).gap,
      width: window.getComputedStyle(el).width,
      height: window.getComputedStyle(el).height,
    }));
    console.log('Grid styles:', JSON.stringify(gridStyles, null, 2));
  }

  if (gridChildren > 0) {
    for (let i = 0; i < Math.min(gridChildren, 4); i++) {
      const cardStyles = await page.locator('.grid > div').nth(i).evaluate(el => ({
        opacity: window.getComputedStyle(el).opacity,
        display: window.getComputedStyle(el).display,
        visibility: window.getComputedStyle(el).visibility,
        transform: window.getComputedStyle(el).transform,
        width: window.getComputedStyle(el).width,
        height: window.getComputedStyle(el).height,
        minHeight: window.getComputedStyle(el).minHeight,
      }));
      console.log(`Card ${i + 1} styles:`, JSON.stringify(cardStyles, null, 2));
    }
  }

  console.log('\n========== STEP 10: Check if servicesData is populated ==========');
  const servicesDataCheck = await page.evaluate(() => {
    // Try to access window object to see if data is there
    return {
      hasLocalStorage: !!window.localStorage,
      documentReady: document.readyState,
    };
  });
  console.log('Browser state:', JSON.stringify(servicesDataCheck, null, 2));

  console.log('\n========== STEP 11: Wait 5 seconds and take final screenshot ==========');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'test-results/debug-services-after-wait.png', fullPage: true });

  console.log('\n========== STEP 12: Get page HTML for analysis ==========');
  const gridHTML = await page.locator('.grid').first().innerHTML().catch(() => 'Grid not found');
  console.log('Grid HTML length:', gridHTML.length);
  if (gridHTML.length < 1000) {
    console.log('Grid HTML:', gridHTML);
  }

  console.log('\n========== SUMMARY ==========');
  console.log('Total console messages:', consoleMessages.length);
  console.log('Total page errors:', pageErrors.length);

  if (pageErrors.length > 0) {
    console.log('\nPage Errors:');
    pageErrors.forEach(err => console.log('  -', err));
  }

  console.log('\nKey findings:');
  console.log('- Hero section visible:', heroText > 0);
  console.log('- Grid exists:', gridCount > 0);
  console.log('- Cards in grid:', gridChildren);
  console.log('- Expected cards: 4');

  // This test is for debugging - it will pass/fail based on whether we found the issue
  expect(heroText).toBeGreaterThan(0); // Hero should always be visible
});
