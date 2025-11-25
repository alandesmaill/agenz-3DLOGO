import { test, expect } from '@playwright/test';

test.describe('About Page Diagnostic', () => {
  test('diagnose why page is blank', async ({ page }) => {
    const consoleMessages: string[] = [];
    const errors: string[] = [];

    // Capture console messages
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Navigate to About page (assuming it's accessed via clicking ABOUT button)
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    console.log('\n=== LANDING PAGE ===');
    const landingTitle = await page.title();
    console.log('Page Title:', landingTitle);

    // Take screenshot of landing page
    await page.screenshot({ path: 'test-results/01-landing-page.png', fullPage: true });
    console.log('Screenshot saved: 01-landing-page.png');

    // Try to find and click ABOUT navigation
    // First, check if we need to decompose the logo
    await page.waitForTimeout(2000); // Wait for 3D logo to load

    // Look for fractured logo or navigation
    const aboutButton = page.locator('text=/ABOUT/i').first();
    const isAboutVisible = await aboutButton.isVisible().catch(() => false);

    if (isAboutVisible) {
      console.log('Found ABOUT button, clicking...');
      await aboutButton.click();
      await page.waitForTimeout(3000); // Wait for navigation/animation
    } else {
      console.log('No ABOUT button found on landing, checking if already on About page...');
    }

    // Take screenshot after navigation
    await page.screenshot({ path: 'test-results/02-after-navigation.png', fullPage: true });
    console.log('Screenshot saved: 02-after-navigation.png');

    console.log('\n=== CHECKING ELEMENTS ===');

    // Check header
    const header = page.locator('header').first();
    const headerExists = await header.count();
    const headerVisible = await header.isVisible().catch(() => false);
    console.log(`Header: exists=${headerExists}, visible=${headerVisible}`);

    // Check for AGENZ logo
    const logo = page.locator('img[alt="Agenz logo"]');
    const logoExists = await logo.count();
    const logoVisible = await logo.isVisible().catch(() => false);
    console.log(`Logo: exists=${logoExists}, visible=${logoVisible}`);

    // Check for scroll container
    const scrollContainer = page.locator('.scroll-container');
    const scrollExists = await scrollContainer.count();
    console.log(`Scroll container: exists=${scrollExists}`);

    // Check for Canvas (3D scene)
    const canvas = page.locator('canvas');
    const canvasCount = await canvas.count();
    console.log(`Canvas elements: ${canvasCount}`);

    if (canvasCount > 0) {
      const canvasVisible = await canvas.first().isVisible().catch(() => false);
      const canvasBox = await canvas.first().boundingBox().catch(() => null);
      console.log(`First canvas: visible=${canvasVisible}, boundingBox=${JSON.stringify(canvasBox)}`);
    }

    // Check for paragraph section
    const paragraph = page.locator('p[class*="text-[32px]"], p[class*="text-[48px]"], p[class*="text-[56px]"]');
    const paragraphCount = await paragraph.count();
    console.log(`Large paragraph: exists=${paragraphCount}`);

    if (paragraphCount > 0) {
      const paragraphVisible = await paragraph.first().isVisible().catch(() => false);
      const paragraphText = await paragraph.first().textContent().catch(() => '');
      console.log(`Paragraph: visible=${paragraphVisible}`);
      console.log(`Paragraph text (first 100 chars): ${paragraphText.substring(0, 100)}...`);
    }

    // Check 3D spheres section
    const heroSection = page.locator('section').first();
    const heroExists = await heroSection.count();
    const heroVisible = await heroSection.isVisible().catch(() => false);
    console.log(`Hero section: exists=${heroExists}, visible=${heroVisible}`);

    // Check InfiniteText ("Scroll Down")
    const scrollDownText = page.locator('text=/scroll down/i');
    const scrollDownExists = await scrollDownText.count();
    console.log(`"Scroll Down" text: exists=${scrollDownExists}`);

    // Get body computed styles
    const bodyOverflow = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        overflow: styles.overflow,
        overflowX: styles.overflowX,
        overflowY: styles.overflowY,
        height: styles.height,
      };
    });
    console.log('Body styles:', JSON.stringify(bodyOverflow, null, 2));

    // Check scroll container styles
    if (scrollExists > 0) {
      const scrollContainerStyles = await page.evaluate(() => {
        const container = document.querySelector('.scroll-container');
        if (!container) return null;
        const styles = window.getComputedStyle(container);
        return {
          minHeight: styles.minHeight,
          height: styles.height,
          overflow: styles.overflow,
        };
      });
      console.log('Scroll container styles:', JSON.stringify(scrollContainerStyles, null, 2));
    }

    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));

    console.log('\n=== ERRORS ===');
    if (errors.length > 0) {
      errors.forEach(err => console.error(err));
    } else {
      console.log('No JavaScript errors detected');
    }

    // Scroll down to see if paragraph appears
    console.log('\n=== TESTING SCROLL ===');
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/03-after-scroll.png', fullPage: true });
    console.log('Screenshot saved: 03-after-scroll.png');

    // Check if paragraph is now visible
    if (paragraphCount > 0) {
      const paragraphVisibleAfterScroll = await paragraph.first().isVisible().catch(() => false);
      console.log(`Paragraph visible after scroll: ${paragraphVisibleAfterScroll}`);
    }

    // Final verdict
    console.log('\n=== DIAGNOSIS ===');
    if (errors.length > 0) {
      console.log('⚠️  JavaScript errors detected - this is likely the issue');
    } else if (canvasCount === 0) {
      console.log('⚠️  No Canvas found - 3D scene not rendering');
    } else if (paragraphCount === 0) {
      console.log('⚠️  Paragraph element not found in DOM');
    } else if (!headerVisible) {
      console.log('⚠️  Header not visible - CSS/positioning issue');
    } else {
      console.log('✅ Elements exist in DOM - might be CSS/visibility issue');
    }
  });
});
