/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
