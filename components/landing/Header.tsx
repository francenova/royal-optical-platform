'use client';

import { useState } from 'react';
import type { BrandingSectionData } from '@/lib/siteSettings';
import { urlFor } from '@/lib/sanity/client';

const NAV_LINKS = [
  { href: '#clinic', label: 'Clinic' },
  { href: '#services', label: 'Services' },
  { href: '#catalog', label: 'Catalog' },
  { href: '#clinic', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const FALLBACK_LOGO_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDVqgEgOZ1BhY5OiM3KUdClVlhjYzIRn0ecQsyOdTAgsqi_AXVjP9I84IxlhBS3__zNeWzFJKpzZGhCXI6ecWWPqcU3Xc9vfjfUfMEC0kzStlA_KMSYZ47XnTN35h7qu8Aa795TLBTJT6lAW3B9j90V-4GmHO7ACLcENcuenRGWcDdNcL_5gGCDOzAAw_cPminplD2-Vs9Fq-ZsNpxKPIY8S82qw-Kl43FG3il7AJl-Xf_tNd7NRn-TlHZSE0FfeISrf-sNuWNFsGw';

export function Header({ branding }: { branding: BrandingSectionData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSrc = branding.logo ? urlFor(branding.logo).width(200).height(200).url() : FALLBACK_LOGO_SRC;

  return (
    <header
      id="site-header"
      className="fixed top-0 w-full z-50 bg-glass-white backdrop-blur-3xl border-b border-white/90 shadow-[0_4px_20px_rgba(142,0,27,0.08)]"
    >
      <nav className="flex justify-between items-center max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop h-16 md:h-20">
        <a className="flex items-center gap-2 md:gap-3" href="#home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`${branding.clinicName || 'Royal Opticals'} Logo`}
            className="w-auto object-contain h-11 md:h-20"
            src={logoSrc}
          />
          <span className="font-display-lg text-base md:text-xl text-primary tracking-tight uppercase">
            {branding.clinicName || 'Royal Opticals'}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 font-body-std text-body-std uppercase tracking-wider">
          {NAV_LINKS.map((link, i) => (
            <a
              key={`${link.label}-${i}`}
              className="text-on-surface-variant hover:text-primary transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          className="hidden md:block bg-primary text-on-primary px-6 py-2.5 rounded-full font-body-std uppercase tracking-wider hover:bg-primary-container transition-all active:scale-95"
          href="#contact"
        >
          Book Appointment
        </a>

        <button
          className="md:hidden text-primary"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="material-symbols-outlined text-3xl">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </nav>

      <div
        id="mobile-menu-panel"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-glass-white backdrop-blur-3xl border-t border-white/60 ${
          menuOpen ? 'menu-open' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col px-margin-mobile py-6 gap-1 font-body-std uppercase tracking-wider text-on-surface-variant">
          {NAV_LINKS.map((link, i) => (
            <a
              key={`${link.label}-mobile-${i}`}
              className="py-3 border-b border-outline-variant/40 last:border-b-0 hover:text-primary transition-colors"
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            className="bg-primary text-on-primary px-6 py-3 rounded-full font-body-std uppercase tracking-wider text-center mt-4"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Book Appointment
          </a>
        </div>
      </div>
    </header>
  );
}
