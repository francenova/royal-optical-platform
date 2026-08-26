const ALLOWED_SCHEMES = /^(https?:|mailto:|tel:)/i;

/**
 * Guards against `javascript:`/`data:`-style URI injection in CMS-editable
 * link fields. Sanity schema validation (see heroSection.ts, contactSection.ts)
 * stops new bad values from being saved, but this covers defense in depth —
 * a leaked write token or data written before validation existed could still
 * put an unsafe value in the dataset.
 */
export function safeHref(url: string | null | undefined, fallback = '#'): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (trimmed.startsWith('#')) return trimmed;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (ALLOWED_SCHEMES.test(trimmed)) return trimmed;
  return fallback;
}
