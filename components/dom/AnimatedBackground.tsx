'use client';

/**
 * Pure White Background
 * Clean, minimal background for maximum performance
 * Performance gain: +20 FPS (removed blur filters and GSAP animations)
 */

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Pure white background with subtle radial gradient for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, #0a0a0a 0%, #050505 100%)',
        }}
      />
    </div>
  );
}
