import type { NextConfig } from 'next';

// Applied to every route. Safe, low-risk hardening that doesn't depend on
// what a given page loads.
const globalSecurityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

// Scoped to the homepage only — deliberately NOT applied to /studio, since
// Sanity's embedded Studio is a large third-party app whose exact script/
// style/connect requirements aren't something we control or want to guess
// at with a restrictive policy.
const homepageCsp = [
  "default-src 'self'",
  // 'unsafe-inline' is needed for Next.js's own hydration scripts and our
  // JSON-LD script tag (no nonce wiring set up) — this does not fully
  // block inline-script injection, but connect-src/img-src/frame-ancestors
  // below still meaningfully limit what an injected script could do.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://cdn.sanity.io https://lh3.googleusercontent.com https://images.unsplash.com",
  "frame-src https://www.google.com",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: globalSecurityHeaders },
      { source: '/', headers: [{ key: 'Content-Security-Policy', value: homepageCsp }] },
    ];
  },
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
