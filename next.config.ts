import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity's image CDN will be added here once wired up.
    ],
  },
};

export default nextConfig;
