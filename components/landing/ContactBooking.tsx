'use client';

import { useState } from 'react';
import type { ContactSectionData } from '@/lib/siteSettings';

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

export function ContactBooking({ contact }: { contact: ContactSectionData }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', date: '' });
  const [status, setStatus] = useState<SubmitState>('idle');

  // Enter moves focus to the next field instead of submitting the form early.
  function focusNextField(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const form = e.currentTarget.form;
    if (!form) return;
    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>('input, select, textarea, button[type="submit"]')
    );
    const next = focusable[focusable.indexOf(e.currentTarget) + 1];
    next?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', service: '', date: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="bg-surface-container-high py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop" id="contact">
      <div className="md:max-w-container-max md:mx-auto md:grid md:grid-cols-12 md:gap-4">
        {/* Booking form */}
        <div className="glass-card p-7 md:p-12 rounded-[32px] md:rounded-[40px] mb-6 md:mb-0 md:col-span-7">
          <h2
            className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile text-on-surface mb-6 md:mb-8"
            data-animate="fade-up"
          >
            {contact.heading} <span className="text-primary">{contact.headingAccent}</span>
          </h2>
          <form className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8" onSubmit={handleSubmit} data-stagger>
            <div className="relative">
              <label className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-2 block">
                Your Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={focusNextField}
                className="w-full bg-transparent border-b-[1.5px] border-outline-variant focus:border-primary border-t-0 border-x-0 focus:ring-0 px-0 py-3 font-body-std text-body-lead placeholder:opacity-30"
              />
            </div>
            <div className="relative">
              <label className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-2 block">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={focusNextField}
                className="w-full bg-transparent border-b-[1.5px] border-outline-variant focus:border-primary border-t-0 border-x-0 focus:ring-0 px-0 py-3 font-body-std text-body-lead placeholder:opacity-30"
              />
            </div>
            <div className="relative">
              <label className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-2 block">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 90000 00000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onKeyDown={focusNextField}
                className="w-full bg-transparent border-b-[1.5px] border-outline-variant focus:border-primary border-t-0 border-x-0 focus:ring-0 px-0 py-3 font-body-std text-body-lead placeholder:opacity-30"
              />
            </div>
            <div className="relative">
              <label className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-2 block">
                Service Required
              </label>
              <input
                type="text"
                placeholder="e.g. Comprehensive Exam"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                onKeyDown={focusNextField}
                className="w-full bg-transparent border-b-[1.5px] border-outline-variant focus:border-primary border-t-0 border-x-0 focus:ring-0 px-0 py-3 font-body-std text-body-lead placeholder:opacity-30"
              />
            </div>
            <div className="relative">
              <label className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-2 block">
                Preferred Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                onKeyDown={focusNextField}
                className="w-full bg-transparent border-b-[1.5px] border-outline-variant focus:border-primary border-t-0 border-x-0 focus:ring-0 px-0 py-3 font-body-std text-body-lead"
              />
            </div>
            <div className="md:col-span-full md:mt-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary text-on-primary py-4 md:py-5 rounded-full font-label-mono uppercase tracking-[3px] md:tracking-[4px] text-sm md:text-base hover:bg-primary-container transition-all active:scale-95 shadow-xl red-glow disabled:opacity-60 disabled:active:scale-100"
              >
                {status === 'sending' ? 'Sending…' : 'Confirm Booking'}
              </button>
              {status === 'sent' && (
                <p className="mt-3 text-sm text-primary font-body-std" role="status">
                  Thanks — your request has been sent. We&apos;ll be in touch shortly.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-red-600 font-body-std" role="alert">
                  Something went wrong sending your request. Please call or WhatsApp us instead.
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Map + contact info */}
        <div className="flex flex-col gap-5 md:gap-6 md:col-span-5" data-animate="fade-left" data-parallax="0.08">
          <div className="glass-card rounded-[28px] md:rounded-[40px] overflow-hidden relative h-[260px] md:flex-grow md:min-h-[320px]">
            <iframe
              className="absolute inset-0 w-full h-full grayscale-[20%] contrast-125"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={contact.mapEmbedUrl}
              title="Royal Opticals location"
            />
            <div className="hidden md:block absolute bottom-6 left-6 right-6 p-8 glass-card rounded-3xl border border-primary/10 pointer-events-none">
              <h4 className="font-display-lg text-xl text-primary mb-2">VISIT THE STUDIO</h4>
              <p className="font-body-std text-on-surface-variant mb-4">
{contact.address}
              </p>
              <a
                href={contact.mapDirectionsUrl}
                target="_blank"
                rel="noopener"
                className="pointer-events-auto inline-flex items-center gap-2 text-primary font-label-mono text-xs uppercase hover:text-primary-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm">directions</span>
                Get Directions
              </a>
            </div>
          </div>

          {/* Mobile-only address card (desktop shows it overlaid on the map above) */}
          <div className="md:hidden glass-card p-6 rounded-[28px]">
            <h4 className="font-display-lg-mobile text-lg text-primary mb-2">VISIT THE STUDIO</h4>
            <p className="font-body-std text-sm text-on-surface-variant mb-4">
{contact.address}
            </p>
            <a
              href={contact.mapDirectionsUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-primary font-label-mono text-xs uppercase"
            >
              <span className="material-symbols-outlined text-sm">directions</span>
              Get Directions
            </a>
          </div>

          <div className="glass-card p-6 md:p-10 rounded-[28px] md:rounded-[40px] flex md:flex-row flex-col gap-4 justify-around items-stretch md:items-center">
            <a href={`tel:${contact.phone}`} className="flex md:flex-col items-center gap-4 md:gap-0 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-primary text-2xl md:text-3xl md:mb-2">call</span>
              <div>
                <p className="font-label-mono text-[10px] uppercase opacity-50">Speak with us</p>
                <p className="font-body-std font-bold text-sm md:text-base">{contact.phone}</p>
              </div>
            </a>
            <div className="hidden md:block w-px h-12 bg-outline-variant" />
            <div className="md:hidden w-full h-px bg-outline-variant" />
            <a
              href={`mailto:${contact.email}`}
              className="flex md:flex-col items-center gap-4 md:gap-0 hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-primary text-2xl md:text-3xl md:mb-2">mail</span>
              <div>
                <p className="font-label-mono text-[10px] uppercase opacity-50">Email inquiries</p>
                <p className="font-body-std font-bold text-sm md:text-base">{contact.email}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
