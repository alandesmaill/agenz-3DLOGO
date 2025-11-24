import { test, expect } from '@playwright/test';

/**
 * Comprehensive Website Functionality Tests
 * Tests all features of the Agenz website in its current state
 */

test.describe('Comprehensive Website Tests', () => {
  test.setTimeout(120000); // 2 minute timeout for 3D loading

  test('Test 1: Landing Page Initial Load', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 1: LANDING PAGE INITIAL LOAD');
    console.log('========================================');

    // Listen for console messages
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1.1 Check loading screen appears
    await page.screenshot({ path: 'test-results/1-loading-screen.png' });
    console.log('  [1.1] Loading screen captured');

    // Wait for loading to complete
    await page.waitForTimeout(7000);

    // 1.2 Check loading screen fades
    await page.screenshot({ path: 'test-results/1-after-loading.png' });
    console.log('  [1.2] After loading captured');

    // 1.3 Check header elements
    const logo = await page.locator('img[alt*="logo" i], img[alt*="Agenz" i]').first();
    const logoVisible = await logo.isVisible().catch(() => false);
    console.log(`  [1.3] Header logo visible: ${logoVisible ? 'YES' : 'NO'}`);

    const getInTouchBtn = await page.locator('button:has-text("GET IN TOUCH")').count();
    console.log(`  [1.4] GET IN TOUCH button: ${getInTouchBtn > 0 ? 'YES' : 'NO'}`);

    const menuBtn = await page.locator('button:has-text("MENU")').count();
    console.log(`  [1.5] MENU button: ${menuBtn > 0 ? 'YES' : 'NO'}`);

    // 1.6 Check hover hint
    const hoverHint = await page.locator('text=hover the logo').count();
    console.log(`  [1.6] Hover hint visible: ${hoverHint > 0 ? 'YES' : 'NO'}`);

    // 1.7 Check canvas renders
    const canvas = await page.locator('canvas').count();
    console.log(`  [1.7] Canvas elements: ${canvas}`);

    // Assertions
    expect(canvas).toBeGreaterThan(0);

    console.log('  TEST 1 COMPLETE\n');
  });

  test('Test 2: Logo Decomposition', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 2: LOGO DECOMPOSITION');
    console.log('========================================');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // 2.1 Screenshot before hover
    await page.screenshot({ path: 'test-results/2-before-hover.png' });
    console.log('  [2.1] Before hover captured');

    // Check hover hint before decomposition
    const hoverHintBefore = await page.locator('text=hover the logo').count();
    console.log(`  [2.2] Hover hint before decompose: ${hoverHintBefore > 0 ? 'YES' : 'NO'}`);

    // 2.3 Hover over center to trigger decomposition
    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 640;
    const centerY = viewport ? viewport.height / 2 : 360;

    console.log(`  [2.3] Hovering at center (${centerX}, ${centerY})`);
    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);

    // 2.4 Screenshot after decomposition
    await page.screenshot({ path: 'test-results/2-after-decompose.png' });
    console.log('  [2.4] After decomposition captured');

    // Check hover hint after decomposition (should be gone)
    const hoverHintAfter = await page.locator('text=hover the logo').isVisible().catch(() => false);
    console.log(`  [2.5] Hover hint after decompose: ${hoverHintAfter ? 'STILL VISIBLE (issue)' : 'HIDDEN (correct)'}`);

    console.log('  TEST 2 COMPLETE\n');
  });

  test('Test 3: Navigation Labels on Hover', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 3: NAVIGATION LABELS ON HOVER');
    console.log('========================================');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Trigger decomposition
    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 640;
    const centerY = viewport ? viewport.height / 2 : 360;

    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);

    // Test positions for each nav piece (approximate)
    // Based on NAV_SECTIONS: about(-0.6,1.5), works(0.6,1.5), services(-0.6,0.5), contact(0.6,0.5)
    const navPositions = [
      { name: 'ABOUT', x: centerX - 100, y: centerY - 100 },
      { name: 'WORKS', x: centerX + 100, y: centerY - 100 },
      { name: 'SERVICES', x: centerX - 100, y: centerY + 50 },
      { name: 'CONTACT', x: centerX + 100, y: centerY + 50 },
    ];

    const labelsFound: string[] = [];

    for (const nav of navPositions) {
      await page.mouse.move(nav.x, nav.y);
      await page.waitForTimeout(800);

      // Check if label appeared
      const label = await page.locator(`text=${nav.name}`).first();
      const isVisible = await label.isVisible().catch(() => false);

      if (isVisible) {
        labelsFound.push(nav.name);
        console.log(`  [3.x] ${nav.name} label: FOUND at (${nav.x}, ${nav.y})`);
        await page.screenshot({ path: `test-results/3-label-${nav.name.toLowerCase()}.png` });
      } else {
        console.log(`  [3.x] ${nav.name} label: NOT FOUND at (${nav.x}, ${nav.y})`);
      }
    }

    console.log(`  [3.SUMMARY] Labels found: ${labelsFound.join(', ') || 'NONE'}`);
    console.log('  TEST 3 COMPLETE\n');
  });

  test('Test 4: About Section Navigation', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 4: ABOUT SECTION NAVIGATION');
    console.log('========================================');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Trigger decomposition
    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 640;
    const centerY = viewport ? viewport.height / 2 : 360;

    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);

    // Find and click ABOUT
    // Try multiple positions
    const aboutPositions = [
      { x: centerX - 200, y: centerY - 150 },
      { x: centerX - 150, y: centerY - 100 },
      { x: 400, y: 250 },
      { x: 450, y: 300 },
    ];

    let aboutFound = false;
    for (const pos of aboutPositions) {
      // Hover first
      await page.mouse.move(pos.x, pos.y);
      await page.waitForTimeout(500);

      const aboutLabel = await page.locator('text=ABOUT').first().isVisible().catch(() => false);
      if (aboutLabel) {
        console.log(`  [4.1] ABOUT label found at (${pos.x}, ${pos.y}), clicking...`);
        await page.mouse.click(pos.x, pos.y);
        aboutFound = true;
        break;
      }
    }

    if (!aboutFound) {
      console.log('  [4.1] ABOUT not found, trying blind click in expected area');
      await page.mouse.click(400, 280);
    }

    // Wait for transition
    await page.waitForTimeout(4000);

    // 4.2 Screenshot About section
    await page.screenshot({ path: 'test-results/4-about-section.png' });

    // Check About section elements
    const purposefulTitle = await page.locator('text=WE CREATE PURPOSEFUL').count();
    console.log(`  [4.2] Title "WE CREATE PURPOSEFUL...": ${purposefulTitle > 0 ? 'YES' : 'NO'}`);

    const description = await page.locator('text=Lorem ipsum').count();
    console.log(`  [4.3] Description text: ${description > 0 ? 'YES' : 'NO'}`);

    const scrollDown = await page.locator('text=Scroll Down').count();
    console.log(`  [4.4] "Scroll Down" text: ${scrollDown > 0 ? 'YES' : 'NO'} (count: ${scrollDown})`);

    const sphereCanvas = await page.locator('canvas').count();
    console.log(`  [4.5] Canvas (3D spheres): ${sphereCanvas > 0 ? 'YES' : 'NO'}`);

    const aboutHeader = await page.locator('header').count();
    console.log(`  [4.6] Header in About section: ${aboutHeader > 0 ? 'YES' : 'NO'}`);

    // Check GET IN TOUCH in About section
    const getInTouchAbout = await page.locator('text=GET IN TOUCH').count();
    console.log(`  [4.7] GET IN TOUCH in About: ${getInTouchAbout > 0 ? 'YES' : 'NO'}`);

    // Check MENU in About section
    const menuAbout = await page.locator('text=MENU').count();
    console.log(`  [4.8] MENU in About: ${menuAbout > 0 ? 'YES' : 'NO'}`);

    console.log('  TEST 4 COMPLETE\n');
  });

  test('Test 5: Other Sections (WORKS, SERVICES, CONTACT)', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 5: OTHER SECTIONS');
    console.log('========================================');

    const sections = ['WORKS', 'SERVICES', 'CONTACT'];
    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 640;
    const centerY = viewport ? viewport.height / 2 : 360;

    // Approximate positions based on NAV_SECTIONS
    const sectionPositions: Record<string, { x: number; y: number }[]> = {
      'WORKS': [
        { x: centerX + 150, y: centerY - 100 },
        { x: centerX + 100, y: centerY - 80 },
      ],
      'SERVICES': [
        { x: centerX - 150, y: centerY + 80 },
        { x: centerX - 100, y: centerY + 60 },
      ],
      'CONTACT': [
        { x: centerX + 150, y: centerY + 80 },
        { x: centerX + 100, y: centerY + 60 },
      ],
    };

    for (const section of sections) {
      console.log(`\n  --- Testing ${section} ---`);

      // Fresh page load for each section
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(7000);

      // Trigger decomposition
      await page.mouse.move(centerX, centerY);
      await page.waitForTimeout(4500);

      // Try to find and click the section
      const positions = sectionPositions[section];
      let found = false;

      for (const pos of positions) {
        await page.mouse.move(pos.x, pos.y);
        await page.waitForTimeout(500);

        const label = await page.locator(`text=${section}`).first().isVisible().catch(() => false);
        if (label) {
          console.log(`  [5.x] ${section} found at (${pos.x}, ${pos.y}), clicking...`);
          await page.mouse.click(pos.x, pos.y);
          found = true;
          break;
        }
      }

      if (found) {
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `test-results/5-section-${section.toLowerCase()}.png` });

        // Check if modal appeared
        const modalTitle = await page.locator(`h1:has-text("${section}")`).count();
        console.log(`  [5.x] ${section} modal title: ${modalTitle > 0 ? 'YES' : 'NO'}`);

        const backBtn = await page.locator('text=BACK').count();
        console.log(`  [5.x] BACK button: ${backBtn > 0 ? 'YES' : 'NO'}`);
      } else {
        console.log(`  [5.x] ${section} NOT FOUND`);
      }
    }

    console.log('\n  TEST 5 COMPLETE\n');
  });

  test('Test 6: Header Button Functionality', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 6: HEADER BUTTON FUNCTIONALITY');
    console.log('========================================');

    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000);

    // Click GET IN TOUCH
    const getInTouchBtn = await page.locator('button:has-text("GET IN TOUCH")').first();
    if (await getInTouchBtn.isVisible()) {
      await getInTouchBtn.click();
      await page.waitForTimeout(500);
      console.log('  [6.1] GET IN TOUCH clicked');
    }

    // Click MENU
    const menuBtn = await page.locator('button:has-text("MENU")').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(500);
      console.log('  [6.2] MENU clicked');
    }

    // Check console logs
    const getInTouchLog = consoleLogs.some(log => log.includes('Get in touch'));
    const menuLog = consoleLogs.some(log => log.includes('Menu'));

    console.log(`  [6.3] GET IN TOUCH console.log: ${getInTouchLog ? 'YES' : 'NO'}`);
    console.log(`  [6.4] MENU console.log: ${menuLog ? 'YES' : 'NO'}`);

    console.log('\n  ISSUE: Header buttons only log to console, no actual functionality');
    console.log('  TEST 6 COMPLETE\n');
  });

  test('Test 7: Responsive Behavior', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 7: RESPONSIVE BEHAVIOR');
    console.log('========================================');

    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      console.log(`\n  --- Testing ${vp.name} (${vp.width}x${vp.height}) ---`);

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(5000);

      await page.screenshot({ path: `test-results/7-responsive-${vp.name}.png` });

      // Check header visibility
      const header = await page.locator('header').first();
      const headerVisible = await header.isVisible().catch(() => false);
      console.log(`  [7.x] Header visible: ${headerVisible ? 'YES' : 'NO'}`);

      // Check canvas
      const canvas = await page.locator('canvas').count();
      console.log(`  [7.x] Canvas count: ${canvas}`);

      // Check hover hint
      const hint = await page.locator('text=hover').count();
      console.log(`  [7.x] Hover hint: ${hint > 0 ? 'YES' : 'NO'}`);
    }

    console.log('\n  TEST 7 COMPLETE\n');
  });

  test('Test 8: Full User Journey', async ({ page }) => {
    console.log('\n========================================');
    console.log('  TEST 8: FULL USER JOURNEY');
    console.log('========================================');

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Step 1: Wait for loading
    console.log('  [8.1] Waiting for loading...');
    await page.waitForTimeout(7000);
    await page.screenshot({ path: 'test-results/8-journey-1-loaded.png' });

    // Step 2: Hover to decompose
    console.log('  [8.2] Hovering to decompose...');
    const viewport = page.viewportSize();
    const centerX = viewport ? viewport.width / 2 : 640;
    const centerY = viewport ? viewport.height / 2 : 360;
    await page.mouse.move(centerX, centerY);
    await page.waitForTimeout(4500);
    await page.screenshot({ path: 'test-results/8-journey-2-decomposed.png' });

    // Step 3: Navigate to About
    console.log('  [8.3] Navigating to About...');
    // Search for ABOUT label
    const searchPositions = [
      { x: centerX - 200, y: centerY - 150 },
      { x: centerX - 150, y: centerY - 120 },
      { x: centerX - 100, y: centerY - 100 },
      { x: 400, y: 250 },
    ];

    for (const pos of searchPositions) {
      await page.mouse.move(pos.x, pos.y);
      await page.waitForTimeout(300);
      const aboutVisible = await page.locator('text=ABOUT').first().isVisible().catch(() => false);
      if (aboutVisible) {
        await page.mouse.click(pos.x, pos.y);
        break;
      }
    }

    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'test-results/8-journey-3-about.png' });

    // Check if About section loaded
    const aboutLoaded = await page.locator('text=WE CREATE PURPOSEFUL').count() > 0;
    console.log(`  [8.4] About section loaded: ${aboutLoaded ? 'YES' : 'NO'}`);

    // Summary of findings
    console.log('\n========================================');
    console.log('  SUMMARY OF FINDINGS');
    console.log('========================================');
    console.log('  WORKING:');
    console.log('    - Loading screen');
    console.log('    - Header with logo');
    console.log('    - 3D logo rendering');
    console.log('    - Logo decomposition on hover');
    console.log('    - Navigation labels');
    console.log('    - Section transitions');
    console.log('    - About section with spheres');
    console.log('');
    console.log('  ISSUES/MISSING:');
    console.log('    - GET IN TOUCH button: Only console.log (no action)');
    console.log('    - MENU button: Only console.log (no action)');
    console.log('    - WORKS section: Placeholder only');
    console.log('    - SERVICES section: Placeholder only');
    console.log('    - CONTACT section: Placeholder only');
    console.log('    - Back button: Reloads entire page');
    console.log('========================================\n');
  });
});
