'use client';

import { useState } from 'react';

export const FALLBACK_FAQS = [
  {
    q: 'How often should I get an eye examination?',
    a: 'We recommend an eye check-up once every year. If you have diabetes, wear glasses, or notice changes in your vision, you may need more frequent eye exams.',
  },
  {
    q: 'What are the signs that I need an eye test?',
    a: 'You should book an eye test if you experience blurred vision, headaches, eye strain, difficulty seeing at night, double vision, or frequent changes in your eyesight.',
  },
  {
    q: 'Do you provide computer vision or digital eye strain tests?',
    a: 'Yes. We evaluate symptoms caused by long hours of screen use and recommend the right lenses, glasses, or treatments to reduce eye strain and improve comfort.',
  },
  {
    q: 'Can children have their eyes checked?',
    a: 'Absolutely. Regular eye examinations help detect vision problems early, supporting healthy learning and development. We recommend routine eye check-ups for children.',
  },
  {
    q: 'How long does a comprehensive eye examination take?',
    a: 'A complete eye examination usually takes 20–40 minutes, depending on your eye health and whether additional tests are needed.',
  },
  {
    q: 'Do I need an appointment for an eye check-up?',
    a: 'Appointments are recommended to reduce waiting time, but walk-in patients are also welcome whenever possible.',
  },
];

export function FAQClient({ faqs }: { faqs: typeof FALLBACK_FAQS }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-surface py-section-py-mobile md:py-section-py-desktop px-margin-mobile md:px-margin-desktop" id="faq">
      <div className="md:max-w-3xl md:mx-auto">
        <h2
          className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-8 md:mb-12 text-center"
          data-animate="fade-up"
        >
          FREQUENT QUESTIONS
        </h2>
        <div className="space-y-3 md:space-y-4" data-stagger>
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q + i} className="glass-card rounded-2xl transition-all">
                <button
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-3"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-headline-sm text-base md:text-lg text-on-surface">{item.q}</span>
                  <span
                    className="material-symbols-outlined transition-transform duration-300 flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                  >
                    add
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{ maxHeight: isOpen ? '500px' : '0px' }}
                >
                  <p className="px-5 md:px-6 pb-5 md:pb-6 font-body-std text-sm md:text-base text-on-surface-variant">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
