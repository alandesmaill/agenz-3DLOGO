/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
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
