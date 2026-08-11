'use client';

import { useState } from 'react';
import type { BrandingSectionData, ContactSectionData, FooterSectionData } from '@/lib/siteSettings';

export function Footer({
  branding,
  contact,
  footer,
}: {
  branding: BrandingSectionData;
  contact: ContactSectionData;
  footer: FooterSectionData;
}) {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent('Newsletter Signup');
    const body = encodeURIComponent('Please add this email to the Royal Opticals newsletter list: ' + email);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <footer className="bg-inverse-surface dark:bg-nightbg text-surface-variant/70 font-body-std py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop">
      <div className="md:max-w-[1360px] md:mx-auto flex flex-col gap-10 md:grid md:grid-cols-4 md:gap-gutter-desktop" data-stagger>
        {/* Brand */}
        <div className="flex flex-col gap-5 md:gap-6">
          <span className="font-display-lg-mobile md:font-display-lg text-2xl md:text-display-lg text-surface-container-lowest tracking-tight">
            {branding.clinicName?.toUpperCase() || 'ROYAL OPTICALS'}
          </span>
          <p className="text-body-std leading-relaxed text-sm md:text-base">
            {branding.footerDescription}
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
              href={`tel:${contact.phone}`}
              aria-label="Call Royal Opticals"
            >
              <span className="material-symbols-outlined text-on-primary">call</span>
            </a>
            <a
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
              href={`https://wa.me/${contact.whatsappNumber}`}
              target="_blank"
              rel="noopener"
              aria-label="Message on WhatsApp"
            >
              <span className="material-symbols-outlined text-on-primary">chat</span>
            </a>
            <a
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300"
              href={`mailto:${contact.email}`}
              aria-label="Email Royal Opticals"
            >
              <span className="material-symbols-outlined text-on-primary">mail</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:contents">
          {/* Navigation */}
          <div>
            <h4 className="font-label-mono text-primary-fixed uppercase tracking-widest mb-5 md:mb-8 text-xs">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3 md:gap-4 text-sm md:text-base">
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#home">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#clinic">
                  Our Clinic
                </a>
              </li>
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#catalog">
                  Catalog
                </a>
              </li>
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#clinic">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Patient Portal */}
          <div>
            <h4 className="font-label-mono text-primary-fixed uppercase tracking-widest mb-5 md:mb-8 text-xs">
              Patient Portal
            </h4>
            <ul className="flex flex-col gap-3 md:gap-4 text-sm md:text-base">
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#">
                  Patient Portal
                </a>
              </li>
              <li>
                <a className="hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 block" href="#">
                  Store Locator
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-label-mono text-primary-fixed uppercase tracking-widest mb-5 md:mb-8 text-xs">
            {footer.newsletterHeading}
          </h4>
          <p className="text-body-std mb-4 md:mb-6 text-sm md:text-base">
            {footer.newsletterDescription}
          </p>
          <form className="relative" onSubmit={handleSubmit}>
            <input
              required
              type="email"
              placeholder="email@address.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none placeholder:opacity-30 text-sm md:text-base"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="absolute right-2 top-2 bg-primary text-on-primary w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-lg md:text-base">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>

      <div className="md:max-w-[1360px] md:mx-auto mt-14 md:mt-20 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-xs md:text-base">
        <p>{footer.copyrightText}</p>
        <div className="flex flex-col md:flex-row gap-1 md:gap-8 opacity-50">
          <p>{footer.designPhilosophy}</p>
          <p>{footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
