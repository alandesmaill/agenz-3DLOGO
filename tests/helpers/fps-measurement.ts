import { Page } from '@playwright/test';

export interface FPSMetrics {
  avgFPS: number;
  minFPS: number;
  maxFPS: number;
  frameDropCount: number;
  measurements: number[];
}

/**
 * Measures FPS (frames per second) over a specified duration
 * @param page - Playwright page object
 * @param durationMs - Duration to measure FPS (default: 2000ms)
 * @returns FPS metrics including average, min, max, and frame drops
 */
export async function measureFPS(page: Page, durationMs: number = 2000): Promise<FPSMetrics> {
  const metrics = await page.evaluate((duration) => {
    return new Promise<FPSMetrics>((resolve) => {
      const frameTimes: number[] = [];
      let lastFrameTime = performance.now();
      let rafId: number;

      const measureFrame = () => {
        const now = performance.now();
        const frameTime = now - lastFrameTime;
        frameTimes.push(frameTime);
        lastFrameTime = now;

        if (now - startTime < duration) {
          rafId = requestAnimationFrame(measureFrame);
        } else {
          cancelAnimationFrame(rafId);

          // Calculate FPS from frame times
          const fpsMeasurements = frameTimes.map(time => 1000 / time);

          // Filter out initial spike (first 3 frames often unstable)
          const stableFPS = fpsMeasurements.slice(3);

          const avgFPS = stableFPS.reduce((a, b) => a + b, 0) / stableFPS.length;
          const minFPS = Math.min(...stableFPS);
          const maxFPS = Math.max(...stableFPS);

          // Count frames below 55fps as "dropped"
          const frameDropCount = stableFPS.filter(fps => fps < 55).length;

          resolve({
            avgFPS,
            minFPS,
            maxFPS,
            frameDropCount,
            measurements: stableFPS,
          });
        }
      };

      const startTime = performance.now();
      rafId = requestAnimationFrame(measureFrame);
    });
  }, durationMs);

  return metrics;
}

/**
 * Measures FPS during a specific action
 * @param page - Playwright page object
 * @param action - Async function to execute while measuring
 * @param durationMs - Duration to measure (default: 1500ms)
 * @returns FPS metrics
 */
export async function measureFPSDuringAction(
  page: Page,
  action: () => Promise<void>,
  durationMs: number = 1500
): Promise<FPSMetrics> {
  // Start measurement
  const metricsPromise = measureFPS(page, durationMs);

  // Wait a bit for measurement to initialize
  await page.waitForTimeout(100);

  // Execute action
  await action();

  // Wait for measurement to complete
  return metricsPromise;
}

/**
 * Logs FPS metrics in a readable format
 */
export function logFPSMetrics(testName: string, metrics: FPSMetrics): void {
  console.log(`\n========== ${testName} FPS Metrics ==========`);
  console.log(`Average FPS: ${metrics.avgFPS.toFixed(2)}`);
  console.log(`Min FPS: ${metrics.minFPS.toFixed(2)}`);
  console.log(`Max FPS: ${metrics.maxFPS.toFixed(2)}`);
  console.log(`Frame Drops (<55fps): ${metrics.frameDropCount}`);
  console.log(`Total Frames: ${metrics.measurements.length}`);
  console.log('===========================================\n');
}
