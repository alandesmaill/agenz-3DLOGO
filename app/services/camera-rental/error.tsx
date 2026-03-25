'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Camera Rental Page Error</h1>
        <p className="text-white/60 mb-8 max-w-md">
          {error.message || 'Failed to load the camera rental page'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <a
            href="/services"
            className="px-6 py-3 border border-white/20 text-white/70 rounded-lg hover:border-white/40 transition-colors"
          >
            All Services
          </a>
        </div>
      </div>
    </div>
  );
}
