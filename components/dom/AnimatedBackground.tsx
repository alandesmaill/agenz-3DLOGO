'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 255, 255, 0.10) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 60% 85%, rgba(0, 255, 255, 0.08) 0%, transparent 55%),
            #0d0d0d
          `,
        }}
      />
    </div>
  );
}
