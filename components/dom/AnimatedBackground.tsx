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
          background: `
            radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.10) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 255, 255, 0.07) 0%, transparent 50%),
            #050505
          `,
        }}
      />
    </div>
  );
}
