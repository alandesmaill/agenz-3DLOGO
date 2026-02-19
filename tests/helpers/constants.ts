/**
 * Performance test constants and thresholds
 */

export const PERFORMANCE_THRESHOLDS = {
  // FPS targets
  TARGET_FPS: 60,
  MIN_ACCEPTABLE_FPS: 55,
  CRITICAL_FPS: 50,
  EXCELLENT_FPS: 58,

  // Frame drops
  MAX_FRAME_DROP_COUNT: 5,
  MAX_CONSECUTIVE_DROPS: 3,

  // Memory
  MAX_MEMORY_MB: 150,
  WARN_MEMORY_MB: 120,

  // Timing
  MAX_FRAME_TIME_MS: 20, // 50fps = 20ms per frame
  TARGET_FRAME_TIME_MS: 16.67, // 60fps = 16.67ms per frame
};

export const TEST_DURATIONS = {
  // Test phase durations in milliseconds
  LOADING_PHASE: 4000, // 0-4s: Loading + Z-shape + assembly
  IDLE_PHASE: 4000, // 4-8s: Assembled logo rotation
  DECOMPOSE_PHASE: 4000, // 8-12s: Decomposition animation
  HOVER_PHASE: 4000, // 12-16s: Navigation hover interactions
  STRESS_PHASE: 4000, // 16-20s: Rapid interactions

  // Wait times
  WAIT_FOR_LOAD: 1000,
  WAIT_FOR_ANIMATION: 3000,
  WAIT_BETWEEN_ACTIONS: 500,
};

export const TEST_PHASES = {
  LOADING: 'Loading Screen',
  Z_FORMATION: 'Z-Shape Formation',
  LOGO_ASSEMBLY: 'Logo Assembly',
  IDLE_ROTATION: 'Idle Rotation',
  DECOMPOSITION: 'Decomposition',
  NAVIGATION_HOVER: 'Navigation Hover',
  STRESS_TEST: 'Stress Test',
} as const;

export type TestPhase = typeof TEST_PHASES[keyof typeof TEST_PHASES];
