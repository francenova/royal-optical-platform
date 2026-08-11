import type { ContactSectionData } from '@/lib/siteSettings';

export function WhatsAppButton({ contact }: { contact: ContactSectionData }) {
  return (
    <a
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:bottom-6 right-5 md:right-6 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(183,16,42,0.3)] active:scale-95 md:hover:scale-110 transition-transform z-50"
      href={`https://wa.me/${contact.whatsappNumber}`}
      aria-label="Message on WhatsApp"
    >
      <span className="material-symbols-outlined text-2xl md:text-3xl">chat</span>
    </a>
  );
}
