import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@takumi-rs/core'],
  reactCompiler: false,
  cacheComponents: true,
  cacheLife: {
    hourly: {
      stale: 3600,
      revalidate: 3600,
      expire: 86400,
    },
  },
};

export default nextConfig;
