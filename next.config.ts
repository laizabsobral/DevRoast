import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@takumi-rs/core'],
  reactCompiler: false,
};

export default nextConfig;
