/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' blob: https://api.emailjs.com https://www.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-src https://www.google.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  // Enable Turbopack for dev mode (Next.js 15)
  // Production builds still use webpack for stability
  experimental: {
    turbopack: {
      rules: {
        // Handle GLTF/GLB files in Turbopack
        '*.glb': {
          loaders: ['file-loader'],
          as: '*.js',
        },
        '*.gltf': {
          loaders: ['file-loader'],
          as: '*.js',
        },
      },
      // External packages for server-side (Turbopack equivalent of webpack externals)
      resolveAlias: {
        three: 'three',
      },
    },
  },

  // Keep existing webpack config as fallback for production builds
  webpack: (config, { isServer }) => {
    // Handle GLTF/GLB files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });

    // Externalize three.js on server side to prevent SSR issues
    if (isServer) {
      config.externals.push('three');
    }

    return config;
  },
  reactStrictMode: true,
};

module.exports = withBundleAnalyzer(nextConfig);
