'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Contact Form Error</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          {error.message || 'Failed to load the contact form'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
