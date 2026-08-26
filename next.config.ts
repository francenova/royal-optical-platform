import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Lets the dev server accept requests from other devices on the LAN
  // (e.g. testing the mobile layout on a phone via the Network URL).
  // Without this, Next.js 15's dev server rejects cross-origin asset/HMR
  // requests and the page loads but never hydrates correctly.
  allowedDevOrigins: ['192.168.137.1', '10.157.44.16'],
};

export default nextConfig;
