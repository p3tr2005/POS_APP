import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  // cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
