/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Client side ke liye canvas ko mock karo
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;