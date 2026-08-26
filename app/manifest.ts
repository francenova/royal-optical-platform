import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Royal Opticals — Eye Clinic & Optical Studio',
    short_name: 'Royal Opticals',
    description: 'Comprehensive eye exams, expert lens fitting, and curated frames.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9f8',
    theme_color: '#8e001b',
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  };
}
