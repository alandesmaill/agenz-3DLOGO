import { test, expect } from '@playwright/test';
import { FPSMonitor, type FPSReport } from './helpers/fps-monitor';
import { PERFORMANCE_THRESHOLDS, TEST_DURATIONS, TEST_PHASES } from './helpers/constants';

test.describe('Performance Tests - 60fps Verification', () => {
  let fpsMonitor: FPSMonitor;

  test.beforeEach(async ({ page }) => {
    fpsMonitor = new FPSMonitor();

    // Navigate to the application
    await page.goto('/');

    // Wait for page to be ready
    await page.waitForLoadState('domcontentloaded');
  });

  /**
   * Helper function to print FPS report
   */
  function printReport(phaseName: string, report: FPSReport): void {
    const status = report.averageFPS >= PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS ? '✓' : '✗';
    const avgColor = report.averageFPS >= PERFORMANCE_THRESHOLDS.EXCELLENT_FPS ? '🟢' :
                     report.averageFPS >= PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS ? '🟡' : '🔴';

    console.log(`\n${status} ${phaseName}:`);
    console.log(`   ${avgColor} Average FPS: ${report.averageFPS.toFixed(2)}`);
    console.log(`   Min FPS: ${report.minFPS.toFixed(2)}`);
    console.log(`   Max FPS: ${report.maxFPS.toFixed(2)}`);
    console.log(`   Frame Drops: ${report.droppedFrames}/${report.frameCount}`);
    console.log(`   Duration: ${(report.duration / 1000).toFixed(2)}s`);
  }

  test('Test 1: Loading & Particle Animation Performance', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 1: LOADING & PARTICLE ANIMATION');
    console.log('═══════════════════════════════════════');

    // Start monitoring FPS
    await fpsMonitor.startMonitoring(page);

    // Wait for loading screen and particle animation
    await page.waitForTimeout(TEST_DURATIONS.LOADING_PHASE);

    // Stop monitoring and get report
    const report = await fpsMonitor.stopMonitoring(page);
    printReport(TEST_PHASES.LOADING, report);

    // Assertions
    expect(report.averageFPS, `Average FPS should be >= ${PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS}`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);

    expect(report.minFPS, `Min FPS should be >= ${PERFORMANCE_THRESHOLDS.CRITICAL_FPS}`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.CRITICAL_FPS);

    expect(report.droppedFrames, `Frame drops should be <= ${PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT}`)
      .toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT);
  });

  test('Test 2: Assembled Logo Idle State Performance', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 2: ASSEMBLED LOGO IDLE STATE');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading to complete
    await page.waitForTimeout(TEST_DURATIONS.LOADING_PHASE);

    // Start monitoring FPS during idle state
    await fpsMonitor.startMonitoring(page);

    // Monitor for 4 seconds of idle rotation
    await page.waitForTimeout(TEST_DURATIONS.IDLE_PHASE);

    // Stop monitoring and get report
    const report = await fpsMonitor.stopMonitoring(page);
    printReport(TEST_PHASES.IDLE_ROTATION, report);

    // Assertions - idle state should have excellent performance
    expect(report.averageFPS, `Idle state should maintain ${PERFORMANCE_THRESHOLDS.EXCELLENT_FPS}+ FPS`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.EXCELLENT_FPS);

    expect(report.minFPS, `Min FPS in idle should be >= ${PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS}`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);

    expect(report.droppedFrames, 'Idle state should have minimal frame drops')
      .toBeLessThanOrEqual(2);
  });

  test('Test 3: Decomposition Animation Performance', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 3: DECOMPOSITION ANIMATION');
    console.log('═══════════════════════════════════════');

    // Wait for initial loading
    await page.waitForTimeout(TEST_DURATIONS.LOADING_PHASE + 1000);

    // Start monitoring
    await fpsMonitor.startMonitoring(page);

    // Trigger decomposition by hovering over the logo
    // The logo decomposes when hovering anywhere on it
    await page.mouse.move(960, 540); // Center of viewport

    // Wait for decomposition animation
    await page.waitForTimeout(TEST_DURATIONS.DECOMPOSE_PHASE);

    const report = await fpsMonitor.stopMonitoring(page);
    printReport(TEST_PHASES.DECOMPOSITION, report);

    // Assertions - decomposition is more intensive
    expect(report.averageFPS, `Decomposition should maintain >= ${PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS} FPS`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);

    expect(report.minFPS, `Min FPS should stay above ${PERFORMANCE_THRESHOLDS.CRITICAL_FPS}`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.CRITICAL_FPS);
  });

  test('Test 4: Navigation Hover with Bloom Performance', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 4: NAVIGATION HOVER WITH BLOOM');
    console.log('═══════════════════════════════════════');

    // Wait for loading and decomposition
    await page.waitForTimeout(TEST_DURATIONS.LOADING_PHASE + 2000);

    // Trigger decomposition first
    await page.mouse.move(960, 540);
    await page.waitForTimeout(2000);

    // Start monitoring
    await fpsMonitor.startMonitoring(page);

    // Hover over navigation pieces to trigger bloom effect
    // Navigate to different positions where nav pieces appear after decomposition
    const hoverPositions = [
      { x: 700, y: 400 },   // Top-left area
      { x: 1200, y: 400 },  // Top-right area
      { x: 700, y: 700 },   // Bottom-left area
      { x: 1200, y: 700 },  // Bottom-right area
    ];

    for (const pos of hoverPositions) {
      await page.mouse.move(pos.x, pos.y);
      await page.waitForTimeout(800); // Hold hover for bloom effect
    }

    const report = await fpsMonitor.stopMonitoring(page);
    printReport(TEST_PHASES.NAVIGATION_HOVER, report);

    // Assertions
    expect(report.averageFPS, `Navigation hover should maintain >= ${PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS} FPS`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);

    expect(report.minFPS, `Min FPS with bloom should be >= ${PERFORMANCE_THRESHOLDS.CRITICAL_FPS}`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.CRITICAL_FPS);
  });

  test('Test 5: Stress Test - Rapid Interactions', async ({ page }) => {
    console.log('\n═══════════════════════════════════════');
    console.log('  TEST 5: STRESS TEST');
    console.log('═══════════════════════════════════════');

    // Wait for initial load
    await page.waitForTimeout(TEST_DURATIONS.LOADING_PHASE);

    // Start monitoring
    await fpsMonitor.startMonitoring(page);

    // Perform rapid movements and interactions
    for (let i = 0; i < 20; i++) {
      const x = 500 + Math.random() * 920; // Random x between 500-1420
      const y = 300 + Math.random() * 480; // Random y between 300-780

      await page.mouse.move(x, y);
      await page.waitForTimeout(100); // Very quick movements
    }

    const report = await fpsMonitor.stopMonitoring(page);
    printReport(TEST_PHASES.STRESS_TEST, report);

    // Assertions - should still maintain decent performance under stress
    expect(report.averageFPS, `Stress test should maintain >= ${PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS} FPS`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.MIN_ACCEPTABLE_FPS);

    expect(report.minFPS, `Min FPS under stress should not drop below ${PERFORMANCE_THRESHOLDS.CRITICAL_FPS}`)
      .toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.CRITICAL_FPS);

    expect(report.droppedFrames, `Frame drops should be <= ${PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT}`)
      .toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.MAX_FRAME_DROP_COUNT);
  });

  test.afterAll(async () => {
    console.log('\n═══════════════════════════════════════');
    console.log('  ALL PERFORMANCE TESTS COMPLETE ✓');
    console.log('═══════════════════════════════════════\n');
  });
});
