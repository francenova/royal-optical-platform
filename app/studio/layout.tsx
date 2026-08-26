import type { Metadata } from 'next';
export { viewport } from 'next-sanity/studio';

// next-sanity/studio's own metadata only sets referrer/robots (no title),
// so without this the root layout's landing-page title would leak into the
// Studio browser tab. `noindex` here is redundant with robots.ts disallowing
// /studio, but kept as defense in depth.
export const metadata: Metadata = {
  title: 'Studio — Royal Opticals',
  referrer: 'same-origin',
  robots: 'noindex',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
