import { Page } from '@playwright/test';

export interface FPSReport {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameCount: number;
  droppedFrames: number;
  measurements: number[];
  duration: number;
}

export class FPSMonitor {
  private measurements: number[] = [];
  private startTime: number = 0;
  private rafHandle: number | null = null;

  /**
   * Measure FPS for a specific duration
   */
  async measureFPS(page: Page, durationMs: number): Promise<FPSReport> {
    // Inject FPS measurement script
    await page.evaluate((duration) => {
      return new Promise<FPSReport>((resolve) => {
        const measurements: number[] = [];
        let lastTime = performance.now();
        let frameCount = 0;
        const startTime = performance.now();

        function measureFrame() {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          const fps = 1000 / delta;

          measurements.push(fps);
          frameCount++;
          lastTime = currentTime;

          if (currentTime - startTime < duration) {
            requestAnimationFrame(measureFrame);
          } else {
            // Calculate statistics
            const averageFPS = measurements.reduce((a, b) => a + b, 0) / measurements.length;
            const minFPS = Math.min(...measurements);
            const maxFPS = Math.max(...measurements);
            const droppedFrames = measurements.filter((fps) => fps < 55).length;

            resolve({
              averageFPS,
              minFPS,
              maxFPS,
              frameCount,
              droppedFrames,
              measurements,
              duration: currentTime - startTime,
            });
          }
        }

        requestAnimationFrame(measureFrame);
      });
    }, durationMs);

    // Get the result from the page
    const result = await page.evaluate(() => {
      return (window as any).__fpsReport as FPSReport;
    });

    return result;
  }

  /**
   * Start continuous FPS monitoring
   */
  async startMonitoring(page: Page): Promise<void> {
    await page.evaluate(() => {
      (window as any).__fpsMonitoring = {
        measurements: [] as number[],
        lastTime: performance.now(),
        startTime: performance.now(),
      };

      function measureFrame() {
        const monitoring = (window as any).__fpsMonitoring;
        const currentTime = performance.now();
        const delta = currentTime - monitoring.lastTime;
        const fps = 1000 / delta;

        monitoring.measurements.push(fps);
        monitoring.lastTime = currentTime;

        if (monitoring.active) {
          requestAnimationFrame(measureFrame);
        }
      }

      (window as any).__fpsMonitoring.active = true;
      requestAnimationFrame(measureFrame);
    });
  }

  /**
   * Stop monitoring and get report
   */
  async stopMonitoring(page: Page): Promise<FPSReport> {
    const report = await page.evaluate(() => {
      const monitoring = (window as any).__fpsMonitoring;
      monitoring.active = false;

      const measurements = monitoring.measurements;
      const averageFPS = measurements.reduce((a: number, b: number) => a + b, 0) / measurements.length;
      const minFPS = Math.min(...measurements);
      const maxFPS = Math.max(...measurements);
      const droppedFrames = measurements.filter((fps: number) => fps < 55).length;

      return {
        averageFPS,
        minFPS,
        maxFPS,
        frameCount: measurements.length,
        droppedFrames,
        measurements,
        duration: performance.now() - monitoring.startTime,
      };
    });

    return report;
  }

  /**
   * Get current FPS snapshot
   */
  async getCurrentFPS(page: Page): Promise<number> {
    return await page.evaluate(() => {
      const monitoring = (window as any).__fpsMonitoring;
      if (!monitoring || !monitoring.measurements.length) return 0;

      // Get average of last 10 frames
      const recent = monitoring.measurements.slice(-10);
      return recent.reduce((a: number, b: number) => a + b, 0) / recent.length;
    });
  }

  /**
   * Wait for stable FPS (useful for waiting for animations to settle)
   */
  async waitForStableFPS(page: Page, targetFPS: number = 60, toleranceMs: number = 1000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < toleranceMs) {
      const currentFPS = await this.getCurrentFPS(page);

      if (Math.abs(currentFPS - targetFPS) <= 5) {
        // FPS is stable
        return;
      }

      await page.waitForTimeout(100);
    }
  }
}
